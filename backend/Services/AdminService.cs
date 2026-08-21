using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;

namespace PetHaven.Services
{
    public class AdminService : IAdminService
    {
        private readonly ApplicationDbContext _context;

        public AdminService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AdminStatsDto> GetStatsAsync()
        {
            var stats = new AdminStatsDto
            {
                TotalUsers = await _context.Users.CountAsync(),
                Adopters = await _context.Users.CountAsync(u => u.Role.RoleName == "Adopter"),
                Centers = await _context.Users.CountAsync(u => u.Role.RoleName == "AdoptionCenter"),
                Vets = await _context.Users.CountAsync(u => u.Role.RoleName == "Vet"),
                Admins = await _context.Users.CountAsync(u => u.Role.RoleName == "Admin"),
                BannedUsers = await _context.Users.CountAsync(u => u.IsBanned), 
                TotalPets = await _context.Pets.CountAsync()
            };

            return stats;
        }
        // ─── جلب الأطباء غير الموافق عليهم ────────────────────────
        public async Task<IEnumerable<VetPendingDto>> GetPendingVetsAsync()
        {
            return await _context.Vets
                .Include(v => v.User)
                .Where(v => v.IsVerified == false)
                .Select(v => new VetPendingDto
                {
                    VetId = v.VetId,
                    FullName = v.FullName,
                    Email = v.Email ?? string.Empty,
                    Specialization = v.Specialization ?? string.Empty,
                    ClinicName = v.ClinicName ?? string.Empty,
                    ClinicAddress = v.ClinicAddress ?? string.Empty,
                    LicenseNumber = v.LicenseNumber ?? string.Empty,
                    ExperienceYears = v.ExperienceYears ?? 0,
                    CreatedAt = v.CreatedAt
                })
                .ToListAsync();
        }

        // ─── الموافقة على طبيب ──────────────────────────────────
        public async Task<bool> VerifyVetAsync(int vetId)
        {
            var vet = await _context.Vets.FindAsync(vetId);
            if (vet == null)
                throw new Exception("الطبيب غير موجود.");

            if (vet.IsVerified)
                throw new Exception("تمت الموافقة على هذا الطبيب مسبقاً.");

            vet.IsVerified = true;
            vet.VerificationStatus = "Approved";
            vet.RejectionReason = null;
            await _context.SaveChangesAsync();
            return true;
        }

        // ─── رفض طبيب (تحديث الحالة إلى Rejected مع السبب) ──────
        public async Task<bool> RejectVetAsync(int vetId, string? reason)
        {
            var vet = await _context.Vets.FindAsync(vetId);

            if (vet == null)
                throw new Exception("الطبيب غير موجود.");

            if (vet.VerificationStatus == "Rejected")
                throw new Exception("تم رفض هذا الطبيب مسبقاً.");

            vet.IsVerified = false;
            vet.VerificationStatus = "Rejected";
            vet.RejectionReason = string.IsNullOrWhiteSpace(reason) ? "لم يتم قبول مستندات التحقق." : reason.Trim();
            await _context.SaveChangesAsync();
            return true;
        }

        // ─── 5. حظر مستخدم (أي دور عدا Admin) ─────────────────────────────
        public async Task<bool> BanUserAsync(int userId, string? reason)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
                throw new Exception("المستخدم غير موجود.");

            // منع حظر المدير
            if (user.Role?.RoleName == "Admin")
                throw new Exception("لا يمكن حظر حساب المدير.");

            if (user.IsBanned)
                throw new Exception("هذا المستخدم محظور بالفعل.");

            user.IsBanned = true;
            await _context.SaveChangesAsync();
            return true;
        }

        // ─── 6. فك الحظر عن مستخدم ──────────────────────────────────────────
        public async Task<bool> UnbanUserAsync(int userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
                throw new Exception("المستخدم غير موجود.");

            if (!user.IsBanned)
                throw new Exception("هذا المستخدم غير محظور.");

            user.IsBanned = false;
            await _context.SaveChangesAsync();
            return true;
        }

    }
}