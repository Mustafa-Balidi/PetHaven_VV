using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PetHaven.DTOs;
using PetHaven.Services;
using System.Security.Claims;

namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // يتطلب تسجيل الدخول لأي دور لقراءة البروفايل
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        // =============================================
        // GET: api/Profile/me
        // جلب تفاصيل الملف الشخصي للمستخدم الحالي
        // =============================================
        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var profile = await _profileService.GetUserProfileAsync(userId);
                return Ok(new { Success = true, Data = profile });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // PUT: api/Profile/update/adopter
        // تعديل بيانات الملف الشخصي - خاص بالمتبني
        // =============================================
        [HttpPut("update/adopter")]
        [Authorize(Roles = "Adopter")] // حماية إضافية: فقط المتبني
        public async Task<IActionResult> UpdateAdopterProfile([FromBody] UpdateAdopterProfileDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                await _profileService.UpdateAdopterProfileAsync(userId, dto);
                return Ok(new { Success = true, Message = "تم تحديث بيانات المتبني بنجاح!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // PUT: api/Profile/update/center
        // تعديل بيانات الملف الشخصي - خاص بالمركز
        // =============================================
        [HttpPut("update/center")]
        [Authorize(Roles = "AdoptionCenter")] // حماية إضافية: فقط المركز
        public async Task<IActionResult> UpdateCenterProfile([FromBody] UpdateCenterProfileDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                await _profileService.UpdateCenterProfileAsync(userId, dto);
                return Ok(new { Success = true, Message = "تم تحديث بيانات المركز بنجاح!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // PUT: api/Profile/update/vet
        // تعديل بيانات الملف الشخصي - خاص بالطبيب
        // =============================================
        [HttpPut("update/vet")]
        [Consumes("multipart/form-data")]
        [Authorize(Roles = "Vet")] // حماية إضافية: فقط الطبيب
        public async Task<IActionResult> UpdateVetProfile([FromForm] UpdateVetProfileDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                if (dto.CertificateFile != null)
                {
                    var certificateUrl = await SavePdfCertificateAsync(dto.CertificateFile);
                    if (certificateUrl == null)
                        return BadRequest(new { Success = false, Message = "يجب رفع ملف PDF فقط للشهادة." });

                    dto.CertificateUrl = certificateUrl;
                }

                await _profileService.UpdateVetProfileAsync(userId, dto);
                return Ok(new { Success = true, Message = "تم تحديث بيانات الطبيب البيطري بنجاح!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        private static async Task<string?> SavePdfCertificateAsync(IFormFile certificateFile)
        {
            if (certificateFile == null || certificateFile.Length == 0)
                return null;

            var extension = Path.GetExtension(certificateFile.FileName).ToLowerInvariant();
            if (certificateFile.ContentType != "application/pdf" && extension != ".pdf")
                return null;

            var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "vet-certificates");
            Directory.CreateDirectory(uploadFolder);

            var fileName = $"{Guid.NewGuid():N}{extension}";
            var filePath = Path.Combine(uploadFolder, fileName);

            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await certificateFile.CopyToAsync(stream);
            }

            return "/uploads/vet-certificates/" + fileName;
        }
    }
}