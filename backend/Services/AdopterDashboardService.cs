using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;

namespace PetHaven.Services
{
    public class AdopterDashboardService : IAdopterDashboardService
    {
        private readonly ApplicationDbContext _context;

        public AdopterDashboardService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AdopterDashboardDto> GetAdopterDashboardAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");

            // ─── 1. جلب المتبني ────────────────────────────────────────────────
            var adopter = await _context.Adopters
                .FirstOrDefaultAsync(a => a.UserId == parsedUserId);

            if (adopter == null)
                throw new Exception("لم يتم العثور على حساب المتبني.");

            // ─── 2. حساب عدد طلبات التبني المعلقة ─────────────────────────────
            var pendingCount = await _context.AdoptionRequests
                .CountAsync(r => r.AdopterId == adopter.AdopterId && r.Status == "Pending");

            // ─── 3. حساب عدد الحيوانات المتبناة ────────────────────────────────
            var adoptedCount = await _context.AdoptionRequests
                .CountAsync(r => r.AdopterId == adopter.AdopterId && r.Status == "Approved");

            // ─── 4. حساب عدد الطلبات الأخيرة ───────────────────────────────────
            var recentOrdersCount = await _context.Orders
                .CountAsync(o => o.UserId == parsedUserId);

            // ─── 5. جلب آخر حيوان تم تبنيه ──────────────────────────────────────
            var lastAdoption = await _context.AdoptionRequests
                .Include(r => r.Pet)
                .Where(r => r.AdopterId == adopter.AdopterId && r.Status == "Approved")
                .OrderByDescending(r => r.CreatedAt)
                .FirstOrDefaultAsync();

            string? lastPetName = lastAdoption?.Pet?.PetName;

            // ─── 6. حساب عدد الأيام منذ آخر تبني ──────────────────────────────
            int? daysSinceLastAdoption = null;
            if (adopter.LastReportDate.HasValue)
            {
                daysSinceLastAdoption = (int)(DateTime.UtcNow - adopter.LastReportDate.Value).TotalDays;
            }

            // ─── 7. بناء رسالة الترحيب ──────────────────────────────────────────
            string welcomeMessage = "مرحباً بعودتك! 👋";

            if (daysSinceLastAdoption.HasValue && daysSinceLastAdoption >= 180 && !string.IsNullOrEmpty(lastPetName))
            {
                int months = daysSinceLastAdoption.Value / 30;
                welcomeMessage = $"Hello! It's been {months} months since you adopted {lastPetName}. Please share an update photo to reassure the center.";
            }
            else if (pendingCount > 0)
            {
                welcomeMessage = $"لديك {pendingCount} طلب تبني قيد الانتظار. نتمنى لك التوفيق! 🍀";
            }
            else if (adoptedCount > 0 && !string.IsNullOrEmpty(lastPetName))
            {
                welcomeMessage = $"نتمنى لك أوقاتاً سعيدة مع {lastPetName}! 🐾";
            }

            // ─── 8. بناء الـ Response ───────────────────────────────────────────
            return new AdopterDashboardDto
            {
                PendingAdoptionsCount = pendingCount,
                AdoptedPetsCount = adoptedCount,
                RecentOrdersCount = recentOrdersCount,

                DaysSinceLastAdoption = daysSinceLastAdoption,
                LastAdoptedPetName = lastPetName,
                WelcomeMessage = welcomeMessage
            };

        }

        //               الحيوانات المتبناة 

        public async Task<IEnumerable<PetResponseDto>> GetAdoptedPetsAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");

            // 1. جلب المتبني
            var adopter = await _context.Adopters
                .FirstOrDefaultAsync(a => a.UserId == parsedUserId);

            if (adopter == null)
                throw new Exception("لم يتم العثور على حساب المتبني.");

            // 2. جلب طلبات التبني المقبولة لهذا المتبني
            var adoptedPets = await _context.AdoptionRequests
                .Include(r => r.Pet)
                    .ThenInclude(p => p.Center)
                .Where(r => r.AdopterId == adopter.AdopterId && r.Status == "Approved")
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new PetResponseDto
                {
                    PetId = r.Pet.PetId,
                    Name = r.Pet.PetName,
                    Species = r.Pet.Species,
                    Breed = r.Pet.Breed,
                    Age = r.Pet.Age,
                    Gender = r.Pet.Gender,
                    Description = r.Pet.Description,
                    HealthStatus = r.Pet.HealthStatus,
                    ImageUrl = r.Pet.ImageURL,
                    CenterName = r.Pet.Center != null ? r.Pet.Center.CenterName : string.Empty
                })
                .ToListAsync();

            return adoptedPets;
        }
    }
}