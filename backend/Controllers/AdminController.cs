using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.DTOs;
using PetHaven.Services;

namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // =============================================
        // GET: api/Admin/stats
        // إحصائيات عامة للمدير
        // =============================================
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            try
            {
                var stats = await _adminService.GetStatsAsync();
                return Ok(new { Success = true, Data = stats });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // GET: api/Admin/vets/pending
        // جلب الأطباء غير الموافق عليهم
        // =============================================
        [HttpGet("vets/pending")]
        public async Task<IActionResult> GetPendingVets()
        {
            try
            {
                var vets = await _adminService.GetPendingVetsAsync();
                return Ok(new { Success = true, Data = vets });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        // =============================================
        // PUT: api/Admin/vets/{id}/verify
        // الموافقة على طبيب
        // =============================================
        [HttpPut("vets/{id}/verify")]
        public async Task<IActionResult> VerifyVet(int id)
        {
            try
            {
                await _adminService.VerifyVetAsync(id);
                return Ok(new { Success = true, Message = "تمت الموافقة على الطبيب بنجاح." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        // =============================================
        // PUT: api/Admin/vets/{id}/reject
        // رفض طبيب (تحديث الحالة إلى Rejected مع السبب)
        // =============================================
        [HttpPut("vets/{id}/reject")]
        public async Task<IActionResult> RejectVet(int id, [FromBody] RejectVetDto dto)
        {
            try
            {
                await _adminService.RejectVetAsync(id, dto?.Reason);
                return Ok(new { Success = true, Message = "تم رفض الطبيب." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }


        // =============================================
        // PUT: api/Admin/users/{id}/ban
        // حظر مستخدم (عدا Admin)
        // =============================================
        [HttpPut("users/{id}/ban")]
        public async Task<IActionResult> BanUser(int id, [FromBody] BanUserDto dto)
        {
            try
            {
                await _adminService.BanUserAsync(id, dto.Reason);
                return Ok(new { Success = true, Message = "تم حظر المستخدم بنجاح." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // PUT: api/Admin/users/{id}/unban
        // فك الحظر عن مستخدم
        // =============================================
        [HttpPut("users/{id}/unban")]
        public async Task<IActionResult> UnbanUser(int id)
        {
            try
            {
                await _adminService.UnbanUserAsync(id);
                return Ok(new { Success = true, Message = "تم فك الحظر عن المستخدم بنجاح." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }


    }
}