using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.DTOs;
using PetHaven.Services;
using System.Security.Claims;

namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Adopter")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        // =============================================
        // GET: api/Cart
        // Retrieve the current user's cart
        // =============================================
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });

                var cart = await _cartService.GetUserCartAsync(userId);

                return Ok(new { Success = true, Data = cart });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // POST: api/Cart/Add
        // Add a product to the cart
        // =============================================
        [HttpPost("Add")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequestDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });

                await _cartService.AddToCartAsync(dto, userId);

                return Ok(new { Success = true, Message = "Product added to cart successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // PUT: api/Cart/UpdateItem/{cartItemId}
        // Update the quantity of a cart item
        // =============================================
        [HttpPut("UpdateItem/{cartItemId}")]
        public async Task<IActionResult> UpdateCartItem(int cartItemId, [FromBody] UpdateCartItemRequestDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });

                await _cartService.UpdateCartItemQuantityAsync(cartItemId, dto, userId);

                return Ok(new { Success = true, Message = "Cart item updated successfully." });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // DELETE: api/Cart/RemoveItem/{cartItemId}
        // Remove a single item from the cart
        // =============================================
        [HttpDelete("RemoveItem/{cartItemId}")]
        public async Task<IActionResult> RemoveFromCart(int cartItemId)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });

                await _cartService.RemoveFromCartAsync(cartItemId, userId);

                return Ok(new { Success = true, Message = "Item removed from cart successfully." });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // DELETE: api/Cart/Clear
        // Clear all items from the cart
        // =============================================
        [HttpDelete("Clear")]
        public async Task<IActionResult> ClearCart()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });

                await _cartService.ClearCartAsync(userId);

                return Ok(new { Success = true, Message = "Cart cleared successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
