using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;

namespace PetHaven.Services
{
    public class VetRatingService : IVetRatingService
    {
        private readonly ApplicationDbContext _context;

        public VetRatingService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // POST: Add a rating for a vet by the logged-in Adopter
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<VetRatingResponseDto> AddRatingAsync(string userId, VetRatingRequestDto request)
        {
            // ─── Parse and validate userId ────────────────────────────────────
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");

            // ─── Validate rating range ────────────────────────────────────────
            if (request.Rating < 1 || request.Rating > 5)
                throw new Exception("التقييم يجب أن يكون بين 1 و 5.");

            // ─── Check vet exists ─────────────────────────────────────────────
            var vetExists = await _context.Vets.AnyAsync(v => v.VetId == request.VetId);
            if (!vetExists)
                throw new Exception("الطبيب البيطري غير موجود.");

            // ─── Enforce one rating per user per vet ──────────────────────────
            var alreadyRated = await _context.Ratings.AnyAsync(r =>
                r.UserId == parsedUserId &&
                r.TargetType == "Vet" &&
                r.TargetId == request.VetId);

            if (alreadyRated)
                throw new Exception("لقد قمت بتقييم هذا الطبيب بالفعل.");

            // ─── Create and persist the new rating ────────────────────────────
            var rating = new Rating
            {
                UserId = parsedUserId,
                TargetType = "Vet",
                TargetId = request.VetId,
                StarsCount = request.Rating,
                ReviewText = request.ReviewText,
                CreatedAt = DateTime.UtcNow
            };

            _context.Ratings.Add(rating);
            await _context.SaveChangesAsync();

            // ─── Load user details for the response ───────────────────────────
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == parsedUserId);

            return new VetRatingResponseDto
            {
                RatingId = rating.RatingId,
                VetId = request.VetId,
                UserId = parsedUserId,
                UserName = user?.FullName ?? string.Empty,
                Rating = rating.StarsCount,
                ReviewText = rating.ReviewText,
                CreatedAt = rating.CreatedAt
            };
        }

        // ═══════════════════════════════════════════════════════════════════════
        // GET: Fetch all ratings for a specific vet
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<double> GetVetAverageRatingAsync(int vetId)
        {
            // التحقق أولاً مما إذا كان هناك أي تقييمات لهذا الطبيب تجنباً لخطأ الحساب
            var hasRatings = await _context.Ratings
                .AnyAsync(r => r.TargetType == "Vet" && r.TargetId == vetId);

            if (!hasRatings)
            {
                return 0.0; // يعيد صفر إذا لم يكن للطبيب أي تقييمات بعد
            }

            // حساب متوسط عدد النجوم مباشرة من قاعدة البيانات
            return await _context.Ratings
                .Where(r => r.TargetType == "Vet" && r.TargetId == vetId)
                .AverageAsync(r => r.StarsCount);
        }
    }
}
