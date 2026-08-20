using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.Services;
using System.Security.Claims;

namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Adopter")]
    public class AdopterDashboardController : ControllerBase
    {
        private readonly IAdopterDashboardService _dashboardService;

        public AdopterDashboardController(IAdopterDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        // =============================================
        // GET: api/Dashboard/adopter
        // جلب إحصائيات الـ Dashboard للمتبني
        // =============================================
        [HttpGet("adopter")]
        public async Task<IActionResult> GetAdopterDashboard()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var dashboard = await _dashboardService.GetAdopterDashboardAsync(userId);

                return Ok(new
                {
                    Success = true,
                    Data = dashboard
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }


        // ─── الحيوانات المتبناة (جديد) ──────────────────────────────────────
        // =============================================
        // GET: api/Dashboard/adopter
        // جلب إحصائيات الـحيوانات المتبناة  Dashboard 
        // =============================================
        [HttpGet("adopted-pets")]
        public async Task<IActionResult> GetAdoptedPets()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var pets = await _dashboardService.GetAdoptedPetsAsync(userId);
                return Ok(new { Success = true, Data = pets });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}