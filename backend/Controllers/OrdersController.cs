using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.Services;
using System.Security.Claims;

namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // =============================================
        // POST: api/Orders/checkout
        // Convert the adopter's cart into an order
        // =============================================
        [HttpPost("checkout")]
        [Authorize(Roles = "Adopter")]
        public async Task<IActionResult> Checkout()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });

                var order = await _orderService.CheckoutAsync(userId);

                return Ok(new { Success = true, Message = "Order placed successfully.", Data = order });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // GET: api/Orders/my-orders
        // Retrieve all orders for the logged-in adopter
        // =============================================
        [HttpGet("my-orders")]
        [Authorize(Roles = "Adopter")]
        public async Task<IActionResult> GetMyOrders()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });

                var orders = await _orderService.GetAdopterOrdersAsync(userId);

                return Ok(new { Success = true, Data = orders });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // PUT: api/Orders/{orderId}/status
        // Update the status of an order (AdoptionCenter only)
        // =============================================
        [HttpPut("{orderId}/status")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] string status)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(status))
                    return BadRequest(new { Success = false, Message = "Status cannot be empty." });

                await _orderService.UpdateOrderStatusAsync(orderId, status);

                return Ok(new { Success = true, Message = $"Order #{orderId} status updated to '{status}'." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
