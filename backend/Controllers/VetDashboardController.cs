using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.Services;
using System.Security.Claims;

namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Vet")]
    public class VetDashboardController : ControllerBase
    {
        private readonly IVetDashboardService _dashboardService;

        public VetDashboardController(IVetDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        private string? GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        // =============================================
        // GET: api/VetDashboard/stats
        // بطاقات الإحصائيات (KPI) في الصفحة الرئيسية
        // =============================================
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var stats = await _dashboardService.GetDashboardStatsAsync(userId);
                return Ok(new { Success = true, Data = stats });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // GET: api/VetDashboard/clinic-activity?period=weekly|monthly
        // مخطط نشاط العيادة (عدد المواعيد لكل يوم)
        // =============================================
        [HttpGet("clinic-activity")]
        public async Task<IActionResult> GetClinicActivity([FromQuery] string period = "weekly")
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var activity = await _dashboardService.GetClinicActivityAsync(userId, period);
                return Ok(new { Success = true, Data = activity });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // GET: api/VetDashboard/appointment-breakdown
        // توزيع المواعيد حسب الفئة (مخطط الدونات)
        // =============================================
        [HttpGet("appointment-breakdown")]
        public async Task<IActionResult> GetAppointmentBreakdown()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var breakdown = await _dashboardService.GetAppointmentBreakdownAsync(userId);
                return Ok(new { Success = true, Data = breakdown });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // GET: api/VetDashboard/top-breeds?limit=5
        // السلالات الأكثر تردداً على العيادة
        // =============================================
        [HttpGet("top-breeds")]
        public async Task<IActionResult> GetTopBreeds([FromQuery] int limit = 5)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var breeds = await _dashboardService.GetTopBreedsAsync(userId, limit);
                return Ok(new { Success = true, Data = breeds });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // GET: api/VetDashboard/recent-patients?count=10&search=
        // جدول المرضى الأخيرين مع إمكانية البحث
        // =============================================
        [HttpGet("recent-patients")]
        public async Task<IActionResult> GetRecentPatients([FromQuery] int count = 10, [FromQuery] string? search = null)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var patients = await _dashboardService.GetRecentPatientsAsync(userId, count, search);
                return Ok(new { Success = true, Data = patients });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // GET: api/VetDashboard/today-schedule
        // مواعيد اليوم (Today's Schedule)
        // =============================================
        [HttpGet("today-schedule")]
        public async Task<IActionResult> GetTodaySchedule()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var schedule = await _dashboardService.GetTodayScheduleAsync(userId);
                return Ok(new { Success = true, Data = schedule });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
