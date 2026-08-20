using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.Services;
using System.Security.Claims;

namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Adopter")]
    public class WishlistController : ControllerBase
    {
        private readonly IWishlistService _wishlistService;

        public WishlistController(IWishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }

        // =============================================
        // GET: api/Wishlist
        // Retrieve the current user's wishlist
        // =============================================
        [HttpGet]
        public async Task<IActionResult> GetWishlist()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });

                var wishlist = await _wishlistService.GetUserWishlistAsync(userId);

                return Ok(new { Success = true, Data = wishlist });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // POST: api/Wishlist/{productId}
        // Add a product to the wishlist
        // =============================================
        [HttpPost("{productId}")]
        public async Task<IActionResult> AddToWishlist(int productId)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });

                await _wishlistService.AddToWishlistAsync(productId, userId);

                return Ok(new { Success = true, Message = "Product added to wishlist successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // DELETE: api/Wishlist/{productId}
        // Remove a product from the wishlist
        // =============================================
        [HttpDelete("{productId}")]
        public async Task<IActionResult> RemoveFromWishlist(int productId)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });

                await _wishlistService.RemoveFromWishlistAsync(productId, userId);

                return Ok(new { Success = true, Message = "Product removed from wishlist successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
