using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;

namespace PetHaven.Services
{
    public class ReviewsService : IReviewsService
    {
        private readonly ApplicationDbContext _context;

        public ReviewsService(ApplicationDbContext context)
        {
            _context = context;
        }

// ═══════════════════════════════════════════════════════════════════
        // GET: Client Reviews (clinic feedback) — قائمة + إحصائيات
        // نستخدم جدول Ratings الحالي مع TargetType = "Vet" لطبيب محدد
        // ═══════════════════════════════════════════════════════════════════
        public async Task<ReviewsListResponseDto> GetClientReviewsAsync(
            int vetUserId, string? search, string? filter, int page, int pageSize)
        {
            //  الحصول على سجل الطبيب الحالي من الـ UserId ──────────────────
            var vet = await _context.Vets.FirstOrDefaultAsync(v => v.UserId == vetUserId);
            if (vet == null)
                throw new UnauthorizedAccessException("هوية الطبيب غير معروفة.");

            // ─── ضبط ترقيم الصفحات ───────────────────────────────────────
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            // ───  تقييمات  الطبيب  ───────────────
            var query = _context.Ratings
                .Where(r => r.TargetType == "Vet" && r.TargetId == vet.VetId)
                .Include(r => r.User)
                .AsQueryable();

            // ─── البحث باسم المُقيّم أو في نص المراجعة ─────────────────────
            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim();
                query = query.Where(r =>
                    (r.User != null && r.User.FullName.Contains(search)) ||
                    (r.ReviewText != null && r.ReviewText.Contains(search)));
            }

            // ─── الفلترة: الكل أو غير المُجاب عنه ─────────────────────────
            if (string.Equals(filter, "unanswered", StringComparison.OrdinalIgnoreCase))
            {
                // التقييمات التي لا تحتوي نص مراجعة (تعتبر بدون رد )
                query = query.Where(r => string.IsNullOrEmpty(r.ReviewText));
            }

            // ─── حساب الإحصائيات (قبل التقسيم) ────────────────────────────
            var allQuery = _context.Ratings
                .Where(r => r.TargetType == "Vet" && r.TargetId == vet.VetId);

            var totalCount = await allQuery.CountAsync();
            var average = await allQuery.AnyAsync()
                ? await allQuery.AverageAsync(r => r.StarsCount)
                : 0.0;
            var unansweredCount = await allQuery.CountAsync(r => string.IsNullOrEmpty(r.ReviewText));

            var distribution = await allQuery
                .GroupBy(r => r.StarsCount)
                .Select(g => new { Star = g.Key, Count = g.Count() })
                .ToListAsync();

            var starDistribution = new Dictionary<int, int> { { 5, 0 }, { 4, 0 }, { 3, 0 }, { 2, 0 }, { 1, 0 } };
            foreach (var item in distribution)
                if (starDistribution.ContainsKey(item.Star))
                    starDistribution[item.Star] = item.Count;

            var starPercentages = starDistribution.ToDictionary(
                kv => kv.Key,
                kv => totalCount > 0 ? Math.Round(kv.Value * 100.0 / totalCount, 1) : 0.0);

            // ─── الترتيب والترقيم ─────────────────────────────────────────
            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var items = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new ClientReviewDto
                {
                    RatingId     = r.RatingId,
                    ReviewerName = r.User != null ? r.User.FullName : string.Empty,
                    StarsCount   = r.StarsCount,
                    ReviewText   = r.ReviewText,
                    CreatedAt    = r.CreatedAt
                })
                .ToListAsync();

            return new ReviewsListResponseDto
            {
                Stats = new ReviewsStatsDto
                {
                    AverageRating      = Math.Round(average, 1),
                    TotalCount         = totalCount,
                    UnansweredCount    = unansweredCount,
                    StarDistribution   = starDistribution,
                    StarPercentages    = starPercentages
                },
                Items      = items,
                Page       = page,
                PageSize   = pageSize,
                TotalItems = totalItems,
                TotalPages = totalPages
            };
        }
    }
}
