using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;

namespace PetHaven.Services
{
    public class CartService : ICartService
    {
        private readonly ApplicationDbContext _context;

        public CartService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // GET: Retrieve the current user's cart with all items
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<CartResponseDto> GetUserCartAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");

            var cart = await _context.Carts
                .Include(c => c.CartItems!)
                    .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);

            // Return an empty cart if none exists yet
            if (cart == null)
                return new CartResponseDto { CartId = 0, CartTotal = 0, Items = new List<CartItemResponseDto>() };

            var items = cart.CartItems?
                .Where(ci => ci.Product != null)
                .Select(ci =>
                {
                    var unitPrice  = ci.Product!.ProductPrice * (1 - ci.Product.DiscountRate);
                    var totalPrice = unitPrice * ci.Quantity;
                    return new CartItemResponseDto
                    {
                        CartItemId  = ci.CartItemId,
                        ProductId   = ci.ProductId,
                        ProductName = ci.Product.Name,
                        Quantity    = ci.Quantity,
                        UnitPrice   = Math.Round(unitPrice,  2),
                        TotalPrice  = Math.Round(totalPrice, 2)
                    };
                })
                .ToList() ?? new List<CartItemResponseDto>();

            var cartTotal = items.Sum(i => i.TotalPrice);

            return new CartResponseDto
            {
                CartId    = cart.CartId,
                CartTotal = Math.Round(cartTotal, 2),
                Items     = items
            };
        }

        // ═══════════════════════════════════════════════════════════════════════
        // POST: Add a product to the cart (or increase its quantity)
        // ═══════════════════════════════════════════════════════════════════════
        public async Task AddToCartAsync(AddToCartRequestDto dto, string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");

            // ─── Find or create the user's cart ───────────────────────────────
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId    = parsedUserId,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync(); // Save to get CartId
            }

            // ─── Find the product ─────────────────────────────────────────────
            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null)
                throw new Exception("Product not found.");

            // ─── Check if requested quantity is available ─────────────────────
            if (dto.Quantity > product.StockQuantity)
                throw new Exception($"Insufficient stock. Only {product.StockQuantity} unit(s) available.");

            // ─── Check if product is already in the cart ──────────────────────
            var existingItem = cart.CartItems?
                .FirstOrDefault(ci => ci.ProductId == dto.ProductId);

            if (existingItem != null)
            {
                var newQuantity = existingItem.Quantity + dto.Quantity;
                if (newQuantity > product.StockQuantity)
                    throw new Exception($"Insufficient stock. You already have {existingItem.Quantity} in your cart. Only {product.StockQuantity} unit(s) available in total.");

                existingItem.Quantity = newQuantity;
            }
            else
            {
                var newItem = new CartItem
                {
                    CartId    = cart.CartId,
                    ProductId = dto.ProductId,
                    Quantity  = dto.Quantity
                };
                _context.CartItems.Add(newItem);
            }

            await _context.SaveChangesAsync();
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PUT: Update the quantity of a specific cart item
        // ═══════════════════════════════════════════════════════════════════════
        public async Task UpdateCartItemQuantityAsync(int cartItemId, UpdateCartItemRequestDto dto, string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");

            // Load the cart item with its parent cart for ownership verification
            var cartItem = await _context.CartItems
                .Include(ci => ci.Cart)
                .Include(ci => ci.Product)
                .FirstOrDefaultAsync(ci => ci.CartItemId == cartItemId);

            if (cartItem == null)
                throw new Exception("Cart item not found.");

            // ─── Verify ownership ─────────────────────────────────────────────
            if (cartItem.Cart?.UserId != parsedUserId)
                throw new UnauthorizedAccessException("You do not have permission to modify this cart item.");

            // ─── Check stock availability ─────────────────────────────────────
            if (cartItem.Product == null)
                throw new Exception("The product associated with this cart item no longer exists.");

            if (dto.Quantity > cartItem.Product.StockQuantity)
                throw new Exception($"Insufficient stock. Only {cartItem.Product.StockQuantity} unit(s) available.");

            cartItem.Quantity = dto.Quantity;
            await _context.SaveChangesAsync();
        }

        // ═══════════════════════════════════════════════════════════════════════
        // DELETE: Remove a single item from the cart
        // ═══════════════════════════════════════════════════════════════════════
        public async Task RemoveFromCartAsync(int cartItemId, string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");

            var cartItem = await _context.CartItems
                .Include(ci => ci.Cart)
                .FirstOrDefaultAsync(ci => ci.CartItemId == cartItemId);

            if (cartItem == null)
                throw new Exception("Cart item not found.");

            // ─── Verify ownership ─────────────────────────────────────────────
            if (cartItem.Cart?.UserId != parsedUserId)
                throw new UnauthorizedAccessException("You do not have permission to remove this cart item.");

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
        }

        // ═══════════════════════════════════════════════════════════════════════
        // DELETE: Clear all items from the user's cart
        // ═══════════════════════════════════════════════════════════════════════
        public async Task ClearCartAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);

            if (cart == null || cart.CartItems == null || !cart.CartItems.Any())
                return; // Nothing to clear

            _context.CartItems.RemoveRange(cart.CartItems);
            await _context.SaveChangesAsync();
        }
    }
}
