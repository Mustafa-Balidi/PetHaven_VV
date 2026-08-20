using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.DTOs;
using PetHaven.Services;
using System.Security.Claims;

namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Vet")]
    public class VetPatientsController : ControllerBase
    {
        private readonly IPatientsService _patientsService;

        public VetPatientsController(IPatientsService patientsService)
        {
            _patientsService = patientsService;
        }

        private string? GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        // =============================================
        // GET: api/VetPatients/stats
        // إحصائيات بطاقات صفحة دليل المرضى
        // =============================================
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var stats = await _patientsService.GetPatientsStatsAsync(userId);
                return Ok(new { Success = true, Data = stats });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // GET: api/VetPatients?search=&species=&status=&page=&pageSize=
        // قائمة المرضى (بطاقات) مع بحث وفلترة وترقيم صفحات
        // =============================================
        [HttpGet]
        public async Task<IActionResult> GetPatients([FromQuery] string? search = null,
                                                      [FromQuery] string? species = null,
                                                      [FromQuery] string? status = null,
                                                      [FromQuery] int page = 1,
                                                      [FromQuery] int pageSize = 12)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var result = await _patientsService.GetPatientsAsync(userId, search, species, status, page, pageSize);
                return Ok(new { Success = true, Data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // GET: api/VetPatients/{petId}
        // تفاصيل مريض كاملة (معلومات + سجل طبي + تطعيمات)
        // =============================================
        [HttpGet("{petId:int}")]
        public async Task<IActionResult> GetPatient(int petId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var patient = await _patientsService.GetPatientDetailAsync(userId, petId);
                return Ok(new { Success = true, Data = patient });
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

        // =============================================
        // GET: api/VetPatients/{petId}/medical-history
        // السجل الطبي (الفحوصات) الخاص بالمريض
        // =============================================
        [HttpGet("{petId:int}/medical-history")]
        public async Task<IActionResult> GetMedicalHistory(int petId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var history = await _patientsService.GetMedicalHistoryAsync(userId, petId);
                return Ok(new { Success = true, Data = history });
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

        // =============================================
        // GET: api/VetPatients/{petId}/vaccinations
        // سجل تطعيمات المريض
        // =============================================
        [HttpGet("{petId:int}/vaccinations")]
        public async Task<IActionResult> GetVaccinations(int petId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var vaccinations = await _patientsService.GetPetVaccinationsAsync(userId, petId);
                return Ok(new { Success = true, Data = vaccinations });
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

        // =============================================
        // POST: api/VetPatients/{petId}/vaccinations
        // إضافة تطعيمة جديدة للمريض
        // =============================================
        [HttpPost("{petId:int}/vaccinations")]
        public async Task<IActionResult> AddVaccination(int petId, [FromBody] VaccinationRequestDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var vaccination = await _patientsService.AddVaccinationAsync(userId, petId, dto);
                return Ok(new { Success = true, Message = "تمت إضافة التطعيمة بنجاح!", Data = vaccination });
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

        // =============================================
        // PUT: api/VetPatients/vaccinations/{vaccinationId}
        // تعديل تطعيمة
        // =============================================
        [HttpPut("vaccinations/{vaccinationId:int}")]
        public async Task<IActionResult> UpdateVaccination(int vaccinationId, [FromBody] VaccinationRequestDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var vaccination = await _patientsService.UpdateVaccinationAsync(userId, vaccinationId, dto);
                return Ok(new { Success = true, Message = "تم تعديل التطعيمة بنجاح!", Data = vaccination });
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

        // =============================================
        // DELETE: api/VetPatients/vaccinations/{vaccinationId}
        // حذف تطعيمة
        // =============================================
        [HttpDelete("vaccinations/{vaccinationId:int}")]
        public async Task<IActionResult> DeleteVaccination(int vaccinationId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var deleted = await _patientsService.DeleteVaccinationAsync(userId, vaccinationId);
                if (!deleted)
                    return NotFound(new { Success = false, Message = "التطعيمة غير موجودة." });

                return Ok(new { Success = true, Message = "تم حذف التطعيمة بنجاح!" });
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
