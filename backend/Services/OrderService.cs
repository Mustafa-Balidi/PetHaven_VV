using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;

namespace PetHaven.Services
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _context;

        public OrderService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // POST: Checkout — convert the user's cart into a new Order
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<OrderResponseDto> CheckoutAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");

            // ─── Load the user's cart with items and products ─────────────────
            var cart = await _context.Carts
                .Include(c => c.CartItems!)
                    .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);

            if (cart == null || cart.CartItems == null || !cart.CartItems.Any())
                throw new Exception("Your cart is empty. Please add items before checking out.");

            // ─── Create the Order ─────────────────────────────────────────────
            var order = new Order
            {
                UserId    = parsedUserId,
                OrderDate = DateTime.UtcNow,
                Status    = "Pending",
                TotalPrice = 0  // will be calculated below
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync(); // Save now to get the generated OrderId

            // ─── Create OrderItems and calculate total ────────────────────────
            decimal total = 0;
            var orderItems = new List<OrderItem>();

            foreach (var cartItem in cart.CartItems)
            {
                if (cartItem.Product == null) continue;

                // ─── Validate stock availability ──────────────────────────────
                if (cartItem.Quantity > cartItem.Product.StockQuantity)
                    throw new InvalidOperationException(
                        $"Not enough stock for product: {cartItem.Product.Name}. " +
                        $"Requested: {cartItem.Quantity}, Available: {cartItem.Product.StockQuantity}.");

                var unitPrice = cartItem.Product.ProductPrice * (1 - cartItem.Product.DiscountRate);

                var orderItem = new OrderItem
                {
                    OrderId         = order.OrderId,
                    ProductId       = cartItem.ProductId,
                    Quantity        = cartItem.Quantity,
                    UnitPrice       = Math.Round(unitPrice, 2),
                    PriceAtPurchase = Math.Round(unitPrice, 2)
                };

                // ─── Deduct purchased quantity from inventory ─────────────────
                cartItem.Product.StockQuantity -= cartItem.Quantity;

                orderItems.Add(orderItem);
                total += orderItem.UnitPrice * orderItem.Quantity;
            }

            _context.OrderItems.AddRange(orderItems);

            // ─── Update the total and clear the cart ──────────────────────────
            order.TotalPrice = Math.Round(total, 2);
            _context.CartItems.RemoveRange(cart.CartItems);

            await _context.SaveChangesAsync();

            // ─── Map to response DTO ──────────────────────────────────────────
            return MapToDto(order, orderItems, cart.CartItems.ToList());
        }

        // ═══════════════════════════════════════════════════════════════════════
        // GET: Retrieve all orders for the logged-in adopter
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<IEnumerable<OrderResponseDto>> GetAdopterOrdersAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");

            var orders = await _context.Orders
                .Where(o => o.UserId == parsedUserId)
                .Include(o => o.OrderItems!)
                    .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(o => new OrderResponseDto
            {
                OrderId     = o.OrderId,
                OrderDate   = o.OrderDate,
                TotalAmount = o.TotalPrice,
                Status      = o.Status ?? string.Empty,
                Items       = o.OrderItems?
                    .Select(oi => new OrderItemDto
                    {
                        ProductId   = oi.ProductId,
                        ProductName = oi.Product?.Name ?? string.Empty,
                        Quantity    = oi.Quantity,
                        UnitPrice   = oi.UnitPrice
                    })
                    .ToList() ?? new List<OrderItemDto>()
            });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PUT: Update the status of an existing order
        // ═══════════════════════════════════════════════════════════════════════
        public async Task UpdateOrderStatusAsync(int orderId, string status)
        {
            var order = await _context.Orders.FindAsync(orderId);

            if (order == null)
                throw new Exception($"Order with ID {orderId} was not found.");

            order.Status = status;
            await _context.SaveChangesAsync();
        }

        // ─── Private helper: map an Order + its items to a response DTO ───────
        private static OrderResponseDto MapToDto(Order order, List<OrderItem> orderItems, List<CartItem> originalCartItems)
        {
            // Build a lookup of ProductName from the original cart items (products are already loaded)
            var productNames = originalCartItems
                .Where(ci => ci.Product != null)
                .ToDictionary(ci => ci.ProductId, ci => ci.Product!.Name);

            return new OrderResponseDto
            {
                OrderId     = order.OrderId,
                OrderDate   = order.OrderDate,
                TotalAmount = order.TotalPrice,
                Status      = order.Status ?? string.Empty,
                Items       = orderItems.Select(oi => new OrderItemDto
                {
                    ProductId   = oi.ProductId,
                    ProductName = productNames.TryGetValue(oi.ProductId, out var name) ? name : string.Empty,
                    Quantity    = oi.Quantity,
                    UnitPrice   = oi.UnitPrice
                }).ToList()
            };
        }
    }
}
