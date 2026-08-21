using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.DTOs;
using PetHaven.Services;
using System.Security.Claims;

namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VetController : ControllerBase
    {
        private readonly IVetService _vetService;

        public VetController(IVetService vetService)
        {
            _vetService = vetService;
        }

        private string? GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        // =============================================
        // GET: api/Vet
        // Get all vets (public)
        // =============================================
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllVets()
        {
            try
            {
                var vets = await _vetService.GetAllVetsAsync();
                return Ok(new { Success = true, Data = vets });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // GET: api/Vet/search
        // Search and filter vets with sorting (public)
        // =============================================
        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchVets([FromQuery] VetSearchDto searchDto)
        {
            try
            {
                var vets = await _vetService.SearchVetsAsync(searchDto);
                return Ok(new { Success = true, Data = vets });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // GET: api/Vet/{id}
        // Get a specific vet by ID (public)
        // =============================================
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetVetById(int id)
        {
            try
            {
                var vet = await _vetService.GetVetByIdAsync(id);
                if (vet == null)
                    return NotFound(new { Success = false, Message = "الطبيب البيطري غير موجود." });

                return Ok(new { Success = true, Data = vet });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // POST: api/Vet/verification/submit
        // إرسال طلب التحقق المهني (رقم الترخيص + الشهادة)
        // =============================================
        [HttpPost("verification/submit")]
        [Consumes("multipart/form-data")]
        [Authorize(Roles = "Vet")]
        public async Task<IActionResult> SubmitVerification([FromForm] SubmitVetVerificationDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var status = await _vetService.SubmitVerificationAsync(userId, dto);
                return Ok(new { Success = true, Message = "تم إرسال طلب التحقق بنجاح، سيتم مراجعته من قبل الإدارة.", Data = status });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // GET: api/Vet/verification/status
        // حالة طلب التحقق: Pending / Approved / Rejected
        // =============================================
        [HttpGet("verification/status")]
        [Authorize(Roles = "Vet")]
        public async Task<IActionResult> GetVerificationStatus()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var status = await _vetService.GetVerificationStatusAsync(userId);
                if (status == null)
                    return NotFound(new { Success = false, Message = "الملف الشخصي للطبيب غير موجود." });

                return Ok(new { Success = true, Data = status });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
