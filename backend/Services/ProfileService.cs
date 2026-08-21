using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;

namespace PetHaven.Services
{
    public class ProfileService : IProfileService
    {
        private readonly ApplicationDbContext _context;

        public ProfileService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // GET: جلب ملف المستخدم بناءً على نوع دوره (يبقى كما هو)
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<UserProfileDto> GetUserProfileAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");

            var user = await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Adopter)
                .Include(u => u.AdoptionCenter)
                .Include(u => u.Vet)
                .FirstOrDefaultAsync(u => u.UserId == parsedUserId);

            if (user == null)
                throw new Exception("المستخدم غير موجود.");

            var dto = new UserProfileDto
            {
                UserId = user.UserId,
                Username = user.UserName,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role?.RoleName ?? string.Empty,
               ProfileImageUrl = user.ImageUrl
            };

            // ربط البيانات الفرعية حسب الدور
            if (user.Adopter != null)
            {
                dto.Address = user.Adopter.Address;
                dto.HousingType = user.Adopter.HousingType;
                dto.HasPetBefore = user.Adopter.HasPetBefore;
                dto.ExperienceLevel = user.Adopter.ExperienceLevel;
                dto.FreeHoursPerDay = user.Adopter.FreeHoursPerDay;
                dto.Balance = user.Adopter.Balance;

            }
            else if (user.AdoptionCenter != null)
            {
                dto.CenterName = user.AdoptionCenter.CenterName;
                dto.Address = user.AdoptionCenter.Address;
                dto.ContactInfo = user.AdoptionCenter.ContactInfo;

                // رصيد محفظة المركز = مجموع مبيعات منتجاته في الطلبات المدفوعة
                var centerId = user.AdoptionCenter.CenterId;
                dto.Balance = await _context.OrderItems
                    .Where(oi => oi.Product!.CenterId == centerId && oi.Order!.Status == "Paid")
                    .SumAsync(oi => oi.UnitPrice * oi.Quantity);
            }
            else if (user.Vet != null)
            {
                dto.ClinicName = user.Vet.ClinicName;
                dto.ClinicAddress = user.Vet.ClinicAddress;
                dto.Specialization = user.Vet.Specialization;
                dto.ExperienceYears = user.Vet.ExperienceYears;
                dto.LicenseNumber = user.Vet.LicenseNumber;
                dto.CertificateUrl = user.Vet.CertificateUrl;
                dto.IsVerified = user.Vet.IsVerified;
            }

            return dto;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PUT: تحديث بيانات المتبني
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<bool> UpdateAdopterProfileAsync(string userId, UpdateAdopterProfileDto dto)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");

            var user = await _context.Users
                .Include(u => u.Adopter)
                .FirstOrDefaultAsync(u => u.UserId == parsedUserId);

            if (user == null || user.Adopter == null)
                throw new Exception("المستخدم غير موجود أو لا يملك حساب متبني.");
            // تحديث بيانات المستخدم الأساسية
            user.FullName = dto.FullName;
            user.PhoneNumber = dto.PhoneNumber;

            user.ImageUrl = dto.ImageUrl ?? user.ImageUrl;

            // تحديث بيانات المتبني
            user.Adopter.Address = dto.Address;
            user.Adopter.HousingType = dto.HousingType;
            user.Adopter.ExperienceLevel = dto.ExperienceLevel;
            if (dto.FreeHoursPerDay.HasValue)
                user.Adopter.FreeHoursPerDay = dto.FreeHoursPerDay.Value;

            // new after update 
            if (dto.HasPetBefore.HasValue)
                user.Adopter.HasPetBefore = dto.HasPetBefore.Value;


            await _context.SaveChangesAsync();
            return true;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PUT: تحديث بيانات المركز
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<bool> UpdateCenterProfileAsync(string userId, UpdateCenterProfileDto dto)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");

            var user = await _context.Users
                .Include(u => u.AdoptionCenter)
                .FirstOrDefaultAsync(u => u.UserId == parsedUserId);

            if (user == null || user.AdoptionCenter == null)
                throw new Exception("المستخدم غير موجود أو لا يملك حساب مركز.");

            user.PhoneNumber = dto.PhoneNumber;

            user.ImageUrl = dto.ImageUrl ?? user.ImageUrl;

            user.AdoptionCenter.CenterName = dto.CenterName;
            user.AdoptionCenter.Address = dto.Address;
            user.AdoptionCenter.ContactInfo = dto.ContactInfo;

            await _context.SaveChangesAsync();
            return true;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PUT: تحديث بيانات الطبيب البيطري
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<bool> UpdateVetProfileAsync(string userId, UpdateVetProfileDto dto)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");

            var user = await _context.Users
                .Include(u => u.Vet)
                .FirstOrDefaultAsync(u => u.UserId == parsedUserId);

            if (user == null || user.Vet == null)
                throw new Exception("المستخدم غير موجود أو لا يملك حساب طبيب بيطري.");

            user.FullName = dto.FullName;
            user.PhoneNumber = dto.PhoneNumber;

            user.Vet.FullName = dto.FullName;
            user.Vet.Email = dto.Email;
            user.Vet.PhoneNumber = dto.PhoneNumber;
            user.Vet.ClinicName = dto.ClinicName;
            user.Vet.ClinicAddress = dto.ClinicAddress;
            user.Vet.Specialization = dto.Specialization;
            user.Vet.ExperienceYears = dto.ExperienceYears;
            user.Vet.LicenseNumber = dto.LicenseNumber;
            if (!string.IsNullOrWhiteSpace(dto.CertificateUrl))
                user.Vet.CertificateUrl = dto.CertificateUrl;
            user.Vet.Location_Lat = dto.Location_Lat;
            user.Vet.Location_Lng = dto.Location_Lng;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
