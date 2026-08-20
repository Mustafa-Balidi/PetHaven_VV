using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;

namespace PetHaven.Services
{
    public class PatientsService : IPatientsService
    {
        private readonly ApplicationDbContext _context;

        public PatientsService(ApplicationDbContext context)
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
        // Helper: التأكد من أن الحيوان من مرضى هذا الطبيب
        // ═══════════════════════════════════════════════════════════════════════
        private async Task EnsurePetBelongsToVetAsync(int vetId, int petId)
        {
            var exists = await _context.Appointments
                .AnyAsync(a => a.VetId == vetId && a.PetId == petId);

            if (!exists)
                throw new UnauthorizedAccessException("هذا المريض لا يخص عيادتك.");
        }

        // ═══════════════════════════════════════════════════════════════════════
        // 1. إحصائيات بطاقات صفحة دليل المرضى
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<VetPatientsStatsDto> GetPatientsStatsAsync(string userId)
        {
            var vet = await GetVetAsync(userId);
            var from30DaysAgo = DateTime.UtcNow.Date.AddDays(-30);

            var patientGroups = await _context.Appointments
                .Where(a => a.VetId == vet.VetId)
                .GroupBy(a => a.PetId)
                .Select(g => new
                {
                    PetId = g.Key,
                    FirstVisit = g.Min(a => a.AppointmentDate),
                    HasActive = g.Any(a => a.Status != "Completed" && a.Status != "Cancelled")
                })
                .ToListAsync();

            return new VetPatientsStatsDto
            {
                TotalPatients = patientGroups.Count,
                ActiveCases = patientGroups.Count(p => p.HasActive),
                RecentlyAdded30d = patientGroups.Count(p => p.FirstVisit.Date >= from30DaysAgo)
            };
        }

        // ═══════════════════════════════════════════════════════════════════════
        // 2. قائمة المرضى (مع بحث/فلترة/ترقيم صفحات)
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<PatientListPageDto> GetPatientsAsync(string userId, string? search, string? species, string? status, int page, int pageSize)
        {
            var vet = await GetVetAsync(userId);

            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 12;

            var query = _context.Appointments
                .Where(a => a.VetId == vet.VetId && a.Pet != null)
                .GroupBy(a => new
                {
                    a.PetId,
                    a.Pet!.PetName,
                    a.Pet.Species,
                    a.Pet.Breed,
                    a.Pet.Age,
                    a.Pet.Gender,
                    a.Pet.ImageURL,
                    a.Pet.HealthStatus
                })
                .Select(g => new PatientListDto
                {
                    PetId = g.Key.PetId,
                    PetName = g.Key.PetName,
                    Species = g.Key.Species,
                    Breed = g.Key.Breed,
                    Age = g.Key.Age,
                    Gender = g.Key.Gender,
                    ImageUrl = g.Key.ImageURL,
                    HealthStatus = g.Key.HealthStatus,
                    LastVisitDate = g.Max(a => a.AppointmentDate),
                    VisitCount = g.Count()
                });

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();
                query = query.Where(p => p.PetName.Contains(term)
                                         || (p.Breed != null && p.Breed.Contains(term))
                                         || (p.Species != null && p.Species.Contains(term)));
            }

            if (!string.IsNullOrWhiteSpace(species))
            {
                var sp = species.Trim();
                query = query.Where(p => p.Species != null && p.Species.Contains(sp));
            }

            var items = await query
                .OrderByDescending(p => p.LastVisitDate)
                .ToListAsync();

            await EnrichPatientsAsync(vet.VetId, items);

