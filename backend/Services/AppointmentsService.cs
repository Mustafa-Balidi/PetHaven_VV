using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.Models;
using PetHaven.DTOs;

namespace PetHaven.Services
{
    public class AppointmentsService : IAppointmentsService
    {
        // Application-level defaults. Vet working hours and appointment duration
        // are not persisted in the current database schema.
        private static readonly TimeSpan DefaultStartTime = new(9, 0, 0);
        private static readonly TimeSpan DefaultEndTime = new(17, 0, 0);
        private const int SlotDurationMinutes = 30;

        private readonly ApplicationDbContext _context;

        public AppointmentsService(ApplicationDbContext context)
        {
            _context = context;
        }

        //****** لوحة التحكم *****/
        // ═══════════════════════════════════════════════════════════════
        // جلب جدول مواعيد الطبيب
        // ═══════════════════════════════════════════════════════════════
        public async Task<IEnumerable<AppointmentResponseDto>> GetVetScheduleAsync(int vetUserId, DateTime? date)
        {
            var vet = await _context.Vets.FirstOrDefaultAsync(v => v.UserId == vetUserId);
            if (vet == null) throw new UnauthorizedAccessException("هوية الطبيب غير معروفة.");

            var targetDate = date ?? DateTime.Today;

            var query = _context.Appointments
                .Where(a => a.VetId == vet.VetId && a.AppointmentDate.Date == targetDate.Date)
                .Include(a => a.Pet)
                .Include(a => a.Adopter)!.ThenInclude(ad => ad!.User)
                .OrderBy(a => a.AppointmentDate);

            var appointments = await query.ToListAsync();

            return appointments.Select(MapToDto);
        }

        // ═══════════════════════════════════════════════════════════════
        // إحصائيات مواعيد اليوم (بطاقات الملخص)
        // ═══════════════════════════════════════════════════════════════
        public async Task<AppointmentSummaryDto> GetVetSummaryAsync(int vetUserId, DateTime? date)
        {
            var vet = await _context.Vets.FirstOrDefaultAsync(v => v.UserId == vetUserId);
            if (vet == null) throw new UnauthorizedAccessException("هوية الطبيب غير معروفة.");

            var targetDate = date ?? DateTime.Today;

            var todayAppointments = await _context.Appointments
                .Where(a => a.VetId == vet.VetId && a.AppointmentDate.Date == targetDate.Date)
                .ToListAsync();

            return new AppointmentSummaryDto
            {
                TotalToday   = todayAppointments.Count,
                PendingCount = todayAppointments.Count(a => a.Status == "Pending"),
                ConfirmedCount = todayAppointments.Count(a => a.Status == "Confirmed"),
                CancelledCount = todayAppointments.Count(a => a.Status == "Cancelled"),
                CompletedCount = todayAppointments.Count(a => a.Status == "Completed")
            };
        }

        //*** عمليات الطبيب ******/
        // ═══════════════════════════════════════════════════════════════
        // تحديث حالة الموعد (مقيد بطبيب الطلب)
        // ═══════════════════════════════════════════════════════════════
        public async Task<bool> UpdateAppointmentStatusAsync(int appointmentId, string status, int vetUserId)
        {
            var vet = await _context.Vets.FirstOrDefaultAsync(v => v.UserId == vetUserId);
            if (vet == null) throw new UnauthorizedAccessException("هوية الطبيب غير معروفة.");

            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);
            if (appointment == null) return false;

            // التأكد من أن الموعد يخص الطبيب الحالي فقط
            if (appointment.VetId != vet.VetId)
                throw new UnauthorizedAccessException("لا يمكنك تعديل موعد لا يخصك.");

            appointment.Status = status;
            await _context.SaveChangesAsync();
            return true;
        }
        // ═══════════════════════════════════════════════════════════════
        // إعادة جدولة موعد
        // ═══════════════════════════════════════════════════════════════
        public async Task<bool> RescheduleAppointmentAsync(int appointmentId, DateTime newDate, int vetUserId)
        {
            var vet = await _context.Vets.FirstOrDefaultAsync(v => v.UserId == vetUserId);
            if (vet == null) throw new UnauthorizedAccessException("هوية الطبيب غير معروفة.");

            if (newDate <= DateTime.Now)
                throw new ArgumentException("لا يمكن نقل الموعد إلى وقت سابق أو الحالي.");

            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);
            if (appointment == null) return false;

            if (appointment.VetId != vet.VetId)
                throw new UnauthorizedAccessException("لا يمكنك تعديل موعد لا يخصك.");

            if (!await IsSlotAvailableAsync(appointment.VetId, newDate, appointment.AppointmentId))
                throw new ArgumentException("وقت الموعد المحدد لم يعد متاحًا.");

