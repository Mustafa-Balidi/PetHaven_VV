using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;

namespace PetHaven.Services
{
    public class ProductRatingService : IProductRatingService
    {
        private readonly ApplicationDbContext _context;

        public ProductRatingService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // POST: Add a rating for a product by the logged-in Adopter
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<ProductRatingResponseDto> AddRatingAsync(string userId, ProductRatingRequestDto request)
        {
            // ─── Parse and validate userId ────────────────────────────────────
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");

            // ─── Validate rating range ────────────────────────────────────────
            if (request.Rating < 1 || request.Rating > 5)
                throw new Exception("Rating must be between 1 and 5.");

            // ─── Check product exists ─────────────────────────────────────────
            var productExists = await _context.Products.AnyAsync(p => p.ProductId == request.ProductId);
            if (!productExists)
                throw new Exception("Product not found.");

            // ─── Enforce one rating per user per product ──────────────────────
            var alreadyRated = await _context.Ratings.AnyAsync(r =>
                r.UserId == parsedUserId &&
                r.TargetType == "Product" &&
                r.TargetId == request.ProductId);

            if (alreadyRated)
                throw new Exception("You have already rated this product.");

            // ─── Create and persist the new rating ────────────────────────────
            var rating = new Rating
            {
                UserId     = parsedUserId,
                TargetType = "Product",
                TargetId   = request.ProductId,
                StarsCount = request.Rating,
                ReviewText = request.Comment,
                CreatedAt  = DateTime.UtcNow
            };

            _context.Ratings.Add(rating);
            await _context.SaveChangesAsync();

            // ─── Load user + adopter details for the response ─────────────────
            var user = await _context.Users
                .Include(u => u.Adopter)
                .FirstOrDefaultAsync(u => u.UserId == parsedUserId);

            return new ProductRatingResponseDto
            {
                RatingId    = rating.RatingId,
                ProductId   = request.ProductId,
                AdopterId   = parsedUserId.ToString(),
                AdopterName = user?.FullName ?? string.Empty,
                Rating      = rating.StarsCount,
                Comment     = rating.ReviewText,
                CreatedAt   = rating.CreatedAt
            };
        }

        // ═══════════════════════════════════════════════════════════════════════
        // GET: Fetch all ratings for a specific product
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<IEnumerable<ProductRatingResponseDto>> GetProductRatingsAsync(int productId)
        {
            var ratings = await _context.Ratings
                .Where(r => r.TargetType == "Product" && r.TargetId == productId)
                .Include(r => r.User)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return ratings.Select(r => new ProductRatingResponseDto
            {
                RatingId    = r.RatingId,
                ProductId   = productId,
                AdopterId   = r.UserId.ToString(),
                AdopterName = r.User?.FullName ?? string.Empty,
                Rating      = r.StarsCount,
                Comment     = r.ReviewText,
                CreatedAt   = r.CreatedAt
            });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // GET: Product ratings belonging only to the logged-in Adoption Center
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<CenterProductReviewsResponseDto> GetCenterReviewsAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");

            var centerId = await _context.AdoptionCenters
                .Where(center => center.UserId == parsedUserId)
                .Select(center => (int?)center.CenterId)
                .FirstOrDefaultAsync();

            if (centerId == null)
                throw new Exception("Adoption center profile was not found.");

            var reviews = await (
                from rating in _context.Ratings.AsNoTracking()
                join product in _context.Products.AsNoTracking()
                    on rating.TargetId equals product.ProductId
                join user in _context.Users.AsNoTracking()
                    on rating.UserId equals user.UserId into users
                from reviewer in users.DefaultIfEmpty()
                where rating.TargetType == "Product"
                      && product.CenterId == centerId.Value
                orderby rating.CreatedAt descending
                select new CenterProductReviewDto
                {
                    RatingId = rating.RatingId,
                    ProductId = product.ProductId,
                    ProductName = product.Name,
                    AdopterName = reviewer != null ? reviewer.FullName : string.Empty,
                    Rating = rating.StarsCount,
                    Comment = rating.ReviewText,
                    CreatedAt = rating.CreatedAt
                })
                .ToListAsync();

            var total = reviews.Count;
            var breakdown = Enumerable.Range(1, 5)
                .Reverse()
                .Select(stars =>
                {
                    var count = reviews.Count(review => review.Rating == stars);
                    return new CenterRatingBreakdownDto
                    {
                        Stars = stars,
                        Count = count,
                        Percent = total == 0
                            ? 0
                            : (int)Math.Round(count * 100d / total, MidpointRounding.AwayFromZero)
                    };
                })
                .ToList();

            return new CenterProductReviewsResponseDto
            {
                AverageRating = total == 0
                    ? 0
                    : Math.Round(reviews.Average(review => review.Rating), 1),
                TotalReviews = total,
                Breakdown = breakdown,
                Reviews = reviews
            };
        }
    }
}