            if (!string.IsNullOrWhiteSpace(status))
            {
                var st = status.Trim();
                items = items.Where(p => string.Equals(p.Status, st, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            var total = items.Count;
            var paged = items.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            return new PatientListPageDto
            {
                TotalCount = total,
                Page = page,
                PageSize = pageSize,
                Items = paged
            };
        }

        // ═══════════════════════════════════════════════════════════════════════
        // 3. تفاصيل مريض كاملة
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<PatientDetailDto> GetPatientDetailAsync(string userId, int petId)
        {
            var vet = await GetVetAsync(userId);
            await EnsurePetBelongsToVetAsync(vet.VetId, petId);

            var pet = await _context.Pets
                .FirstOrDefaultAsync(p => p.PetId == petId);

            if (pet == null)
                throw new Exception("المريض غير موجود.");

            var appointments = await _context.Appointments
                .Where(a => a.PetId == petId && a.VetId == vet.VetId)
                .Include(a => a.Adopter)!.ThenInclude(ad => ad!.User)
                .OrderByDescending(a => a.AppointmentDate)
                .ToListAsync();

            var last = appointments.FirstOrDefault();
            var single = new PatientListDto
            {
                PetId = pet.PetId,
                PetName = pet.PetName,
                Species = pet.Species,
                Breed = pet.Breed,
                Age = pet.Age,
                Gender = pet.Gender,
                ImageUrl = pet.ImageURL,
                HealthStatus = pet.HealthStatus,
                LastVisitDate = last?.AppointmentDate,
                VisitCount = appointments.Count
            };

            await EnrichPatientsAsync(vet.VetId, new List<PatientListDto> { single });

            return new PatientDetailDto
            {
                PetId = pet.PetId,
                PetName = pet.PetName,
                Species = pet.Species,
                Breed = pet.Breed,
                Age = pet.Age,
                Gender = pet.Gender,
                ImageUrl = pet.ImageURL,
                HealthStatus = pet.HealthStatus,
                Status = single.Status,
                OwnerName = single.OwnerName,
                PatientIdDisplay = $"#PT-{pet.PetId:000000}",
                LastVisitDate = last?.AppointmentDate,
                VisitCount = appointments.Count,
                MedicalHistory = await GetMedicalHistoryInternalAsync(petId),
                Vaccinations = await GetPetVaccinationsInternalAsync(petId)
            };
        }

        // ═══════════════════════════════════════════════════════════════════════
        // 4. السجل الطبي (من الفحوصات - Diagnoses)
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<IEnumerable<MedicalHistoryEntryDto>> GetMedicalHistoryAsync(string userId, int petId)
        {
            var vet = await GetVetAsync(userId);
            await EnsurePetBelongsToVetAsync(vet.VetId, petId);
            return await GetMedicalHistoryInternalAsync(petId);
        }

        private async Task<IEnumerable<MedicalHistoryEntryDto>> GetMedicalHistoryInternalAsync(int petId)
        {
            var diagnoses = await _context.Diagnoses
                .Where(d => d.PetId == petId)
                .Include(d => d.User)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

            return diagnoses.Select(d => new MedicalHistoryEntryDto
            {
                Id = d.DiagnosisId,
                Date = d.CreatedAt,
                Type = "CONSULTATION",
                Title = string.IsNullOrWhiteSpace(d.Result) ? "فحص عام" : d.Result!,
                Description = d.Symptoms,
                DoctorName = d.User?.FullName
            }).ToList();
        }

        // ═══════════════════════════════════════════════════════════════════════
        // 5. التطعيمات (عمليات قراءة وإضافة وتعديل وحذف)
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<IEnumerable<VaccinationDto>> GetPetVaccinationsAsync(string userId, int petId)
        {
            var vet = await GetVetAsync(userId);
            await EnsurePetBelongsToVetAsync(vet.VetId, petId);
            return await GetPetVaccinationsInternalAsync(petId);
        }

        private async Task<IEnumerable<VaccinationDto>> GetPetVaccinationsInternalAsync(int petId)
        {
            var vaccinations = await _context.Vaccinations
                .Where(v => v.PetId == petId)
                .OrderByDescending(v => v.VaccinationDate)
                .ToListAsync();

            return vaccinations.Select(MapVaccination).ToList();
        }

        public async Task<VaccinationDto> AddVaccinationAsync(string userId, int petId, VaccinationRequestDto dto)
        {
            var vet = await GetVetAsync(userId);
            await EnsurePetBelongsToVetAsync(vet.VetId, petId);

            var vaccination = new Vaccination
            {
                PetId = petId,
                VaccineName = dto.VaccineName,
                Description = dto.Description,
                VaccinationDate = dto.VaccinationDate,
                NextDueDate = dto.NextDueDate
            };

            _context.Vaccinations.Add(vaccination);
            await _context.SaveChangesAsync();

            return MapVaccination(vaccination);
        }

        public async Task<VaccinationDto> UpdateVaccinationAsync(string userId, int vaccinationId, VaccinationRequestDto dto)
        {
            var vet = await GetVetAsync(userId);

            var vaccination = await _context.Vaccinations
                .FirstOrDefaultAsync(v => v.VaccinationId == vaccinationId);

            if (vaccination == null)
                throw new Exception("التطعيم غير موجود.");

            await EnsurePetBelongsToVetAsync(vet.VetId, vaccination.PetId);

            vaccination.VaccineName = dto.VaccineName;
            vaccination.Description = dto.Description;
            vaccination.VaccinationDate = dto.VaccinationDate;
            vaccination.NextDueDate = dto.NextDueDate;

            await _context.SaveChangesAsync();

            return MapVaccination(vaccination);
        }

        public async Task<bool> DeleteVaccinationAsync(string userId, int vaccinationId)
        {
            var vet = await GetVetAsync(userId);

            var vaccination = await _context.Vaccinations
                .FirstOrDefaultAsync(v => v.VaccinationId == vaccinationId);

            if (vaccination == null)
                return false;

            await EnsurePetBelongsToVetAsync(vet.VetId, vaccination.PetId);

            _context.Vaccinations.Remove(vaccination);
            await _context.SaveChangesAsync();

            return true;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // Helper: إثراء القائمة بالمُلكية والحالة
        // ═══════════════════════════════════════════════════════════════════════
        private async Task EnrichPatientsAsync(int vetId, List<PatientListDto> items)
        {
            if (items.Count == 0) return;

            var petIds = items.Select(i => i.PetId).ToList();
            var today = DateTime.UtcNow.Date;
            var dueDate = today.AddDays(30);

            var latestAppointments = await _context.Appointments
                .Where(a => petIds.Contains(a.PetId) && a.VetId == vetId)
                .Include(a => a.Adopter)!.ThenInclude(ad => ad!.User)
                .ToListAsync();

            var ownersByPet = latestAppointments
                .GroupBy(a => a.PetId)
                .ToDictionary(g => g.Key, g => g.OrderByDescending(a => a.AppointmentDate).First());

            var upcomingPets = await _context.Appointments
                .Where(a => petIds.Contains(a.PetId)
                            && a.AppointmentDate > DateTime.UtcNow
                            && a.Status != "Completed"
                            && a.Status != "Cancelled")
                .Select(a => a.PetId)
                .Distinct()
                .ToListAsync();

            var vaccinePets = await _context.Vaccinations
                .Where(v => petIds.Contains(v.PetId)
                            && v.NextDueDate != null
                            && v.NextDueDate.Value.Date >= today
                            && v.NextDueDate.Value.Date <= dueDate)
                .Select(v => v.PetId)
                .Distinct()
                .ToListAsync();

            foreach (var item in items)
            {
                if (ownersByPet.TryGetValue(item.PetId, out var last))
                    item.OwnerName = last.Adopter?.User?.FullName ?? "غير معروف";
                else
                    item.OwnerName = "غير معروف";

                item.PatientIdDisplay = $"#PT-{item.PetId:000000}";

                if (vaccinePets.Contains(item.PetId))
                    item.Status = "Upcoming Vaccine";
                else if (upcomingPets.Contains(item.PetId))
                    item.Status = "Requires Follow-up";
                else if (!string.IsNullOrWhiteSpace(item.HealthStatus))
                    item.Status = item.HealthStatus;
                else
                    item.Status = "Healthy";
            }
        }

        // ═══════════════════════════════════════════════════════════════════════
        // Helper: تحويل كيان التطعيم إلى DTO
        // ═══════════════════════════════════════════════════════════════════════
        private VaccinationDto MapVaccination(Vaccination v)
        {
            var today = DateTime.UtcNow.Date;
            string status;

            if (!v.NextDueDate.HasValue || v.NextDueDate.Value.Date > today.AddDays(30))
                status = "Up to date";
            else if (v.NextDueDate.Value.Date < today)
                status = "Overdue";
            else
                status = "Due soon";

            return new VaccinationDto
            {
                VaccinationId = v.VaccinationId,
                PetId = v.PetId,
                VaccineName = v.VaccineName,
                Description = v.Description,
                VaccinationDate = v.VaccinationDate,
                NextDueDate = v.NextDueDate,
                Status = status
            };
        }
    }
}
