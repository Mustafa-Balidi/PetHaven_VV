using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;

namespace PetHaven.Services
{
    public class StoreCatalogService : IStoreCatalogService
    {
        private readonly ApplicationDbContext _context;

        public StoreCatalogService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // GET: All Categories
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<IEnumerable<CategoryResponseDto>> GetAllCategoriesAsync()
        {
            return await _context.Categories
                .Select(c => new CategoryResponseDto
                {
                    CategoryId  = c.CategoryId,
                    Name        = c.CategoryName,
                    Description = c.Description
                })
                .ToListAsync();
        }

        // ═══════════════════════════════════════════════════════════════════════
        // GET: All Available Products (StockQuantity > 0)
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<IEnumerable<ProductResponseDto>> GetAllAvailableProductsAsync()
        {
            return await _context.Products
                .Include(p => p.Center)
                .Include(p => p.Category)
                .Where(p => p.StockQuantity > 0)
                .Select(p => new ProductResponseDto
                {
                    ProductId         = p.ProductId,
                    CenterId          = p.CenterId,
                    CenterName        = p.Center != null ? p.Center.CenterName : string.Empty,
                    CategoryId        = p.CategoryId,
                    CategoryName      = p.Category != null ? p.Category.CategoryName : string.Empty,
                    Name              = p.Name,
                    Description       = p.Description,
                    ProductPrice      = p.ProductPrice,
                    DiscountRate      = p.DiscountRate,
                    PriceAfterDiscount = p.ProductPrice - (p.ProductPrice * p.DiscountRate),
                    StockQuantity     = p.StockQuantity,
                    ImageUrl          = p.ImageURL
                })
                .ToListAsync();
        }

        // ═══════════════════════════════════════════════════════════════════════
        // GET: Products belonging to the calling center
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<IEnumerable<ProductResponseDto>> GetCenterProductsAsync(string userId)
        {
            var center = await ResolveCenterAsync(userId);

            return await _context.Products
                .Include(p => p.Center)
                .Include(p => p.Category)
                .Where(p => p.CenterId == center.CenterId)
                .Select(p => new ProductResponseDto
                {
                    ProductId         = p.ProductId,
                    CenterId          = p.CenterId,
                    CenterName        = p.Center != null ? p.Center.CenterName : string.Empty,
                    CategoryId        = p.CategoryId,
                    CategoryName      = p.Category != null ? p.Category.CategoryName : string.Empty,
                    Name              = p.Name,
                    Description       = p.Description,
                    ProductPrice      = p.ProductPrice,
                    DiscountRate      = p.DiscountRate,
                    PriceAfterDiscount = p.ProductPrice - (p.ProductPrice * p.DiscountRate),
                    StockQuantity     = p.StockQuantity,
                    ImageUrl          = p.ImageURL
                })
                .ToListAsync();
        }

        // ═══════════════════════════════════════════════════════════════════════
        // POST: Add a new Product
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<ProductResponseDto> AddProductAsync(ProductRequestDto dto, string userId)
        {
            var center = await ResolveCenterAsync(userId);

            // Validate category exists
            var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryId == dto.CategoryId);
            if (!categoryExists)
                throw new Exception("التصنيف المحدد غير موجود.");

            var product = new Product
            {
                CenterId      = center.CenterId,
                CategoryId    = dto.CategoryId,
                Name          = dto.Name,
                Description   = dto.Description,
                ProductPrice  = dto.ProductPrice,
                DiscountRate  = dto.DiscountRate,
                StockQuantity = dto.StockQuantity,
                ImageURL      = dto.ImageUrl
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Reload with navigation properties for the response
            await _context.Entry(product).Reference(p => p.Center).LoadAsync();
            await _context.Entry(product).Reference(p => p.Category).LoadAsync();

            return MapToResponseDto(product);
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PUT: Update an existing Product
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<ProductResponseDto> UpdateProductAsync(int productId, ProductRequestDto dto, string userId)
        {
            var center = await ResolveCenterAsync(userId);

            var product = await _context.Products
                .Include(p => p.Center)
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null)
                throw new Exception("المنتج غير موجود.");

            if (product.CenterId != center.CenterId)
                throw new UnauthorizedAccessException("ليس لديك صلاحية لتعديل هذا المنتج.");

            // Validate new category if it changed
            if (product.CategoryId != dto.CategoryId)
            {
                var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryId == dto.CategoryId);
                if (!categoryExists)
                    throw new Exception("التصنيف المحدد غير موجود.");
            }

