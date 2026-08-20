using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.DTOs;
using PetHaven.Services;

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
    }
}
