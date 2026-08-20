using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.DTOs;
using PetHaven.Services;
using System.Security.Claims;

namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductRatingsController : ControllerBase
    {
        private readonly IProductRatingService _productRatingService;

        public ProductRatingsController(IProductRatingService productRatingService)
        {
            _productRatingService = productRatingService;
        }

        // =============================================
        // POST: api/ProductRatings
        // Submit a rating for a product (Adopter only)
        // =============================================
        [HttpPost]
        [Authorize(Roles = "Adopter")]
        public async Task<IActionResult> AddRating([FromBody] ProductRatingRequestDto request)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });

                var result = await _productRatingService.AddRatingAsync(userId, request);

                return Ok(new { Success = true, Message = "Rating submitted successfully.", Data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // GET: api/ProductRatings/{productId}
        // Retrieve all ratings for a product (public)
        // =============================================
        [HttpGet("{productId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductRatings(int productId)
        {
            try
            {
                var ratings = await _productRatingService.GetProductRatingsAsync(productId);

                return Ok(new { Success = true, Data = ratings });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // GET: api/ProductRatings/CenterReviews
        // Product reviews owned by the logged-in Adoption Center
        // =============================================
        [HttpGet("CenterReviews")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> GetCenterReviews()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });

                var reviews = await _productRatingService.GetCenterReviewsAsync(userId);
                return Ok(new { Success = true, Data = reviews });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
