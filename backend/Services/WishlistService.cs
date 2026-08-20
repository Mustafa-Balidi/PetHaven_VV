using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;

namespace PetHaven.Services
{
    public class WishlistService : IWishlistService
    {
        private readonly ApplicationDbContext _context;

        public WishlistService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // GET: Retrieve all wishlist items for the current user
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<IEnumerable<WishlistResponseDto>> GetUserWishlistAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");

            var user = await _context.Users
                .Include(u => u.Wishlists!)
                    .ThenInclude(w => w.Product)
                .FirstOrDefaultAsync(u => u.UserId == parsedUserId);

            if (user == null)
                throw new Exception("User not found.");

            var wishlistItems = user.Wishlists?
                .Where(w => w.Product != null)
                .Select(w =>
                {
                    var currentPrice = w.Product!.ProductPrice - (w.Product.ProductPrice * w.Product.DiscountRate);
                    return new WishlistResponseDto
                    {
                        WishlistItemId = w.WishlistId,
                        ProductId      = w.ProductId,
                        ProductName    = w.Product.Name,
                        CurrentPrice   = Math.Round(currentPrice, 2),
                        ImageUrl       = w.Product.ImageURL
                    };
                })
                .ToList() ?? new List<WishlistResponseDto>();

            return wishlistItems;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // POST: Add a product to the user's wishlist (if not already present)
        // ═══════════════════════════════════════════════════════════════════════
        public async Task AddToWishlistAsync(int productId, string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");

            var user = await _context.Users
                .Include(u => u.Wishlists)
                .FirstOrDefaultAsync(u => u.UserId == parsedUserId);

            if (user == null)
                throw new Exception("User not found.");

            // ─── Check if product exists ──────────────────────────────────────
            var productExists = await _context.Products.AnyAsync(p => p.ProductId == productId);
            if (!productExists)
                throw new Exception("Product not found.");

            // ─── Check for duplicates ─────────────────────────────────────────
            var alreadyInWishlist = user.Wishlists?
                .Any(w => w.ProductId == productId) ?? false;

            if (alreadyInWishlist)
                throw new Exception("Product is already in your wishlist.");

            var wishlistItem = new Wishlist
            {
                UserId    = parsedUserId,
                ProductId = productId,
                AddedDate = DateTime.UtcNow
            };

            _context.Wishlists.Add(wishlistItem);
            await _context.SaveChangesAsync();
        }

        // ═══════════════════════════════════════════════════════════════════════
        // DELETE: Remove a product from the user's wishlist by ProductId
        // ═══════════════════════════════════════════════════════════════════════
        public async Task RemoveFromWishlistAsync(int productId, string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");

            var wishlistItem = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.ProductId == productId && w.UserId == parsedUserId);

            if (wishlistItem == null)
                throw new Exception("Item not found in your wishlist.");

            _context.Wishlists.Remove(wishlistItem);
            await _context.SaveChangesAsync();
        }
    }
}