            product.Name          = dto.Name;
            product.Description   = dto.Description;
            product.ProductPrice  = dto.ProductPrice;
            product.DiscountRate  = dto.DiscountRate;
            product.StockQuantity = dto.StockQuantity;
            product.ImageURL      = dto.ImageUrl;
            product.CategoryId    = dto.CategoryId;

            await _context.SaveChangesAsync();

            // Refresh navigation properties after category may have changed
            await _context.Entry(product).Reference(p => p.Category).LoadAsync();

            return MapToResponseDto(product);
        }

        // ═══════════════════════════════════════════════════════════════════════
        // DELETE: Remove a Product
        // ═══════════════════════════════════════════════════════════════════════
        public async Task DeleteProductAsync(int productId, string userId)
        {
            var center = await ResolveCenterAsync(userId);

            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null)
                throw new Exception("المنتج غير موجود.");

            if (product.CenterId != center.CenterId)
                throw new UnauthorizedAccessException("ليس لديك صلاحية لحذف هذا المنتج.");

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }

        // ═══════════════════════════════════════════════════════════════════════
        // Private Helpers
        // ═══════════════════════════════════════════════════════════════════════

        /// <summary>
        /// Parses userId and returns the corresponding AdoptionCenter, or throws.
        /// </summary>
        private async Task<AdoptionCenter> ResolveCenterAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");

            var center = await _context.AdoptionCenters
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);

            if (center == null)
                throw new Exception("لم يتم العثور على ملف المركز.");

            return center;
        }

        /// <summary>
        /// Maps a Product entity (with loaded Center and Category) to ProductResponseDto.
        /// </summary>
        private static ProductResponseDto MapToResponseDto(Product product)
        {
            return new ProductResponseDto
            {
                ProductId         = product.ProductId,
                CenterId          = product.CenterId,
                CenterName        = product.Center?.CenterName ?? string.Empty,
                CategoryId        = product.CategoryId,
                CategoryName      = product.Category?.CategoryName ?? string.Empty,
                Name              = product.Name,
                Description       = product.Description,
                ProductPrice      = product.ProductPrice,
                DiscountRate      = product.DiscountRate,
                PriceAfterDiscount = product.ProductPrice - (product.ProductPrice * product.DiscountRate),
                StockQuantity     = product.StockQuantity,
                ImageUrl          = product.ImageURL
            };
        }

        // ═══════════════════════════════════════════════════════════════════════
        // GET: Product Details by ID
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<ProductDetailDto?> GetProductByIdAsync(int productId)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Center)
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null)
                return null;

            // جلب التقييمات الخاصة بهذا المنتج من جدول Ratings
            var ratings = await _context.Ratings
                .Include(r => r.User)
                .Where(r => r.TargetType == "Product" && r.TargetId == productId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            var totalReviews = ratings.Count;
            var averageRating = totalReviews > 0 ? Math.Round(ratings.Average(r => r.StarsCount), 1) : 0;

            var finalPrice = product.ProductPrice - (product.ProductPrice * product.DiscountRate);

            return new ProductDetailDto
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                ImageUrl = product.ImageURL,
                StockQuantity = product.StockQuantity,

                OriginalPrice = product.ProductPrice,
                DiscountRate = product.DiscountRate,
                FinalPrice = Math.Round(finalPrice, 2),

                CategoryId = product.CategoryId,
                CategoryName = product.Category?.CategoryName ?? string.Empty,

                CenterId = product.CenterId,
                CenterName = product.Center?.CenterName ?? string.Empty,

                AverageRating = averageRating,
                TotalReviews = totalReviews,
                Reviews = ratings.Take(5).Select(r => new ProductReviewDto
                {
                    RatingId = r.RatingId,
                    UserName = r.User?.FullName ?? "مستخدم",
                    StarsCount = r.StarsCount,
                    ReviewText = r.ReviewText,
                    CreatedAt = r.CreatedAt
                }).ToList()
            };
        }
    }
}
