using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.DTOs;
using PetHaven.Services;
using System;
using System.Threading.Tasks;

namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Adopter")] // يمكنك إزالة التعليق إذا أردت حماية المسار للمتبنين فقط
    public class RecommendationsController : ControllerBase
    {
        private readonly IRecommendationAiService _aiService;

        // هذا هو الـ Constructor الذي يحل مشكلة الخطأ الأحمر تحت _aiService
        public RecommendationsController(IRecommendationAiService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("services")]
        public async Task<IActionResult> GetRecommendations([FromBody] AiRecommendationRequestDto requestData)
        {
            try
            {
                // وتعبئة الحقول تلقائياً (Adopter) يمكنك هنا جلب بيانات المتبني من قاعدة البيانات
                // أو الاعتماد على الواجهة الأمامية لإرسالها بالكامل كما فعلنا الآن.

                var recommendations = await _aiService.GetServicesAsync(requestData);
                return Ok(new { Success = true, Data = recommendations });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}