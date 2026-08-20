using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;

namespace PetHaven.Services
{
    public class VetDashboardService : IVetDashboardService
    {
        private readonly ApplicationDbContext _context;

        public VetDashboardService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // Helper: جلب حساب الطبيب البيطري من معرف المستخدم
        // ═══════════════════════════════════════════════════════════════════════
        private async Task<Vet> GetVetAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");

            var vet = await _context.Vets
                .FirstOrDefaultAsync(v => v.UserId == parsedUserId);

            if (vet == null)
                throw new Exception("لم يتم العثور على حساب الطبيب البيطري.");

            return vet;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // 1. بطاقات الإحصائيات (KPI Cards)
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<VetDashboardStatsDto> GetDashboardStatsAsync(string userId)
        {
            var vet = await GetVetAsync(userId);
            var today = DateTime.UtcNow.Date;
            var startOfMonth = new DateTime(today.Year, today.Month, 1);

            // إجمالي المرضى: عدد الحيوانات الفريدة التي حجزت موعداً لدى الطبيب
            var totalPatients = await _context.Appointments
                .Where(a => a.VetId == vet.VetId)
                .Select(a => a.PetId)
                .Distinct()
                .CountAsync();

            var todayAppointments = await _context.Appointments
                .Where(a => a.VetId == vet.VetId && a.AppointmentDate.Date == today)
                .ToListAsync();

            var appointmentsTodayCount = todayAppointments.Count;
            var remainingTodayCount = todayAppointments.Count(a =>
                a.Status != "Completed" && a.Status != "Cancelled");

            var reviews = await _context.Ratings
                .CountAsync(r => r.TargetType == "Vet" && r.TargetId == vet.VetId);

            // لا يوجد جدول إيرادات مرتبط بالطبيب حالياً، لذلك يعاد صفر
            decimal revenueThisMonth = 0;

            return new VetDashboardStatsDto
            {
                TotalPatients = totalPatients,
                AppointmentsToday = appointmentsTodayCount,
                RemainingAppointmentsToday = remainingTodayCount,
                Reviews = reviews,
                RevenueThisMonth = revenueThisMonth
            };
        }

        // ═══════════════════════════════════════════════════════════════════════
        // 2. نشاط العيادة (Clinic Activity Chart) - أسبوعي أو شهري
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<IEnumerable<ClinicActivityPointDto>> GetClinicActivityAsync(string userId, string period)
        {
            var vet = await GetVetAsync(userId);
            var today = DateTime.UtcNow.Date;

            var monthly = string.Equals(period, "monthly", StringComparison.OrdinalIgnoreCase);

            List<DateTime> days;
            if (monthly)
            {
                var startOfMonth = new DateTime(today.Year, today.Month, 1);
                days = Enumerable.Range(0, DateTime.DaysInMonth(today.Year, today.Month))
                    .Select(d => startOfMonth.AddDays(d))
                    .ToList();
            }
            else
            {
                // الأسبوع يبدأ من الإثنين (Monday) وينتهي الأحد (Sunday)
                var monday = today.AddDays(-(((int)today.DayOfWeek + 6) % 7));
                days = Enumerable.Range(0, 7).Select(d => monday.AddDays(d)).ToList();
            }

            var start = days.First();
            var end = days.Last().AddDays(1);

            var counts = await _context.Appointments
                .Where(a => a.VetId == vet.VetId
                            && a.AppointmentDate.Date >= start
                            && a.AppointmentDate.Date < end)
                .GroupBy(a => a.AppointmentDate.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Date);

            return days.Select(d => new ClinicActivityPointDto
            {
                Label = monthly ? d.ToString("MMM d") : d.ToString("ddd"),
                Count = counts.TryGetValue(d, out var c) ? c.Count : 0
            }).ToList();
        }

