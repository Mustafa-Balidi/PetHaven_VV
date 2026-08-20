using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.DTOs;
using PetHaven.Services;
using System.Security.Claims;

namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VetRatingsController : ControllerBase
    {
        private readonly IVetRatingService _vetRatingService;

        public VetRatingsController(IVetRatingService vetRatingService)
        {
            _vetRatingService = vetRatingService;
        }

        // =============================================
        // POST: api/VetRatings
        // Submit a rating for a vet (Adopter only)
        // =============================================
        [HttpPost]
        [Authorize(Roles = "Adopter")]
        public async Task<IActionResult> AddRating([FromBody] VetRatingRequestDto request)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });

                var result = await _vetRatingService.AddRatingAsync(userId, request);

                return Ok(new { Success = true, Message = "تم إرسال التقييم بنجاح.", Data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // GET: api/VetRatings/{vetId}
        // Retrieve all ratings for a vet (public)
        // =============================================
        [HttpGet("{vetId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetVetRatings(int vetId)
        {
            try
            {
                var ratings = await _vetRatingService.GetVetAverageRatingAsync(vetId);

                return Ok(new { Success = true, Data = ratings });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
