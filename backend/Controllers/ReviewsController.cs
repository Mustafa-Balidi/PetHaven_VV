using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.Services;
using System.Security.Claims;

namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Vet")]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewsService _reviewsService;

        public ReviewsController(IReviewsService reviewsService)
        {
            _reviewsService = reviewsService;
        }

        // =============================================
        // GET: api/Reviews
        // Retrieve the logged-in vet's own client reviews
        // with search, filter, pagination and stats.
        // Query params:
        //   search   : keyword to filter by reviewer name or text
        //   filter   : "all" | "unanswered"
        //   page     : page number (default 1)
        //   pageSize : items per page (default 10)
        // =============================================
        [HttpGet]
        [Authorize(Roles = "Vet")]
        public async Task<IActionResult> GetClientReviews(
            [FromQuery] string? search,
            [FromQuery] string? filter,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            // ─── استخراج الـ UserId من التوكن الحالي ─────────────────────
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { Success = false, Message = "لم يتم العثور على هوية المستخدم في التوكن الحالي." });

            int currentUserId = int.Parse(userIdClaim);

            try
            {
                var result = await _reviewsService.GetClientReviewsAsync(currentUserId, search, filter, page, pageSize);
                return Ok(new { Success = true, Data = result });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