            appointment.AppointmentDate = newDate;
            await _context.SaveChangesAsync();
            return true;
        }

        //***  عمليات المربي  ******/
        public async Task<IEnumerable<AdopterAppointmentDto>> GetAdopterAppointmentsAsync(int adopterUserId)
        {
            var adopter = await ResolveAdopterAsync(adopterUserId);

            return await _context.Appointments
                .Where(a => a.AdopterId == adopter.AdopterId)
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new AdopterAppointmentDto
                {
                    AppointmentId = a.AppointmentId,
                    PetId = a.PetId,
                    PetName = a.Pet != null ? a.Pet.PetName : string.Empty,
                    VetId = a.VetId,
                    VetName = a.Vet != null ? a.Vet.FullName : string.Empty,
                    AppointmentDate = a.AppointmentDate,
                    Reason = a.Reason,
                    Status = a.Status
                })
                .ToListAsync();
        }

        public async Task<AdopterAppointmentDto?> GetAdopterAppointmentAsync(int appointmentId, int adopterUserId)
        {
            var adopter = await ResolveAdopterAsync(adopterUserId);

            return await _context.Appointments
                .Where(a => a.AppointmentId == appointmentId && a.AdopterId == adopter.AdopterId)
                .Select(a => new AdopterAppointmentDto
                {
                    AppointmentId = a.AppointmentId,
                    PetId = a.PetId,
                    PetName = a.Pet != null ? a.Pet.PetName : string.Empty,
                    VetId = a.VetId,
                    VetName = a.Vet != null ? a.Vet.FullName : string.Empty,
                    AppointmentDate = a.AppointmentDate,
                    Reason = a.Reason,
                    Status = a.Status
                })
                .FirstOrDefaultAsync();
        }

        public async Task<AppointmentAvailabilityDto> GetAvailableSlotsAsync(int vetId, DateTime date)
        {
            if (vetId <= 0)
                throw new ArgumentException("معرّف الطبيب غير صالح.");

            var vet = await _context.Vets
                .AsNoTracking()
                .FirstOrDefaultAsync(v => v.VetId == vetId);

            if (vet == null)
                throw new KeyNotFoundException("الطبيب البيطري المطلوب غير موجود.");

            if (!vet.IsVerified)
                throw new ArgumentException("الطبيب البيطري غير متاح للحجز حاليًا.");

            var requestedDate = date.Date;
            if (requestedDate < DateTime.Today)
                throw new ArgumentException("لا يمكن عرض مواعيد متاحة لتاريخ سابق.");

            var dayStart = requestedDate;
            var dayEnd = requestedDate.AddDays(1);
            var slotDuration = TimeSpan.FromMinutes(SlotDurationMinutes);
            var busyStarts = await _context.Appointments
                .AsNoTracking()
                .Where(a => a.VetId == vetId
                    && a.Status != "Cancelled"
                    && a.AppointmentDate < dayEnd
                    && a.AppointmentDate.AddMinutes(SlotDurationMinutes) > dayStart)
                .Select(a => a.AppointmentDate)
                .ToListAsync();

            var now = DateTime.Now;
            var availableSlots = new List<string>();
            for (var slotStart = requestedDate.Add(DefaultStartTime);
                 slotStart.Add(slotDuration) <= requestedDate.Add(DefaultEndTime);
                 slotStart = slotStart.Add(slotDuration))
            {
                if (requestedDate == now.Date && slotStart <= now)
                    continue;

                var slotEnd = slotStart.Add(slotDuration);
                var overlaps = busyStarts.Any(existingStart =>
                    existingStart < slotEnd && existingStart.Add(slotDuration) > slotStart);

                if (!overlaps)
                    availableSlots.Add(slotStart.ToString("HH:mm"));
            }

            return new AppointmentAvailabilityDto
            {
                VetId = vetId,
                Date = requestedDate.ToString("yyyy-MM-dd"),
                SlotDurationMinutes = SlotDurationMinutes,
                AvailableSlots = availableSlots
            };
        }

        public async Task<bool> RescheduleAdopterAppointmentAsync(
            int appointmentId,
            DateTime newDate,
            int adopterUserId)
        {
            if (newDate <= DateTime.Now)
                throw new ArgumentException("لا يمكن نقل الموعد إلى وقت سابق أو الحالي.");

            var adopter = await ResolveAdopterAsync(adopterUserId);
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);

            if (appointment == null) return false;

            if (appointment.AdopterId != adopter.AdopterId)
                throw new UnauthorizedAccessException("لا يمكنك تعديل موعد لا يخصك.");

            if (appointment.Status != "Pending" && appointment.Status != "Confirmed")
                throw new ArgumentException("يمكن إعادة جدولة المواعيد المعلقة أو المؤكدة فقط.");

            if (!await IsSlotAvailableAsync(appointment.VetId, newDate, appointment.AppointmentId))
                throw new ArgumentException("وقت الموعد المحدد لم يعد متاحًا.");

            appointment.AppointmentDate = newDate;
            await _context.SaveChangesAsync();
            return true;
        }

        //  إضافة طلب الحجز 
        public async Task<Appointment> BookAppointmentAsync(CreateAppointmentDto dto, int currentUserId)
        {
            // أ) التحقق من التاريخ
            if (dto.AppointmentDate <= DateTime.Now)
            {
                throw new ArgumentException("لا يمكن حجز موعد في وقت سابق أو في الوقت الحالي.");
            }

            // ب) التحقق من أن الـ VetId يخص طبيباً فعلياً ومسجلاً
            var vet = await _context.Vets
                .AsNoTracking()
                .FirstOrDefaultAsync(v => v.VetId == dto.VetId);
            if (vet == null)
            {
                throw new KeyNotFoundException("فشل الحجز: المعرّف المرسل لا يخص طبيباً بيطرياً مسجلاً في النظام.");
            }
            if (!vet.IsVerified)
                throw new ArgumentException("الطبيب البيطري غير متاح للحجز حاليًا.");

            // ج) جلب الـ AdopterId المرتبط بـ الـ UserId الحالي
            var adopter = await _context.Adopters.FirstOrDefaultAsync(a => a.UserId == currentUserId);
            if (adopter == null)
            {
                throw new UnauthorizedAccessException("يوجد خطأ في بيانات المربي (السجل غير موجود)");
            }

            // Re-check immediately before creation because the availability response is advisory.
            if (!await IsSlotAvailableAsync(dto.VetId, dto.AppointmentDate))
                throw new ArgumentException("وقت الموعد المحدد لم يعد متاحًا.");

            // د) إنشاء كائن الموعد بعد نجاح كل الشروط
            var appointment = new Appointment
            {
                AdopterId = adopter.AdopterId,
                PetId = dto.PetId,
                VetId = dto.VetId,
                AppointmentDate = dto.AppointmentDate,
                Reason = dto.Reason,
                Status = "Pending"
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            
            return appointment;
        }

        // ═══════════════════════════════════════════════════════════════
        // إلغاء موعد 
        // ═══════════════════════════════════════════════════════════════
        public async Task<bool> CancelAppointmentAsync(int appointmentId, int adopterUserId)
        {
            var adopter = await _context.Adopters.FirstOrDefaultAsync(a => a.UserId == adopterUserId);
            if (adopter == null) throw new UnauthorizedAccessException("هوية المربي غير معروفة.");

            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);
            if (appointment == null) return false;

            // التأكد من أن الموعد يخص المربي الحالي فقط
            if (appointment.AdopterId != adopter.AdopterId)
                throw new UnauthorizedAccessException("لا يمكنك إلغاء موعد لا يخصك.");

            appointment.Status = "Cancelled";
            await _context.SaveChangesAsync();
            return true;
        }

        // ═══════════════════════════════════════════════════════════════
        // Helper: تحويل كيان الموعد إلى DTO
        // ═══════════════════════════════════════════════════════════════
        private AppointmentResponseDto MapToDto(Appointment a)
        {
            return new AppointmentResponseDto
            {
                AppointmentId   = a.AppointmentId,
                PetId           = a.PetId,
                PetName         = a.Pet?.PetName ?? "غير معروف",
                Species         = a.Pet?.Species,
                Breed           = a.Pet?.Breed,
                PetImageUrl     = a.Pet?.ImageURL,
                OwnerName       = a.Adopter?.User?.FullName ?? "غير معروف",
                AppointmentDate = a.AppointmentDate,
                Status          = a.Status,
                Reason          = a.Reason,
                TimeDisplay     = a.AppointmentDate.ToString("hh:mm tt")
            };
        }

        private async Task<Adopter> ResolveAdopterAsync(int adopterUserId)
        {
            return await _context.Adopters
                .FirstOrDefaultAsync(a => a.UserId == adopterUserId)
                ?? throw new UnauthorizedAccessException("هوية المربي غير معروفة.");
        }

        private async Task<bool> IsSlotAvailableAsync(
            int vetId,
            DateTime appointmentDate,
            int? excludeAppointmentId = null)
        {
            if (appointmentDate <= DateTime.Now || !IsConfiguredSlot(appointmentDate))
                return false;

            var slotEnd = appointmentDate.AddMinutes(SlotDurationMinutes);
            return !await _context.Appointments
                .AsNoTracking()
                .AnyAsync(a => a.VetId == vetId
                    && (!excludeAppointmentId.HasValue || a.AppointmentId != excludeAppointmentId.Value)
                    && a.Status != "Cancelled"
                    && a.AppointmentDate < slotEnd
                    && a.AppointmentDate.AddMinutes(SlotDurationMinutes) > appointmentDate);
        }

        private static bool IsConfiguredSlot(DateTime appointmentDate)
        {
            var time = appointmentDate.TimeOfDay;
            var slotDuration = TimeSpan.FromMinutes(SlotDurationMinutes);
            return time >= DefaultStartTime
                && time.Add(slotDuration) <= DefaultEndTime
                && (time - DefaultStartTime).Ticks % slotDuration.Ticks == 0;
        }
    }
}