        // ═══════════════════════════════════════════════════════════════════════
        // 3. توزيع المواعيد حسب الفئة (Appointment Breakdown)
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<IEnumerable<AppointmentBreakdownDto>> GetAppointmentBreakdownAsync(string userId)
        {
            var vet = await GetVetAsync(userId);

            var reasons = await _context.Appointments
                .Where(a => a.VetId == vet.VetId && a.Reason != null)
                .Select(a => a.Reason!)
                .ToListAsync();

            var total = reasons.Count;

            var categories = new (string Category, Func<string, bool> Match)[]
            {
                ("Check-ups", r => r.Contains("check", StringComparison.OrdinalIgnoreCase)
                                    || r.Contains("فحص", StringComparison.OrdinalIgnoreCase)),
                ("Vaccinations", r => r.Contains("vaccin", StringComparison.OrdinalIgnoreCase)
                                    || r.Contains("تطعيم", StringComparison.OrdinalIgnoreCase)),
                ("Surgeries", r => r.Contains("surger", StringComparison.OrdinalIgnoreCase)
                                    || r.Contains("جراح", StringComparison.OrdinalIgnoreCase))
            };

            var result = categories.Select(cat =>
            {
                var count = reasons.Count(cat.Match);
                return new AppointmentBreakdownDto
                {
                    Category = cat.Category,
                    Count = count,
                    Percentage = total == 0 ? 0 : Math.Round(count * 100.0 / total, 1)
                };
            }).ToList();

            var otherCount = total - result.Sum(x => x.Count);
            result.Add(new AppointmentBreakdownDto
            {
                Category = "Other",
                Count = otherCount,
                Percentage = total == 0 ? 0 : Math.Round(otherCount * 100.0 / total, 1)
            });

            return result;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // 4. السلالات الأكثر تردداً (Top Pet Breeds)
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<IEnumerable<TopBreedDto>> GetTopBreedsAsync(string userId, int limit)
        {
            var vet = await GetVetAsync(userId);

            var total = await _context.Appointments
                .CountAsync(a => a.VetId == vet.VetId && a.Pet != null && a.Pet.Breed != null);

            var breeds = await _context.Appointments
                .Where(a => a.VetId == vet.VetId && a.Pet != null && a.Pet.Breed != null)
                .GroupBy(a => a.Pet!.Breed!)
                .Select(g => new { Breed = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(limit)
                .ToListAsync();

            return breeds.Select(b => new TopBreedDto
            {
                Breed = b.Breed,
                Count = b.Count,
                Percentage = total == 0 ? 0 : Math.Round(b.Count * 100.0 / total, 1)
            }).ToList();
        }

        // ═══════════════════════════════════════════════════════════════════════
        // 5. المرضى الأخيرون (Recent Patients)
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<IEnumerable<RecentPatientDto>> GetRecentPatientsAsync(string userId, int count, string? search)
        {
            var vet = await GetVetAsync(userId);

            var query = _context.Appointments
                .Where(a => a.VetId == vet.VetId && a.Pet != null)
                .GroupBy(a => new
                {
                    a.PetId,
                    a.Pet!.PetName,
                    a.Pet.Species,
                    a.Pet.Breed,
                    a.Pet.ImageURL
                })
                .Select(g => new RecentPatientDto
                {
                    PetId = g.Key.PetId,
                    PetName = g.Key.PetName,
                    Species = g.Key.Species,
                    Breed = g.Key.Breed,
                    ImageUrl = g.Key.ImageURL,
                    LastVisitDate = g.Max(a => a.AppointmentDate),
                    VisitCount = g.Count()
                });

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();
                query = query.Where(p => p.PetName.Contains(term)
                                         || (p.Breed != null && p.Breed.Contains(term)));
            }

            return await query
                .OrderByDescending(p => p.LastVisitDate)
                .Take(count)
                .ToListAsync();
        }

        // ═══════════════════════════════════════════════════════════════════════
        // 6. مواعيد اليوم (Today's Schedule)
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<IEnumerable<AppointmentResponseDto>> GetTodayScheduleAsync(string userId)
        {
            var vet = await GetVetAsync(userId);
            var today = DateTime.UtcNow.Date;

            var appointments = await _context.Appointments
                .Where(a => a.VetId == vet.VetId && a.AppointmentDate.Date == today)
                .Include(a => a.Pet)
                .Include(a => a.Adopter)!.ThenInclude(ad => ad!.User)
                .OrderBy(a => a.AppointmentDate)
                .ToListAsync();

            return appointments.Select(a => new AppointmentResponseDto
            {
                AppointmentId = a.AppointmentId,
                PetId = a.PetId,
                PetName = a.Pet?.PetName ?? "غير معروف",
                Species = a.Pet?.Species,
                Breed = a.Pet?.Breed,
                PetImageUrl = a.Pet?.ImageURL,
                OwnerName = a.Adopter?.User?.FullName ?? "غير معروف",
                AppointmentDate = a.AppointmentDate,
                Status = a.Status,
                Reason = a.Reason,
                TimeDisplay = a.AppointmentDate.ToString("hh:mm tt")
            });
        }
    }
}
