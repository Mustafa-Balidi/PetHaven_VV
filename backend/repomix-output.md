This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where comments have been removed, empty lines have been removed.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Empty lines have been removed from all files
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
Controllers/
  AdopterDashboardController.cs
  AdoptionController.cs
  AppointmentsController.cs
  AuthController.cs
  BlacklistController.cs
  CartController.cs
  CenterDashboardController.cs
  OrdersController.cs
  PaymentsController.cs
  PetReportsController.cs
  PetsController.cs
  ProductRatingsController.cs
  ProfileController.cs
  RecommendationsController.cs
  ReviewsController.cs
  StoreCatalogController.cs
  VetController.cs
  VetDashboardController.cs
  VetPatientsController.cs
  VetRatingsController.cs
  WishlistController.cs
Data/
  ApplicationDbContext.cs
  DatabaseSeeder.cs
DTOs/
  AddToCartRequestDto.cs
  AdopterAppointmentDto.cs
  AdopterDashboardDto.cs
  AdopterRequestResponseDto.cs
  AdoptionRequestResponseDto.cs
  AiRecommendationRequestDto.cs.cs
  AppointmentAvailabilityDto.cs
  AppointmentBreakdownDto.cs
  AppointmentResponseDto.cs
  AppointmentSummaryDto.cs
  AuthResponseDto.cs
  BanAdopterDto.cs
  BlacklistResponseDto.cs
  CartItemResponseDto.cs
  CartResponseDto.cs
  CategoryResponseDto.cs
  CenterDashboardStatsDto.cs
  CenterProductReviewsResponseDto.cs
  ClientReviewDto.cs
  ClinicActivityPointDto.cs
  CreateAppointmentDto.cs
  CreatePetDto.cs
  CreatePetReportDto.cs
  LoginDto.cs
  MedicalHistoryEntryDto.cs
  OrderItemDto.cs
  OrderResponseDto.cs
  PatientDetailDto.cs
  PatientListDto.cs
  PatientListPageDto.cs
  PaymentRequestDto.cs
  PetReportResponseDto.cs
  PetResponseDto.cs
  ProductDetailDto.cs
  ProductRatingRequestDto.cs
  ProductRatingResponseDto.cs
  ProductRequestDto.cs
  ProductResponseDto.cs
  RecentAdoptionDto.cs
  RecentPatientDto.cs
  RecentProductSaleDto.cs
  RegisterDto.cs
  RescheduleAppointmentDto.cs
  RespondToRequestDto.cs
  ReviewsListResponseDto.cs
  ReviewsStatsDto.cs
  ServiceRecommendationDto.cs
  SubmitAdoptionRequestDto.cs
  TopBreedDto.cs
  UpdateAdopterProfileDto.cs
  UpdateCartItemRequestDto.cs
  UpdateCenterProfileDto.cs
  UpdatePetDto.cs
  UpdateVetProfileDto.cs
  UserDto.cs
  UserProfileDto.cs
  VaccinationDto.cs
  VaccinationRequestDto.cs
  VetDashboardStatsDto.cs
  VetPatientsStatsDto.cs
  VetRatingRequestDto.cs
  VetRatingResponseDto.cs
  VetResponseDto.cs
  VetSearchDto.cs
  WishlistResponseDto.cs
Helpers/
  JwtHelper.cs
Migrations/
  20260620120853_InitialCreate.cs
  20260620120853_InitialCreate.Designer.cs
  20260701125852_AddScoringAndNotesToAdoption.cs
  20260701125852_AddScoringAndNotesToAdoption.Designer.cs
  20260701144125_FixAdoptionAndRemoveAppointmentRequest.cs
  20260701144125_FixAdoptionAndRemoveAppointmentRequest.Designer.cs
  20260717045016_add_vetIdToAppointment.cs
  20260717045016_add_vetIdToAppointment.Designer.cs
  20260814094117_AddProfileImageUrlToUser.cs
  20260814094117_AddProfileImageUrlToUser.Designer.cs
  20260814123755_AddVaccinations.cs
  20260814123755_AddVaccinations.Designer.cs
  20260818082858_UpdateAddProfileImageUrlToUser.cs
  20260818082858_UpdateAddProfileImageUrlToUser.Designer.cs
  ApplicationDbContextModelSnapshot.cs
Models/
  Adopter.cs
  AdoptionCenter.cs
  AdoptionRequest.cs
  Appointment.cs
  Blacklist.cs
  Cart.cs
  CartItem.cs
  Category.cs
  Diagnosis.cs
  Notification.cs
  Order.cs
  OrderItem.cs
  Payment.cs
  Pet.cs
  PetReport.cs
  Product.cs
  Rating.cs
  Role.cs
  User.cs
  Vaccination.cs
  Vet.cs
  Wishlist.cs
Properties/
  launchSettings.json
Services/
  AdopterDashboardService.cs
  AdoptionService.cs
  AppointmentsService.cs
  AuthService.cs
  BlacklistService.cs
  CartService.cs
  CenterDashboardService.cs
  IAdopterDashboardService.cs
  IAdoptionService.cs
  IAppointmentsService.cs
  IAuthService.cs
  IBlacklistService.cs
  ICartService.cs
  ICenterDashboardService.cs
  IOrderService.cs
  IPatientsService.cs
  IPaymentService.cs
  IPetReportService.cs
  IPetService.cs
  IProductRatingService.cs
  IProfileService.cs
  IRecommendationAiService.cs
  IReviewsService.cs
  IStoreCatalogService.cs
  IVetDashboardService.cs
  IVetRatingService.cs
  IVetService.cs
  IWishlistService.cs
  OrderService.cs
  PatientsService.cs
  PaymentService.cs
  PetReportService.cs
  PetService.cs
  ProductRatingService.cs
  ProfileService.cs
  RecommendationAiService.cs
  ReviewsService.cs
  StoreCatalogService.cs
  VetDashboardService.cs
  VetRatingService.cs
  VetService.cs
  WishlistService.cs
.dockerignore
.gitattributes
.gitignore
appsettings.json
backend.http
Dockerfile
PetHaven.csproj
PetHaven.http
PetHaven.sln
Program.cs
```

# Files

## File: Controllers/AdopterDashboardController.cs
```csharp
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
```

## File: Controllers/AdoptionController.cs
```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.DTOs;
using PetHaven.Services;
using System.Security.Claims;
namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdoptionController : ControllerBase
    {
        private readonly IAdoptionService _adoptionService;
        public AdoptionController(IAdoptionService adoptionService)
        {
            _adoptionService = adoptionService;
        }
        [HttpPost("SubmitRequest")]
        [Authorize(Roles = "Adopter")]
        public async Task<IActionResult> SubmitRequest([FromBody] SubmitAdoptionRequestDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                await _adoptionService.SubmitRequestAsync(dto, userId);
                return Ok(new
                {
                    Success = true,
                    Message = "تم إرسال طلب التبني بنجاح!"
                });
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
        [HttpGet("MyRequests")]
        [Authorize(Roles = "Adopter")]
        public async Task<IActionResult> GetMyRequests()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
            try
            {
                var requests = await _adoptionService.GetAdopterRequestsAsync(userId);
                return Ok(new { Success = true, Data = requests });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { Success = false, Message = ex.Message });
            }
        }
        [HttpGet("MyRequests/{requestId:int}")]
        [Authorize(Roles = "Adopter")]
        public async Task<IActionResult> GetMyRequest(int requestId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
            try
            {
                var request = await _adoptionService.GetAdopterRequestAsync(requestId, userId);
                return request == null
                    ? NotFound(new { Success = false, Message = "طلب التبني غير موجود." })
                    : Ok(new { Success = true, Data = request });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { Success = false, Message = ex.Message });
            }
        }
        [HttpGet("CenterRequests")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> GetCenterRequests()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                var requests = await _adoptionService.GetCenterRequestsAsync(userId);
                return Ok(new
                {
                    Success = true,
                    Data    = requests
                });
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
        [HttpPut("Respond/{id}")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> RespondToRequest(int id, [FromBody] RespondToRequestDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                await _adoptionService.RespondToRequestAsync(id, dto, userId);
                var message = dto.Status == "Approved"
                    ? "تمت الموافقة على طلب التبني بنجاح!"
                    : "تم رفض طلب التبني.";
                return Ok(new
                {
                    Success = true,
                    Message = message
                });
            }
            catch (UnauthorizedAccessException ex)
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
    }
}
```

## File: Controllers/AppointmentsController.cs
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PetHaven.Services;
using PetHaven.DTOs;
using PetHaven.Models;
namespace PetHaven.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentsService _appointmentsService;
        public AppointmentsController(IAppointmentsService appointmentsService)
        {
            _appointmentsService = appointmentsService;
        }
        [Authorize(Roles = "Vet")]
        [HttpGet("schedule")]
        public async Task<IActionResult> GetSchedule([FromQuery] DateTime? date)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("لم يتم العثور على هوية المستخدم في التوكن الحالي.");
            int currentUserId = int.Parse(userIdClaim);
            try
            {
                var appointments = await _appointmentsService.GetVetScheduleAsync(currentUserId, date);
                return Ok(new { Success = true, Data = appointments });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "حدث خطأ غير متوقع أثناء جلب جدول المواعيد.");
            }
        }
        [Authorize(Roles = "Vet")]
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary([FromQuery] DateTime? date)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("لم يتم العثور على هوية المستخدم في التوكن الحالي.");
            int currentUserId = int.Parse(userIdClaim);
            try
            {
                var summary = await _appointmentsService.GetVetSummaryAsync(currentUserId, date);
                return Ok(new { Success = true, Data = summary });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "حدث خطأ غير متوقع أثناء جلب الإحصائيات.");
            }
        }
        [Authorize(Roles = "Vet")]
        [HttpPut("update-status/{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromQuery] string status)
        {
            string formattedStatus = status.Trim();
            if (formattedStatus != "Confirmed" && formattedStatus != "Cancelled" && formattedStatus != "Completed")
            {
                return BadRequest("الحالة المرسلة غير صالحة. القيم الصحيحة: Confirmed, Cancelled, Completed.");
            }
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("لم يتم العثور على هوية المستخدم في التوكن الحالي.");
            int currentUserId = int.Parse(userIdClaim);
            try
            {
                var success = await _appointmentsService.UpdateAppointmentStatusAsync(id, formattedStatus, currentUserId);
                if (!success) return NotFound("الموعد المطلوب غير موجود.");
                return Ok(new { message = $"تم تحديث حالة الموعد بنجاح إلى: {formattedStatus}." });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "حدث خطأ غير متوقع أثناء تحديث حالة الموعد.");
            }
        }
        [Authorize(Roles = "Vet,Adopter")]
        [HttpPut("reschedule/{id}")]
        public async Task<IActionResult> Reschedule(int id, [FromBody] RescheduleAppointmentDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("لم يتم العثور على هوية المستخدم في التوكن الحالي.");
            int currentUserId = int.Parse(userIdClaim);
            try
            {
                var success = User.IsInRole("Adopter")
                    ? await _appointmentsService.RescheduleAdopterAppointmentAsync(id, dto.NewDate, currentUserId)
                    : await _appointmentsService.RescheduleAppointmentAsync(id, dto.NewDate, currentUserId);
                if (!success) return NotFound("الموعد المطلوب غير موجود.");
                return Ok(new { Success = true, Message = "تم إعادة جدولة الموعد بنجاح." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "حدث خطأ غير متوقع أثناء إعادة جدولة الموعد.");
            }
        }
        [Authorize(Roles = "Adopter")]
        [HttpGet("availability")]
        public async Task<IActionResult> GetAvailability([FromQuery] int vetId, [FromQuery] DateTime date)
        {
            try
            {
                var availability = await _appointmentsService.GetAvailableSlotsAsync(vetId, date);
                return Ok(new { Success = true, Data = availability });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "حدث خطأ غير متوقع أثناء جلب الأوقات المتاحة.");
            }
        }
        [Authorize(Roles = "Adopter")]
        [HttpGet("my-appointments")]
        public async Task<IActionResult> GetMyAppointments()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out int currentUserId))
                return Unauthorized("لم يتم العثور على هوية المستخدم في التوكن الحالي.");
            try
            {
                var appointments = await _appointmentsService.GetAdopterAppointmentsAsync(currentUserId);
                return Ok(new { Success = true, Data = appointments });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, ex.Message);
            }
        }
        [Authorize(Roles = "Adopter")]
        [HttpGet("{appointmentId:int}")]
        public async Task<IActionResult> GetMyAppointment(int appointmentId)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out int currentUserId))
                return Unauthorized("لم يتم العثور على هوية المستخدم في التوكن الحالي.");
            try
            {
                var appointment = await _appointmentsService
                    .GetAdopterAppointmentAsync(appointmentId, currentUserId);
                return appointment == null
                    ? NotFound("الموعد المطلوب غير موجود.")
                    : Ok(new { Success = true, Data = appointment });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, ex.Message);
            }
        }
        [Authorize(Roles = "Adopter")]
        [HttpPost("book")]
        public async Task<IActionResult> BookAppointment([FromBody] CreateAppointmentDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("لم يتم العثور على هوية المستخدم في التوكن الحالي.");
            }
            int currentUserId = int.Parse(userIdClaim);
            try
            {
                var appointment = await _appointmentsService.BookAppointmentAsync(dto, currentUserId);
                return Ok(new { message = "تم إرسال طلب الحجز بنجاح وبأمان.", appointmentId = appointment.AppointmentId });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "حدث خطأ داخلي غير متوقع أثناء معالجة الحجز.");
            }
        }
        [Authorize(Roles = "Adopter")]
        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> Cancel(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("لم يتم العثور على هوية المستخدم في التوكن الحالي.");
            int currentUserId = int.Parse(userIdClaim);
            try
            {
                var success = await _appointmentsService.CancelAppointmentAsync(id, currentUserId);
                if (!success) return NotFound("الموعد المطلوب غير موجود.");
                return Ok(new { Success = true, Message = "تم إلغاء الموعد بنجاح." });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "حدث خطأ غير متوقع أثناء إلغاء الموعد.");
            }
        }
    }
}
```

## File: Controllers/AuthController.cs
```csharp
using Microsoft.AspNetCore.Mvc;
using PetHaven.DTOs;
using PetHaven.Services;
namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                var result = await _authService.RegisterAsync(registerDto);
                return Ok(new
                {
                    Success = true,
                    Message = "تم تسجيل المستخدم بنجاح!",
                    Data = result
                });
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
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var result = await _authService.LoginAsync(loginDto);
                return Ok(new
                {
                    Success = true,
                    Message = "تم تسجيل الدخول بنجاح!",
                    Data = result
                });
            }
            catch (Exception ex)
            {
                return Unauthorized(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }
    }
}
```

## File: Controllers/BlacklistController.cs
```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.DTOs;
using PetHaven.Services;
using System.Security.Claims;
namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlacklistController : ControllerBase
    {
        private readonly IBlacklistService _blacklistService;
        public BlacklistController(IBlacklistService blacklistService)
        {
            _blacklistService = blacklistService;
        }
        [HttpPost("BanAdopter")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> BanAdopter([FromBody] BanAdopterDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                await _blacklistService.BanAdopterAsync(dto, userId);
                return Ok(new
                {
                    Success = true,
                    Message = "تم حظر المتبني بنجاح."
                });
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
        [HttpGet("CenterBlacklist")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> GetCenterBlacklist()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                var blacklist = await _blacklistService.GetCenterBlacklistAsync(userId);
                return Ok(new
                {
                    Success = true,
                    Data    = blacklist
                });
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
        [HttpPut("UnbanAdopter/{adopterId}")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> UnbanAdopter(int adopterId)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                await _blacklistService.UnbanAdopterAsync(adopterId, userId);
                return Ok(new
                {
                    Success = true,
                    Message = "تم رفع الحظر عن المتبني بنجاح."
                });
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
    }
}
```

## File: Controllers/CartController.cs
```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.DTOs;
using PetHaven.Services;
using System.Security.Claims;
namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Adopter")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;
        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });
                var cart = await _cartService.GetUserCartAsync(userId);
                return Ok(new { Success = true, Data = cart });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPost("Add")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequestDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });
                await _cartService.AddToCartAsync(dto, userId);
                return Ok(new { Success = true, Message = "Product added to cart successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPut("UpdateItem/{cartItemId}")]
        public async Task<IActionResult> UpdateCartItem(int cartItemId, [FromBody] UpdateCartItemRequestDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });
                await _cartService.UpdateCartItemQuantityAsync(cartItemId, dto, userId);
                return Ok(new { Success = true, Message = "Cart item updated successfully." });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        [HttpDelete("RemoveItem/{cartItemId}")]
        public async Task<IActionResult> RemoveFromCart(int cartItemId)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });
                await _cartService.RemoveFromCartAsync(cartItemId, userId);
                return Ok(new { Success = true, Message = "Item removed from cart successfully." });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        [HttpDelete("Clear")]
        public async Task<IActionResult> ClearCart()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });
                await _cartService.ClearCartAsync(userId);
                return Ok(new { Success = true, Message = "Cart cleared successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
```

## File: Controllers/CenterDashboardController.cs
```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.Services;
using System.Security.Claims;
namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "AdoptionCenter")]
    public class CenterDashboardController : ControllerBase
    {
        private readonly ICenterDashboardService _dashboardService;
        public CenterDashboardController(ICenterDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
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
        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders([FromQuery] int count = 5)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                var orders = await _dashboardService.GetLatestOrdersAsync(userId, count);
                return Ok(new { Success = true, Data = orders });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        [HttpGet("recent-adoptions")]
        public async Task<IActionResult> GetRecentAdoptions()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                var adoptions = await _dashboardService.GetRecentAdoptionsAsync(userId);
                return Ok(new { Success = true, Data = adoptions });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        [HttpGet("recent-sales")]
        public async Task<IActionResult> GetRecentSales([FromQuery] int count = 3)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                var sales = await _dashboardService.GetRecentProductSalesAsync(userId, count);
                return Ok(new { Success = true, Data = sales });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
```

## File: Controllers/OrdersController.cs
```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.Services;
using System.Security.Claims;
namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }
        [HttpPost("checkout")]
        [Authorize(Roles = "Adopter")]
        public async Task<IActionResult> Checkout()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });
                var order = await _orderService.CheckoutAsync(userId);
                return Ok(new { Success = true, Message = "Order placed successfully.", Data = order });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        [HttpGet("my-orders")]
        [Authorize(Roles = "Adopter")]
        public async Task<IActionResult> GetMyOrders()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });
                var orders = await _orderService.GetAdopterOrdersAsync(userId);
                return Ok(new { Success = true, Data = orders });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPut("{orderId}/status")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] string status)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(status))
                    return BadRequest(new { Success = false, Message = "Status cannot be empty." });
                await _orderService.UpdateOrderStatusAsync(orderId, status);
                return Ok(new { Success = true, Message = $"Order #{orderId} status updated to '{status}'." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
```

## File: Controllers/PaymentsController.cs
```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.DTOs;
using PetHaven.Services;
using System.Security.Claims;
namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Adopter")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] PaymentRequestDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                await _paymentService.ProcessPaymentAsync(dto, userId);
                return Ok(new { Success = true, Message = "تمت عملية الدفع بنجاح وتسجيلها في النظام." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
```

## File: Controllers/PetReportsController.cs
```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.DTOs;
using PetHaven.Services;
using System.Security.Claims;
namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PetReportsController : ControllerBase
    {
        private readonly IPetReportService _petReportService;
        public PetReportsController(IPetReportService petReportService)
        {
            _petReportService = petReportService;
        }
        [HttpPost("SubmitReport")]
        [Authorize(Roles = "Adopter")]
        public async Task<IActionResult> SubmitReport([FromBody] CreatePetReportDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                var report = await _petReportService.SubmitReportAsync(dto, userId);
                return Ok(new
                {
                    Success = true,
                    Message = "تم تقديم التقرير بنجاح!",
                    Data    = report
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
        [HttpGet("CenterReports")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> GetCenterReports()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                var reports = await _petReportService.GetCenterReportsAsync(userId);
                return Ok(new
                {
                    Success = true,
                    Data    = reports
                });
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
    }
}
```

## File: Controllers/PetsController.cs
```csharp
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.DTOs;
using PetHaven.Services;
namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PetsController : ControllerBase
    {
        private readonly IPetService _petService;
        public PetsController(IPetService petService)
        {
            _petService = petService;
        }
        [HttpPost("CreateCenterPet")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> AddPet([FromBody] CreatePetDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                var result = await _petService.AddPetAsync(dto, userId);
                return Ok(new
                {
                    Success = true,
                    Message = "تم إضافة الحيوان الأليف بنجاح!",
                    Data    = result
                });
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
        [HttpGet("AllPets")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllAvailablePets()
        {
            try
            {
                var pets = await _petService.GetAllAvailablePetsAsync();
                return Ok(new
                {
                    Success = true,
                    Data    = pets
                });
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
        [HttpGet("CenterPets")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> GetMyPets()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                var pets = await _petService.GetPetsByCenterAsync(userId);
                return Ok(new
                {
                    Success = true,
                    Data    = pets
                });
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
        [HttpPut("UpdateCenterPet/{id}")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> UpdatePet(int id, [FromBody] UpdatePetDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                var result = await _petService.UpdatePetAsync(id, dto, userId);
                return Ok(new
                {
                    Success = true,
                    Message = "تم تعديل بيانات الحيوان الأليف بنجاح!",
                    Data    = result
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new
                {
                    Success = false,
                    Message = ex.Message
                });
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
        [HttpDelete("DeleteCenterPet/{id}")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> DeletePet(int id)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                await _petService.DeletePetAsync(id, userId);
                return Ok(new
                {
                    Success = true,
                    Message = "تم حذف الحيوان الأليف بنجاح!"
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new
                {
                    Success = false,
                    Message = ex.Message
                });
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
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPetById(int id)
        {
            try
            {
                var pet = await _petService.GetPetByIdAsync(id);
                if (pet == null)
                    return NotFound(new
                    {
                        Success = false,
                        Message = "الحيوان الأليف المطلوب غير موجود."
                    });
                return Ok(new
                {
                    Success = true,
                    Data = pet
                });
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
    }
}
```

## File: Controllers/ProductRatingsController.cs
```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.DTOs;
using PetHaven.Services;
using System.Security.Claims;
namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductRatingsController : ControllerBase
    {
        private readonly IProductRatingService _productRatingService;
        public ProductRatingsController(IProductRatingService productRatingService)
        {
            _productRatingService = productRatingService;
        }
        [HttpPost]
        [Authorize(Roles = "Adopter")]
        public async Task<IActionResult> AddRating([FromBody] ProductRatingRequestDto request)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });
                var result = await _productRatingService.AddRatingAsync(userId, request);
                return Ok(new { Success = true, Message = "Rating submitted successfully.", Data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        [HttpGet("{productId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductRatings(int productId)
        {
            try
            {
                var ratings = await _productRatingService.GetProductRatingsAsync(productId);
                return Ok(new { Success = true, Data = ratings });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        [HttpGet("CenterReviews")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> GetCenterReviews()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });
                var reviews = await _productRatingService.GetCenterReviewsAsync(userId);
                return Ok(new { Success = true, Data = reviews });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
```

## File: Controllers/ProfileController.cs
```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.DTOs;
using PetHaven.Services;
using System.Security.Claims;
namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;
        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }
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
        [HttpPut("update/adopter")]
        [Authorize(Roles = "Adopter")]
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
        [HttpPut("update/center")]
        [Authorize(Roles = "AdoptionCenter")]
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
        [HttpPut("update/vet")]
        [Authorize(Roles = "Vet")]
        public async Task<IActionResult> UpdateVetProfile([FromBody] UpdateVetProfileDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                await _profileService.UpdateVetProfileAsync(userId, dto);
                return Ok(new { Success = true, Message = "تم تحديث بيانات الطبيب البيطري بنجاح!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
```

## File: Controllers/RecommendationsController.cs
```csharp
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
    [Authorize(Roles = "Adopter")]
    public class RecommendationsController : ControllerBase
    {
        private readonly IRecommendationAiService _aiService;
        public RecommendationsController(IRecommendationAiService aiService)
        {
            _aiService = aiService;
        }
        [HttpPost("services")]
        public async Task<IActionResult> GetRecommendations([FromBody] AiRecommendationRequestDto requestData)
        {
            try
            {
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
```

## File: Controllers/ReviewsController.cs
```csharp
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
        [HttpGet]
        [Authorize(Roles = "Vet")]
        public async Task<IActionResult> GetClientReviews(
            [FromQuery] string? search,
            [FromQuery] string? filter,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
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
```

## File: Controllers/StoreCatalogController.cs
```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetHaven.DTOs;
using PetHaven.Services;
using System.Security.Claims;
namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoreCatalogController : ControllerBase
    {
        private readonly IStoreCatalogService _storeCatalogService;
        public StoreCatalogController(IStoreCatalogService storeCatalogService)
        {
            _storeCatalogService = storeCatalogService;
        }
        [HttpGet("Categories")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllCategories()
        {
            try
            {
                var categories = await _storeCatalogService.GetAllCategoriesAsync();
                return Ok(new { Success = true, Data = categories });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        [HttpGet("Products")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllAvailableProducts()
        {
            try
            {
                var products = await _storeCatalogService.GetAllAvailableProductsAsync();
                return Ok(new { Success = true, Data = products });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        [HttpGet("CenterProducts")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> GetCenterProducts()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                var products = await _storeCatalogService.GetCenterProductsAsync(userId);
                return Ok(new { Success = true, Data = products });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPost("AddProduct")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> AddProduct([FromBody] ProductRequestDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                var product = await _storeCatalogService.AddProductAsync(dto, userId);
                return Ok(new { Success = true, Message = "تمت إضافة المنتج بنجاح.", Data = product });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPut("UpdateProduct/{id}")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductRequestDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                var product = await _storeCatalogService.UpdateProductAsync(id, dto, userId);
                return Ok(new { Success = true, Message = "تم تحديث المنتج بنجاح.", Data = product });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        [HttpDelete("DeleteProduct/{id}")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });
                await _storeCatalogService.DeleteProductAsync(id, userId);
                return Ok(new { Success = true, Message = "تم حذف المنتج بنجاح." });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        [HttpGet("Products/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductById(int id)
        {
            try
            {
                var product = await _storeCatalogService.GetProductByIdAsync(id);
                if (product == null)
                    return NotFound(new { Success = false, Message = "المنتج غير موجود." });
                return Ok(new { Success = true, Data = product });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
```

## File: Controllers/VetController.cs
```csharp
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
```

## File: Controllers/VetDashboardController.cs
```csharp
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
```

## File: Controllers/VetPatientsController.cs
```csharp
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
```

## File: Controllers/VetRatingsController.cs
```csharp
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
```

## File: Controllers/WishlistController.cs
```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.Services;
using System.Security.Claims;
namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Adopter")]
    public class WishlistController : ControllerBase
    {
        private readonly IWishlistService _wishlistService;
        public WishlistController(IWishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }
        [HttpGet]
        public async Task<IActionResult> GetWishlist()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });
                var wishlist = await _wishlistService.GetUserWishlistAsync(userId);
                return Ok(new { Success = true, Data = wishlist });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPost("{productId}")]
        public async Task<IActionResult> AddToWishlist(int productId)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });
                await _wishlistService.AddToWishlistAsync(productId, userId);
                return Ok(new { Success = true, Message = "Product added to wishlist successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        [HttpDelete("{productId}")]
        public async Task<IActionResult> RemoveFromWishlist(int productId)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "User could not be identified." });
                await _wishlistService.RemoveFromWishlistAsync(productId, userId);
                return Ok(new { Success = true, Message = "Product removed from wishlist successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
```

## File: Data/ApplicationDbContext.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Models;
namespace PetHaven.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public double? CalculateDistance(double? lat1, double? lng1, double? lat2, double? lng2)
                => throw new NotSupportedException();
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Adopter> Adopters { get; set; }
        public DbSet<AdoptionCenter> AdoptionCenters { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Pet> Pets { get; set; }
        public DbSet<Blacklist> Blacklists { get; set; }
        public DbSet<Wishlist> Wishlists { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<AdoptionRequest> AdoptionRequests { get; set; }
        public DbSet<Diagnosis> Diagnoses { get; set; }
        public DbSet<Vaccination> Vaccinations { get; set; }
        public DbSet<PetReport> PetReports { get; set; }
        public DbSet<Vet> Vets { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasDbFunction(typeof(ApplicationDbContext).GetMethod(nameof(CalculateDistance),
                new[] { typeof(double?), typeof(double?), typeof(double?), typeof(double?) })!)
                .HasTranslation(args =>
                {
                    return args.First();
                });
            modelBuilder.Entity<Order>()
                .Property(o => o.TotalPrice)
                .HasPrecision(18, 2);
            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.UnitPrice)
                .HasPrecision(18, 2);
            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.PriceAtPurchase)
                .HasPrecision(18, 2);
            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasPrecision(18, 2);
            modelBuilder.Entity<Product>()
                .Property(p => p.ProductPrice)
                .HasPrecision(18, 2);
            modelBuilder.Entity<Product>()
                .Property(p => p.DiscountRate)
                .HasPrecision(18, 2);
            modelBuilder.Entity<Adopter>()
                .Property(a => a.Balance)
                .HasPrecision(18, 2);
            modelBuilder.Entity<Vet>()
                .Property(v => v.Location_Lat)
                .HasPrecision(18, 8);
            modelBuilder.Entity<Vet>()
                .Property(v => v.Location_Lng)
                .HasPrecision(18, 8);
            modelBuilder.Entity<Adopter>()
                .HasOne(a => a.User)
                .WithOne(u => u.Adopter)
                .HasForeignKey<Adopter>(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<AdoptionCenter>()
                .HasOne(ac => ac.User)
                .WithOne(u => u.AdoptionCenter)
                .HasForeignKey<AdoptionCenter>(ac => ac.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Vet>()
                .HasOne(v => v.User)
                .WithOne(u => u.Vet)
                .HasForeignKey<Vet>(v => v.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Rating>()
                .HasOne(r => r.User)
                .WithMany(u => u.Ratings)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Cart>()
                .HasOne(c => c.User)
                .WithMany(u => u.Carts)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Wishlist>()
                .HasOne(w => w.User)
                .WithMany(u => u.Wishlists)
                .HasForeignKey(w => w.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Diagnosis>()
                .HasOne(d => d.User)
                .WithMany(u => u.Diagnoses)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Adopter)
                .WithMany(ad => ad.Appointments)
                .HasForeignKey(a => a.AdopterId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Pet)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PetId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Pet>()
                .HasOne(p => p.Center)
                .WithMany(c => c.Pets)
                .HasForeignKey(p => p.CenterId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Vet)
                .WithMany(v => v.Appointments)
                .HasForeignKey(a => a.VetId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Diagnosis>()
                .HasOne(d => d.Pet)
                .WithMany(p => p.Diagnoses)
                .HasForeignKey(d => d.PetId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Center)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CenterId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Order)
                .WithOne(o => o.Payment)
                .HasForeignKey<Payment>(p => p.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany(p => p.OrderItems)
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.Cart)
                .WithMany(c => c.CartItems)
                .HasForeignKey(ci => ci.CartId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.Product)
                .WithMany(p => p.CartItems)
                .HasForeignKey(ci => ci.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Wishlist>()
                .HasOne(w => w.Product)
                .WithMany(p => p.Wishlists)
                .HasForeignKey(w => w.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Blacklist>()
                .HasOne(b => b.Adopter)
                .WithMany(a => a.Blacklists)
                .HasForeignKey(b => b.AdopterId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Blacklist>()
                .HasOne(b => b.Center)
                .WithMany(c => c.Blacklists)
                .HasForeignKey(b => b.CenterId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<PetReport>()
                .HasOne(pr => pr.AdoptionRequest)
                .WithMany(ar => ar.PetReports)
                .HasForeignKey(pr => pr.AdoptionRequestId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<AdoptionRequest>()
                .HasOne(ar => ar.Adopter)
                .WithMany()
                .HasForeignKey(ar => ar.AdopterId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<AdoptionRequest>()
                .HasOne(ar => ar.Pet)
                .WithMany()
                .HasForeignKey(ar => ar.PetId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Vaccination>()
                .HasOne(v => v.Pet)
                .WithMany(p => p.Vaccinations)
                .HasForeignKey(v => v.PetId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
```

## File: Data/DatabaseSeeder.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Models;
namespace PetHaven.Data
{
    public class DatabaseSeeder
    {
        private readonly ApplicationDbContext _context;
        public DatabaseSeeder(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task SeedAsync()
        {
            if (await _context.Ratings.AnyAsync(r => r.TargetType == "Vet")) return;
            var roleAdopter        = await EnsureRoleAsync("Adopter");
            var roleCenter         = await EnsureRoleAsync("AdoptionCenter");
            var roleVet            = await EnsureRoleAsync("Vet");
            await _context.SaveChangesAsync();
            var adopterUser = new User
            {
                RoleId      = roleAdopter.RoleId,
                UserName    = "john_adopter",
                FullName    = "John Smith",
                Email       = "john.adopter@pethaven.com",
                Password    = BCrypt.Net.BCrypt.HashPassword("Adopter@123"),
                PhoneNumber = "+1-555-0101"
            };
            var centerUser = new User
            {
                RoleId      = roleCenter.RoleId,
                UserName    = "happy_paws_center",
                FullName    = "Happy Paws Adoption Center",
                Email       = "contact@happypaws.com",
                Password    = BCrypt.Net.BCrypt.HashPassword("Center@123"),
                PhoneNumber = "+1-555-0202"
            };
            var vetUser = new User
            {
                RoleId      = roleVet.RoleId,
                UserName    = "dr_sarah_vet",
                FullName    = "Dr. Sarah Johnson",
                Email       = "sarah.johnson@pethaven.com",
                Password    = BCrypt.Net.BCrypt.HashPassword("Vet@123"),
                PhoneNumber = "+1-555-0303"
            };
            await _context.Users.AddRangeAsync(adopterUser, centerUser, vetUser);
            await _context.SaveChangesAsync();
            var adopterProfile = new Adopter
            {
                UserId           = adopterUser.UserId,
                Address          = "123 Maple Street, Springfield, IL 62701",
                HousingType      = "House",
                HasPetBefore     = true,
                ExperienceLevel  = "Intermediate",
                MissedReportsCount = 0,
                Balance          = 500.00m
            };
            var adopterCart = new Cart
            {
                UserId    = adopterUser.UserId,
                CreatedAt = DateTime.UtcNow
            };
            var centerProfile = new AdoptionCenter
            {
                UserId      = centerUser.UserId,
                CenterName  = "Happy Paws Adoption Center",
                Address     = "456 Oak Avenue, Chicago, IL 60601",
                ContactInfo = "contact@happypaws.com | +1-555-0202"
            };
            var vetProfile = new Vet
            {
                UserId          = vetUser.UserId,
                FullName        = "Dr. Sarah Johnson",
                Specialization  = "Small Animal Medicine",
                ClinicName      = "PetCare Veterinary Clinic",
                ClinicAddress   = "789 Elm Road, Chicago, IL 60602",
                PhoneNumber     = "+1-555-0303",
                Email           = "sarah.johnson@pethaven.com",
                ExperienceYears = 8,
                LicenseNumber   = "VET-IL-2024-00123",
                Location_Lat    = 33.513972m,
                Location_Lng    = 36.276537m,
                IsVerified      = true,
                CreatedAt       = DateTime.UtcNow
            };
            await _context.Adopters.AddAsync(adopterProfile);
            await _context.Carts.AddAsync(adopterCart);
            await _context.AdoptionCenters.AddAsync(centerProfile);
            await _context.Vets.AddAsync(vetProfile);
            await _context.SaveChangesAsync();
            var catFood = new Category
            {
                CategoryName = "Food",
                Description  = "Nutritious meals and treats for all pet types.",
                ImageURL     = "https://placehold.co/200x200?text=Food"
            };
            var catToys = new Category
            {
                CategoryName = "Toys",
                Description  = "Fun and engaging toys to keep pets active.",
                ImageURL     = "https://placehold.co/200x200?text=Toys"
            };
            var catMedicine = new Category
            {
                CategoryName = "Medicine",
                Description  = "Health supplements, vitamins, and medication.",
                ImageURL     = "https://placehold.co/200x200?text=Medicine"
            };
            var catAccessories = new Category
            {
                CategoryName = "Accessories",
                Description  = "Collars, leashes, beds, and grooming supplies.",
                ImageURL     = "https://placehold.co/200x200?text=Accessories"
            };
            await _context.Categories.AddRangeAsync(catFood, catToys, catMedicine, catAccessories);
            await _context.SaveChangesAsync();
            var products = new List<Product>
            {
                new Product
                {
                    CenterId      = centerProfile.CenterId,
                    CategoryId    = catFood.CategoryId,
                    Name          = "Premium Dog Kibble (5 kg)",
                    Description   = "High-protein dry food formulated for adult dogs of all breeds.",
                    ProductPrice  = 34.99m,
                    DiscountRate  = 0.05m,
                    StockQuantity = 80,
                    ImageURL      = "https://placehold.co/300x300?text=DogKibble"
                },
                new Product
                {
                    CenterId      = centerProfile.CenterId,
                    CategoryId    = catFood.CategoryId,
                    Name          = "Gourmet Wet Cat Food (24-pack)",
                    Description   = "Grain-free pâté with real tuna for adult cats.",
                    ProductPrice  = 27.49m,
                    DiscountRate  = 0.00m,
                    StockQuantity = 60,
                    ImageURL      = "https://placehold.co/300x300?text=CatFood"
                },
                new Product
                {
                    CenterId      = centerProfile.CenterId,
                    CategoryId    = catToys.CategoryId,
                    Name          = "Interactive Rope Tug Toy",
                    Description   = "Durable braided rope toy ideal for fetch and tug-of-war.",
                    ProductPrice  = 9.99m,
                    DiscountRate  = 0.10m,
                    StockQuantity = 150,
                    ImageURL      = "https://placehold.co/300x300?text=RopeToy"
                },
                new Product
                {
                    CenterId      = centerProfile.CenterId,
                    CategoryId    = catToys.CategoryId,
                    Name          = "Feather Wand Cat Teaser",
                    Description   = "Retractable wand with colourful feather attachment for cats.",
                    ProductPrice  = 7.49m,
                    DiscountRate  = 0.00m,
                    StockQuantity = 120,
                    ImageURL      = "https://placehold.co/300x300?text=Feather"
                },
                new Product
                {
                    CenterId      = centerProfile.CenterId,
                    CategoryId    = catMedicine.CategoryId,
                    Name          = "Omega-3 Fish Oil Supplements (90 caps)",
                    Description   = "Supports coat health, joint function, and immune system in dogs and cats.",
                    ProductPrice  = 19.99m,
                    DiscountRate  = 0.00m,
                    StockQuantity = 200,
                    ImageURL      = "https://placehold.co/300x300?text=Omega3"
                },
                new Product
                {
                    CenterId      = centerProfile.CenterId,
                    CategoryId    = catAccessories.CategoryId,
                    Name          = "Adjustable Nylon Dog Collar (Medium)",
                    Description   = "Lightweight, waterproof collar with quick-release buckle.",
                    ProductPrice  = 12.99m,
                    DiscountRate  = 0.15m,
                    StockQuantity = 95,
                    ImageURL      = "https://placehold.co/300x300?text=Collar"
                }
            };
            await _context.Products.AddRangeAsync(products);
            await _context.SaveChangesAsync();
            var pets = new List<Pet>
            {
                new Pet
                {
                    CenterId     = centerProfile.CenterId,
                    PetName      = "Buddy",
                    Species      = "Dog",
                    Breed        = "Golden Retriever",
                    Age          = 2,
                    Gender       = "Male",
                    HealthStatus = "Healthy",
                    Description  = "Friendly and energetic golden retriever who loves to play fetch.",
                    ImageURL     = "https://placehold.co/400x400?text=Buddy"
                },
                new Pet
                {
                    CenterId     = centerProfile.CenterId,
                    PetName      = "Luna",
                    Species      = "Cat",
                    Breed        = "Siamese",
                    Age          = 3,
                    Gender       = "Female",
                    HealthStatus = "Healthy",
                    Description  = "Elegant Siamese cat with striking blue eyes. Very affectionate.",
                    ImageURL     = "https://placehold.co/400x400?text=Luna"
                },
                new Pet
                {
                    CenterId     = centerProfile.CenterId,
                    PetName      = "Max",
                    Species      = "Dog",
                    Breed        = "German Shepherd",
                    Age          = 4,
                    Gender       = "Male",
                    HealthStatus = "Healthy",
                    Description  = "Intelligent and loyal German Shepherd, well-trained and great with kids.",
                    ImageURL     = "https://placehold.co/400x400?text=Max"
                },
                new Pet
                {
                    CenterId     = centerProfile.CenterId,
                    PetName      = "Bella",
                    Species      = "Cat",
                    Breed        = "Persian",
                    Age          = 1,
                    Gender       = "Female",
                    HealthStatus = "Healthy",
                    Description  = "Fluffy Persian kitten with a playful personality.",
                    ImageURL     = "https://placehold.co/400x400?text=Bella"
                },
                new Pet
                {
                    CenterId     = centerProfile.CenterId,
                    PetName      = "Charlie",
                    Species      = "Dog",
                    Breed        = "Beagle",
                    Age          = 5,
                    Gender       = "Male",
                    HealthStatus = "Healthy",
                    Description  = "Curious and gentle Beagle, great with families and other dogs.",
                    ImageURL     = "https://placehold.co/400x400?text=Charlie"
                },
                new Pet
                {
                    CenterId     = centerProfile.CenterId,
                    PetName      = "Mango",
                    Species      = "Rabbit",
                    Breed        = "Holland Lop",
                    Age          = 1,
                    Gender       = "Male",
                    HealthStatus = "Healthy",
                    Description  = "Adorable Holland Lop rabbit with floppy ears and a calm temperament.",
                    ImageURL     = "https://placehold.co/400x400?text=Mango"
                }
            };
await _context.Pets.AddRangeAsync(pets);
            await _context.SaveChangesAsync();
            var today = DateTime.Today;
            var appointments = new List<Appointment>
            {
                new Appointment
                {
                    AdopterId      = adopterProfile.AdopterId,
                    PetId          = pets[0].PetId,
                    VetId          = vetProfile.VetId,
                    AppointmentDate = today.AddHours(9),
                    Status         = "Pending",
                    Reason         = "فحص دوري وتطعيمات"
                },
                new Appointment
                {
                    AdopterId      = adopterProfile.AdopterId,
                    PetId          = pets[1].PetId,
                    VetId          = vetProfile.VetId,
                    AppointmentDate = today.AddHours(10).AddMinutes(30),
                    Status         = "Confirmed",
                    Reason         = "تنظيف الأسنان"
                },
                new Appointment
                {
                    AdopterId      = adopterProfile.AdopterId,
                    PetId          = pets[4].PetId,
                    VetId          = vetProfile.VetId,
                    AppointmentDate = today.AddHours(13).AddMinutes(15),
                    Status         = "Confirmed",
                    Reason         = "فحص العرج المفاجئ"
                },
                new Appointment
                {
                    AdopterId      = adopterProfile.AdopterId,
                    PetId          = pets[3].PetId,
                    VetId          = vetProfile.VetId,
                    AppointmentDate = today.AddHours(8),
                    Status         = "Completed",
                    Reason         = "متابعة ما بعد العملية"
                },
                new Appointment
                {
                    AdopterId      = adopterProfile.AdopterId,
                    PetId          = pets[2].PetId,
                    VetId          = vetProfile.VetId,
                    AppointmentDate = today.AddHours(11),
                    Status         = "Cancelled",
                    Reason         = "إلغاء من قبل صاحب الحيوان"
                }
            };
            await _context.Appointments.AddRangeAsync(appointments);
            await _context.SaveChangesAsync();
            var sarahUser = new User
            {
                RoleId      = roleAdopter.RoleId,
                UserName    = "sarah_j",
                FullName    = "Sarah J.",
                Email       = "sarah.j@pethaven.com",
                Password    = BCrypt.Net.BCrypt.HashPassword("Adopter@123"),
                PhoneNumber = "+1-555-0404"
            };
            var markUser = new User
            {
                RoleId      = roleAdopter.RoleId,
                UserName    = "mark_p",
                FullName    = "Mark P.",
                Email       = "mark.p@pethaven.com",
                Password    = BCrypt.Net.BCrypt.HashPassword("Adopter@123"),
                PhoneNumber = "+1-555-0505"
            };
            var lindaUser = new User
            {
                RoleId      = roleAdopter.RoleId,
                UserName    = "linda_t",
                FullName    = "Linda T.",
                Email       = "linda.t@pethaven.com",
                Password    = BCrypt.Net.BCrypt.HashPassword("Adopter@123"),
                PhoneNumber = "+1-555-0606"
            };
            var omarUser = new User
            {
                RoleId      = roleAdopter.RoleId,
                UserName    = "omar_k",
                FullName    = "Omar K.",
                Email       = "omar.k@pethaven.com",
                Password    = BCrypt.Net.BCrypt.HashPassword("Adopter@123"),
                PhoneNumber = "+1-555-0707"
            };
            var emilyUser = new User
            {
                RoleId      = roleAdopter.RoleId,
                UserName    = "emily_r",
                FullName    = "Emily R.",
                Email       = "emily.r@pethaven.com",
                Password    = BCrypt.Net.BCrypt.HashPassword("Adopter@123"),
                PhoneNumber = "+1-555-0808"
            };
            await _context.Users.AddRangeAsync(sarahUser, markUser, lindaUser, omarUser, emilyUser);
            await _context.SaveChangesAsync();
            var sarahProfile = new Adopter { UserId = sarahUser.UserId, HousingType = "House", HasPetBefore = true, Balance = 120.00m };
            var markProfile  = new Adopter { UserId = markUser.UserId,  HousingType = "Apartment", HasPetBefore = true, Balance = 80.00m };
            var lindaProfile = new Adopter { UserId = lindaUser.UserId, HousingType = "House", HasPetBefore = true, Balance = 200.00m };
            var omarProfile  = new Adopter { UserId = omarUser.UserId,  HousingType = "Apartment", HasPetBefore = true, Balance = 60.00m };
            var emilyProfile = new Adopter { UserId = emilyUser.UserId, HousingType = "House", HasPetBefore = false, Balance = 150.00m };
            await _context.Adopters.AddRangeAsync(sarahProfile, markProfile, lindaProfile, omarProfile, emilyProfile);
            await _context.SaveChangesAsync();
            var ratings = new List<Rating>
            {
                new Rating
                {
                    UserId      = sarahUser.UserId,
                    TargetType  = "Vet",
                    TargetId    = vetProfile.VetId,
                    StarsCount  = 5,
                    ReviewText  = "Absolutely wonderful experience! Dr. Smith was so patient with Daisy during her annual checkup. The staff is always friendly and the clinic is spotless. Highly recommend Pet Haven to anyone looking for compassionate care.",
                    CreatedAt   = DateTime.UtcNow.AddDays(-3)
                },
                new Rating
                {
                    UserId      = markUser.UserId,
                    TargetType  = "Vet",
                    TargetId    = vetProfile.VetId,
                    StarsCount  = 4,
                    ReviewText  = "Great care for my dog, but we did have to wait about 20 minutes past our appointment time before being seen. Once in the room, everything went smoothly.",
                    CreatedAt   = DateTime.UtcNow.AddDays(-7)
                },
                new Rating
                {
                    UserId      = lindaUser.UserId,
                    TargetType  = "Vet",
                    TargetId    = vetProfile.VetId,
                    StarsCount  = 5,
                    ReviewText  = "I wouldn't trust anyone else with Bella. The team here always goes above and beyond.",
                    CreatedAt   = DateTime.UtcNow.AddDays(-12)
                },
                new Rating
                {
                    UserId      = omarUser.UserId,
                    TargetType  = "Vet",
                    TargetId    = vetProfile.VetId,
                    StarsCount  = 5,
                    ReviewText  = "Very professional and caring. They explained everything clearly and my cat felt at ease.",
                    CreatedAt   = DateTime.UtcNow.AddDays(-15)
                },
                new Rating
                {
                    UserId      = emilyUser.UserId,
                    TargetType  = "Vet",
                    TargetId    = vetProfile.VetId,
                    StarsCount  = 4,
                    ReviewText  = "Great experience overall. The vet was knowledgeable and took time to answer all my questions.",
                    CreatedAt   = DateTime.UtcNow.AddDays(-20)
                },
                new Rating
                {
                    UserId      = adopterUser.UserId,
                    TargetType  = "Vet",
                    TargetId    = vetProfile.VetId,
                    StarsCount  = 5,
                    ReviewText  = null,
                    CreatedAt   = DateTime.UtcNow.AddDays(-1)
                }
            };
            await _context.Ratings.AddRangeAsync(ratings);
            await _context.SaveChangesAsync();
        }
        private async Task<Role> EnsureRoleAsync(string roleName)
        {
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == roleName);
            if (role == null)
            {
                role = new Role { RoleName = roleName };
                await _context.Roles.AddAsync(role);
            }
            return role;
        }
    }
}
```

## File: DTOs/AddToCartRequestDto.cs
```csharp
using System.ComponentModel.DataAnnotations;
namespace PetHaven.DTOs
{
    public class AddToCartRequestDto
    {
        [Required]
        public int ProductId { get; set; }
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }
    }
}
```

## File: DTOs/AdopterAppointmentDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class AdopterAppointmentDto
    {
        public int AppointmentId { get; set; }
        public int PetId { get; set; }
        public string PetName { get; set; } = string.Empty;
        public int VetId { get; set; }
        public string VetName { get; set; } = string.Empty;
        public DateTime AppointmentDate { get; set; }
        public string? Reason { get; set; }
        public string? Status { get; set; }
    }
}
```

## File: DTOs/AdopterDashboardDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class AdopterDashboardDto
    {
        public int PendingAdoptionsCount { get; set; }
        public int AdoptedPetsCount { get; set; }
        public int RecentOrdersCount { get; set; }
        public int? DaysSinceLastAdoption { get; set; }
        public string? LastAdoptedPetName { get; set; }
        public string? WelcomeMessage { get; set; }
    }
}
```

## File: DTOs/AdopterRequestResponseDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class AdopterRequestResponseDto
    {
        public int RequestId { get; set; }
        public int PetId { get; set; }
        public string PetName { get; set; } = string.Empty;
        public string? PetImage { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
        public int Score { get; set; }
        public string? CenterNotes { get; set; }
        public string? Species { get; set; }
        public string? Breed { get; set; }
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string? HealthStatus { get; set; }
        public string? Description { get; set; }
        public string? CenterName { get; set; }
    }
}
```

## File: DTOs/AdoptionRequestResponseDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class AdoptionRequestResponseDto
    {
        public int RequestId { get; set; }
        public string PetName { get; set; } = string.Empty;
        public string AdopterName { get; set; } = string.Empty;
        public int Score { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime RequestDate { get; set; }
    }
}
```

## File: DTOs/AiRecommendationRequestDto.cs.cs
```csharp
using System.Text.Json.Serialization;
namespace PetHaven.DTOs
{
    public class AiRecommendationRequestDto
    {
        [JsonPropertyName("housing_type")]
        public string HousingType { get; set; } = string.Empty;
        [JsonPropertyName("outdoor_space")]
        public string OutdoorSpace { get; set; } = string.Empty;
        [JsonPropertyName("family_type")]
        public string FamilyType { get; set; } = string.Empty;
        [JsonPropertyName("hours_available")]
        public string HoursAvailable { get; set; } = string.Empty;
        [JsonPropertyName("weekend_time")]
        public string WeekendTime { get; set; } = string.Empty;
        [JsonPropertyName("experience_level")]
        public string ExperienceLevel { get; set; } = string.Empty;
        [JsonPropertyName("training_ability")]
        public string TrainingAbility { get; set; } = string.Empty;
        [JsonPropertyName("activity_level")]
        public string ActivityLevel { get; set; } = string.Empty;
        [JsonPropertyName("noise_tolerance")]
        public string NoiseTolerance { get; set; } = string.Empty;
        [JsonPropertyName("budget_level")]
        public string BudgetLevel { get; set; } = string.Empty;
        [JsonPropertyName("maintenance_tolerance")]
        public string MaintenanceTolerance { get; set; } = string.Empty;
        [JsonPropertyName("size_preference")]
        public string SizePreference { get; set; } = string.Empty;
        [JsonPropertyName("grooming_tolerance")]
        public string GroomingTolerance { get; set; } = string.Empty;
        [JsonPropertyName("energy_preference")]
        public string EnergyPreference { get; set; } = string.Empty;
        [JsonPropertyName("affection_preference")]
        public string AffectionPreference { get; set; } = string.Empty;
        [JsonPropertyName("top_n")]
        public int TopN { get; set; } = 3;
    }
}
```

## File: DTOs/AppointmentAvailabilityDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class AppointmentAvailabilityDto
    {
        public int VetId { get; set; }
        public string Date { get; set; } = string.Empty;
        public int SlotDurationMinutes { get; set; }
        public IReadOnlyList<string> AvailableSlots { get; set; } = Array.Empty<string>();
    }
}
```

## File: DTOs/AppointmentBreakdownDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class AppointmentBreakdownDto
    {
        public string Category { get; set; } = string.Empty;
        public int Count { get; set; }
        public double Percentage { get; set; }
    }
}
```

## File: DTOs/AppointmentResponseDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class AppointmentResponseDto
    {
        public int AppointmentId { get; set; }
        public int PetId { get; set; }
        public string PetName { get; set; } = string.Empty;
        public string? Species { get; set; }
        public string? Breed { get; set; }
        public string? PetImageUrl { get; set; }
        public string OwnerName { get; set; } = string.Empty;
        public DateTime AppointmentDate { get; set; }
        public string? Status { get; set; }
        public string? Reason { get; set; }
        public string TimeDisplay { get; set; } = string.Empty;
    }
}
```

## File: DTOs/AppointmentSummaryDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class AppointmentSummaryDto
    {
        public int TotalToday { get; set; }
        public int ConfirmedCount { get; set; }
        public int PendingCount { get; set; }
        public int CancelledCount { get; set; }
        public int CompletedCount { get; set; }
    }
}
```

## File: DTOs/AuthResponseDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public UserDto User { get; set; } = new UserDto();
    }
}
```

## File: DTOs/BanAdopterDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class BanAdopterDto
    {
        public int AdopterId { get; set; }
        public string Reason { get; set; } = string.Empty;
    }
}
```

## File: DTOs/BlacklistResponseDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class BlacklistResponseDto
    {
        public int BlacklistId { get; set; }
        public string AdopterName { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public DateTime BanDate { get; set; }
        public bool IsActive { get; set; }
    }
}
```

## File: DTOs/CartItemResponseDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class CartItemResponseDto
    {
        public int CartItemId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
```

## File: DTOs/CartResponseDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class CartResponseDto
    {
        public int CartId { get; set; }
        public decimal CartTotal { get; set; }
        public List<CartItemResponseDto> Items { get; set; } = new List<CartItemResponseDto>();
    }
}
```

## File: DTOs/CategoryResponseDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class CategoryResponseDto
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
```

## File: DTOs/CenterDashboardStatsDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class CenterDashboardStatsDto
    {
        public int AvailablePetsCount { get; set; }
        public int PendingRequestsCount { get; set; }
        public int SuccessfulAdoptionsThisMonth { get; set; }
        public decimal StoreSalesToday { get; set; }
    }
}
```

## File: DTOs/CenterProductReviewsResponseDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class CenterProductReviewsResponseDto
    {
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public List<CenterRatingBreakdownDto> Breakdown { get; set; } = new();
        public List<CenterProductReviewDto> Reviews { get; set; } = new();
    }
    public class CenterRatingBreakdownDto
    {
        public int Stars { get; set; }
        public int Count { get; set; }
        public int Percent { get; set; }
    }
    public class CenterProductReviewDto
    {
        public int RatingId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string AdopterName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
```

## File: DTOs/ClientReviewDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class ClientReviewDto
    {
        public int RatingId { get; set; }
        public string ReviewerName { get; set; } = string.Empty;
        public int StarsCount { get; set; }
        public string? ReviewText { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
```

## File: DTOs/ClinicActivityPointDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class ClinicActivityPointDto
    {
        public string Label { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}
```

## File: DTOs/CreateAppointmentDto.cs
```csharp
public class CreateAppointmentDto
{
    public int PetId { get; set; }
    public int VetId { get; set; }
    public DateTime AppointmentDate { get; set; }
    public string? Reason { get; set; }
}
```

## File: DTOs/CreatePetDto.cs
```csharp
using System.ComponentModel.DataAnnotations;
namespace PetHaven.DTOs
{
    public class CreatePetDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(50)]
        public string? Species { get; set; }
        [MaxLength(50)]
        public string? Breed { get; set; }
        public int? Age { get; set; }
        [MaxLength(20)]
        public string? Gender { get; set; }
        public string? Description { get; set; }
        [MaxLength(50)]
        public string? HealthStatus { get; set; }
        [MaxLength(500)]
        public string? ImageUrl { get; set; }
    }
}
```

## File: DTOs/CreatePetReportDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class CreatePetReportDto
    {
        public int AdoptionRequestId { get; set; }
        public string? ImageUrl { get; set; }
        public string? HealthStatus { get; set; }
        public string? Notes { get; set; }
    }
}
```

## File: DTOs/LoginDto.cs
```csharp
using System.ComponentModel.DataAnnotations;
namespace PetHaven.DTOs
{
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
```

## File: DTOs/MedicalHistoryEntryDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class MedicalHistoryEntryDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? DoctorName { get; set; }
    }
}
```

## File: DTOs/OrderItemDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
```

## File: DTOs/OrderResponseDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class OrderResponseDto
    {
        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
    }
}
```

## File: DTOs/PatientDetailDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class PatientDetailDto
    {
        public int PetId { get; set; }
        public string PetName { get; set; } = string.Empty;
        public string? Species { get; set; }
        public string? Breed { get; set; }
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string? ImageUrl { get; set; }
        public string? HealthStatus { get; set; }
        public string Status { get; set; } = "Healthy";
        public string OwnerName { get; set; } = string.Empty;
        public string? PatientIdDisplay { get; set; }
        public DateTime? LastVisitDate { get; set; }
        public int VisitCount { get; set; }
        public IEnumerable<MedicalHistoryEntryDto> MedicalHistory { get; set; } = new List<MedicalHistoryEntryDto>();
        public IEnumerable<VaccinationDto> Vaccinations { get; set; } = new List<VaccinationDto>();
    }
}
```

## File: DTOs/PatientListDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class PatientListDto
    {
        public int PetId { get; set; }
        public string PetName { get; set; } = string.Empty;
        public string? Species { get; set; }
        public string? Breed { get; set; }
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string? ImageUrl { get; set; }
        public string? HealthStatus { get; set; }
        public string Status { get; set; } = "Healthy";
        public string OwnerName { get; set; } = string.Empty;
        public DateTime? LastVisitDate { get; set; }
        public int VisitCount { get; set; }
        public string? PatientIdDisplay { get; set; }
    }
}
```

## File: DTOs/PatientListPageDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class PatientListPageDto
    {
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public IEnumerable<PatientListDto> Items { get; set; } = new List<PatientListDto>();
    }
}
```

## File: DTOs/PaymentRequestDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class PaymentRequestDto
    {
        public int OrderId { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string? TransactionId { get; set; }
    }
}
```

## File: DTOs/PetReportResponseDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class PetReportResponseDto
    {
        public int ReportId { get; set; }
        public int AdoptionRequestId { get; set; }
        public int AdopterId { get; set; }
        public string PetName { get; set; } = string.Empty;
        public string AdopterName { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? HealthStatus { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
```

## File: DTOs/PetResponseDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class PetResponseDto
    {
        public int PetId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Species { get; set; }
        public string? Breed { get; set; }
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string? Description { get; set; }
        public string? HealthStatus { get; set; }
        public string? ImageUrl { get; set; }
        public string CenterName { get; set; } = string.Empty;
        public string Status { get; set; } = "Available";
    }
}
```

## File: DTOs/ProductDetailDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class ProductReviewDto
    {
        public int RatingId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int StarsCount { get; set; }
        public string? ReviewText { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    public class ProductDetailDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public int StockQuantity { get; set; }
        public decimal OriginalPrice { get; set; }
        public decimal DiscountRate { get; set; }
        public decimal FinalPrice { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int CenterId { get; set; }
        public string CenterName { get; set; } = string.Empty;
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public List<ProductReviewDto> Reviews { get; set; } = new List<ProductReviewDto>();
    }
}
```

## File: DTOs/ProductRatingRequestDto.cs
```csharp
using System.ComponentModel.DataAnnotations;
namespace PetHaven.DTOs
{
    public class ProductRatingRequestDto
    {
        [Required]
        public int ProductId { get; set; }
        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
```

## File: DTOs/ProductRatingResponseDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class ProductRatingResponseDto
    {
        public int RatingId { get; set; }
        public int ProductId { get; set; }
        public string AdopterId { get; set; } = string.Empty;
        public string AdopterName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
```

## File: DTOs/ProductRequestDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class ProductRequestDto
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal ProductPrice { get; set; }
        public decimal DiscountRate { get; set; }
        public int StockQuantity { get; set; }
        public string? ImageUrl { get; set; }
    }
}
```

## File: DTOs/ProductResponseDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class ProductResponseDto
    {
        public int ProductId { get; set; }
        public int CenterId { get; set; }
        public string CenterName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal ProductPrice { get; set; }
        public decimal DiscountRate { get; set; }
        public decimal PriceAfterDiscount { get; set; }
        public int StockQuantity { get; set; }
        public string? ImageUrl { get; set; }
    }
}
```

## File: DTOs/RecentAdoptionDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class RecentAdoptionDto
    {
        public string PetName { get; set; } = string.Empty;
        public string? PetImageUrl { get; set; }
        public DateTime AdoptedDate { get; set; }
    }
}
```

## File: DTOs/RecentPatientDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class RecentPatientDto
    {
        public int PetId { get; set; }
        public string PetName { get; set; } = string.Empty;
        public string? Species { get; set; }
        public string? Breed { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime? LastVisitDate { get; set; }
        public int VisitCount { get; set; }
    }
}
```

## File: DTOs/RecentProductSaleDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class RecentProductSaleDto
    {
        public string ProductName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public DateTime SoldDate { get; set; }
        public string? ProductImageUrl { get; set; }
    }
}
```

## File: DTOs/RegisterDto.cs
```csharp
using System.ComponentModel.DataAnnotations;
namespace PetHaven.DTOs
{
    public class RegisterDto
    {
        [Required]
        [MaxLength(200)]
        public string FullName { get; set; } = string.Empty;
        [Required]
        [MaxLength(100)]
        public string UserName { get; set; } = string.Empty;
        [MaxLength(50)]
        public string? PhoneNumber { get; set; }
        [Required]
        [EmailAddress]
        [MaxLength(200)]
        public string Email { get; set; } = string.Empty;
        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;
        [Required]
        [MaxLength(100)]
        public string Role { get; set; } = string.Empty;
    }
}
```

## File: DTOs/RescheduleAppointmentDto.cs
```csharp
using System;
namespace PetHaven.DTOs
{
    public class RescheduleAppointmentDto
    {
        public DateTime NewDate { get; set; }
    }
}
```

## File: DTOs/RespondToRequestDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class RespondToRequestDto
    {
        public string Status { get; set; } = string.Empty;
        public string? CenterNote { get; set; }
    }
}
```

## File: DTOs/ReviewsListResponseDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class ReviewsListResponseDto
    {
        public ReviewsStatsDto Stats { get; set; } = new();
        public IEnumerable<ClientReviewDto> Items { get; set; } = new List<ClientReviewDto>();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
    }
}
```

## File: DTOs/ReviewsStatsDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class ReviewsStatsDto
    {
        public double AverageRating { get; set; }
        public int TotalCount { get; set; }
        public int UnansweredCount { get; set; }
        public Dictionary<int, int> StarDistribution { get; set; } = new();
        public Dictionary<int, double> StarPercentages { get; set; } = new();
    }
}
```

## File: DTOs/ServiceRecommendationDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class ServiceRecommendationDto
    {
        public string ServiceName { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public decimal EstimatedPrice { get; set; }
    }
}
```

## File: DTOs/SubmitAdoptionRequestDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class SubmitAdoptionRequestDto
    {
        public int PetId { get; set; }
        public string HousingType { get; set; } = string.Empty;
        public bool HasPetBefore { get; set; }
        public string ExperienceLevel { get; set; } = string.Empty;
        public int FreeHoursPerDay { get; set; }
    }
}
```

## File: DTOs/TopBreedDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class TopBreedDto
    {
        public string Breed { get; set; } = string.Empty;
        public int Count { get; set; }
        public double Percentage { get; set; }
    }
}
```

## File: DTOs/UpdateAdopterProfileDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class UpdateAdopterProfileDto
    {
        public string FullName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string? HousingType { get; set; }
        public string? ExperienceLevel { get; set; }
        public int? FreeHoursPerDay { get; set; }
        public bool? HasPetBefore { get; set; }
        public string? ImageUrl { get; set; }
    }
}
```

## File: DTOs/UpdateCartItemRequestDto.cs
```csharp
using System.ComponentModel.DataAnnotations;
namespace PetHaven.DTOs
{
    public class UpdateCartItemRequestDto
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }
    }
}
```

## File: DTOs/UpdateCenterProfileDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class UpdateCenterProfileDto
    {
        public string CenterName { get; set; } = string.Empty;
        public string? ContactInfo { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ImageUrl { get; set; }
    }
}
```

## File: DTOs/UpdatePetDto.cs
```csharp
using System.ComponentModel.DataAnnotations;
namespace PetHaven.DTOs
{
    public class UpdatePetDto
    {
        [MaxLength(100)]
        public string? Name { get; set; }
        public int? Age { get; set; }
        [MaxLength(50)]
        public string? HealthStatus { get; set; }
        public string? Description { get; set; }
        [MaxLength(500)]
        public string? ImageUrl { get; set; }
    }
}
```

## File: DTOs/UpdateVetProfileDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class UpdateVetProfileDto
    {
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ClinicName { get; set; }
        public string? ClinicAddress { get; set; }
        public string? Specialization { get; set; }
        public int? ExperienceYears { get; set; }
        public string? LicenseNumber { get; set; }
        public decimal? Location_Lat { get; set; }
        public decimal? Location_Lng { get; set; }
    }
}
```

## File: DTOs/UserDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string Role { get; set; } = string.Empty;
    }
}
```

## File: DTOs/UserProfileDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class UserProfileDto
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string Role { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; }
        public string? Address { get; set; }
        public string? HousingType { get; set; }
        public bool? HasPetBefore { get; set; }
        public string? ExperienceLevel { get; set; }
        public int? FreeHoursPerDay { get; set; }
        public decimal? Balance { get; set; }
        public string? CenterName { get; set; }
        public string? ContactInfo { get; set; }
        public string? ClinicName { get; set; }
        public string? ClinicAddress { get; set; }
        public string? Specialization { get; set; }
        public int? ExperienceYears { get; set; }
        public string? LicenseNumber { get; set; }
        public bool? IsVerified { get; set; }
    }
}
```

## File: DTOs/VaccinationDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class VaccinationDto
    {
        public int VaccinationId { get; set; }
        public int PetId { get; set; }
        public string VaccineName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime VaccinationDate { get; set; }
        public DateTime? NextDueDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
```

## File: DTOs/VaccinationRequestDto.cs
```csharp
using System.ComponentModel.DataAnnotations;
namespace PetHaven.DTOs
{
    public class VaccinationRequestDto
    {
        [Required]
        [MaxLength(200)]
        public string VaccineName { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? Description { get; set; }
        [Required]
        public DateTime VaccinationDate { get; set; }
        public DateTime? NextDueDate { get; set; }
    }
}
```

## File: DTOs/VetDashboardStatsDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class VetDashboardStatsDto
    {
        public int TotalPatients { get; set; }
        public int AppointmentsToday { get; set; }
        public int RemainingAppointmentsToday { get; set; }
        public int Reviews { get; set; }
        public decimal RevenueThisMonth { get; set; }
    }
}
```

## File: DTOs/VetPatientsStatsDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class VetPatientsStatsDto
    {
        public int TotalPatients { get; set; }
        public int ActiveCases { get; set; }
        public int RecentlyAdded30d { get; set; }
    }
}
```

## File: DTOs/VetRatingRequestDto.cs
```csharp
using System.ComponentModel.DataAnnotations;
namespace PetHaven.DTOs
{
    public class VetRatingRequestDto
    {
        [Required]
        public int VetId { get; set; }
        [Required]
        [Range(1, 5, ErrorMessage = "التقييم يجب أن يكون بين 1 و 5.")]
        public int Rating { get; set; }
        public string? ReviewText { get; set; }
    }
}
```

## File: DTOs/VetRatingResponseDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class VetRatingResponseDto
    {
        public int RatingId { get; set; }
        public int VetId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? ReviewText { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
```

## File: DTOs/VetResponseDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class VetResponseDto
    {
        public int VetId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Specialization { get; set; }
        public string? ClinicName { get; set; }
        public string? ClinicAddress { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public int? ExperienceYears { get; set; }
        public string? LicenseNumber { get; set; }
        public decimal? Location_Lat { get; set; }
        public decimal? Location_Lng { get; set; }
        public bool IsVerified { get; set; }
        public double? AverageRating { get; set; }
        public int TotalRatings { get; set; }
        public double? DistanceInKm { get; set; }
    }
}
```

## File: DTOs/VetSearchDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class VetSearchDto
    {
        public double? UserLatitude { get; set; }
        public double? UserLongitude { get; set; }
        public decimal? Radius { get; set; }
        public string? SortBy { get; set; }
        public string? Specialization { get; set; }
    }
}
```

## File: DTOs/WishlistResponseDto.cs
```csharp
namespace PetHaven.DTOs
{
    public class WishlistResponseDto
    {
        public int WishlistItemId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal CurrentPrice { get; set; }
        public string? ImageUrl { get; set; }
    }
}
```

## File: Helpers/JwtHelper.cs
```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using PetHaven.Models;
namespace PetHaven.Helpers
{
    public class JwtHelper
    {
        private readonly IConfiguration _configuration;
        public JwtHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string GenerateToken(User user, string roleName)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!);
            var expiryInMinutes = _configuration.GetValue<int>("Jwt:ExpiryInMinutes", 20);
            var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, roleName),
                    new Claim("FullName", user.FullName)
                };
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(expiryInMinutes),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        public string GenerateRefreshToken()
        {
            return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        }
    }
}
```

## File: Migrations/20260620120853_InitialCreate.cs
```csharp
using System;
using Microsoft.EntityFrameworkCore.Migrations;
#nullable disable
namespace PetHaven.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppointmentRequests",
                columns: table => new
                {
                    AppointmentRequestId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ImageURL = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    HealthStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentRequests", x => x.AppointmentRequestId);
                });
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImageURL = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.CategoryId);
                });
            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.RoleId);
                });
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Users_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "RoleId",
                        onDelete: ReferentialAction.Cascade);
                });
            migrationBuilder.CreateTable(
                name: "Adopters",
                columns: table => new
                {
                    AdopterId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    HousingType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    HasPetBefore = table.Column<bool>(type: "bit", nullable: false),
                    ExperienceLevel = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    MissedReportsCount = table.Column<int>(type: "int", nullable: false),
                    LastReportDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Balance = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Adopters", x => x.AdopterId);
                    table.ForeignKey(
                        name: "FK_Adopters_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });
            migrationBuilder.CreateTable(
                name: "AdoptionCenters",
                columns: table => new
                {
                    CenterId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CenterName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ContactInfo = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdoptionCenters", x => x.CenterId);
                    table.ForeignKey(
                        name: "FK_AdoptionCenters_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });
            migrationBuilder.CreateTable(
                name: "Carts",
                columns: table => new
                {
                    CartId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Carts", x => x.CartId);
                    table.ForeignKey(
                        name: "FK_Carts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    NotificationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    IsRead = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.NotificationId);
                    table.ForeignKey(
                        name: "FK_Notifications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    OrderId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    OrderDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.OrderId);
                    table.ForeignKey(
                        name: "FK_Orders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.CreateTable(
                name: "Ratings",
                columns: table => new
                {
                    RatingId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TargetType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TargetId = table.Column<int>(type: "int", nullable: false),
                    StarsCount = table.Column<int>(type: "int", nullable: false),
                    ReviewText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ratings", x => x.RatingId);
                    table.ForeignKey(
                        name: "FK_Ratings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.CreateTable(
                name: "Vets",
                columns: table => new
                {
                    VetId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Specialization = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ClinicName = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ClinicAddress = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ExperienceYears = table.Column<int>(type: "int", nullable: true),
                    LicenseNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Location_Lat = table.Column<decimal>(type: "decimal(18,8)", precision: 18, scale: 8, nullable: true),
                    Location_Lng = table.Column<decimal>(type: "decimal(18,8)", precision: 18, scale: 8, nullable: true),
                    IsVerified = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vets", x => x.VetId);
                    table.ForeignKey(
                        name: "FK_Vets_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });
            migrationBuilder.CreateTable(
                name: "PetReports",
                columns: table => new
                {
                    ReportId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdoptionRequestId = table.Column<int>(type: "int", nullable: false),
                    ImageURL = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    HealthStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PetReports", x => x.ReportId);
                    table.ForeignKey(
                        name: "FK_PetReports_Adopters_AdoptionRequestId",
                        column: x => x.AdoptionRequestId,
                        principalTable: "Adopters",
                        principalColumn: "AdopterId",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.CreateTable(
                name: "Blacklists",
                columns: table => new
                {
                    BlacklistId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdopterId = table.Column<int>(type: "int", nullable: false),
                    CenterId = table.Column<int>(type: "int", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    BlockedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Blacklists", x => x.BlacklistId);
                    table.ForeignKey(
                        name: "FK_Blacklists_Adopters_AdopterId",
                        column: x => x.AdopterId,
                        principalTable: "Adopters",
                        principalColumn: "AdopterId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Blacklists_AdoptionCenters_CenterId",
                        column: x => x.CenterId,
                        principalTable: "AdoptionCenters",
                        principalColumn: "CenterId",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.CreateTable(
                name: "Pets",
                columns: table => new
                {
                    PetId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CenterId = table.Column<int>(type: "int", nullable: false),
                    PetName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Species = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Breed = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Age = table.Column<int>(type: "int", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    HealthStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImageURL = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pets", x => x.PetId);
                    table.ForeignKey(
                        name: "FK_Pets_AdoptionCenters_CenterId",
                        column: x => x.CenterId,
                        principalTable: "AdoptionCenters",
                        principalColumn: "CenterId",
                        onDelete: ReferentialAction.Cascade);
                });
            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    ProductId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CenterId = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProductPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    DiscountRate = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    StockQuantity = table.Column<int>(type: "int", nullable: false),
                    ImageURL = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.ProductId);
                    table.ForeignKey(
                        name: "FK_Products_AdoptionCenters_CenterId",
                        column: x => x.CenterId,
                        principalTable: "AdoptionCenters",
                        principalColumn: "CenterId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Products_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    PaymentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PaymentStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.PaymentId);
                    table.ForeignKey(
                        name: "FK_Payments_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                });
            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    AppointmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdopterId = table.Column<int>(type: "int", nullable: false),
                    PetId = table.Column<int>(type: "int", nullable: false),
                    AppointmentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.AppointmentId);
                    table.ForeignKey(
                        name: "FK_Appointments_Adopters_AdopterId",
                        column: x => x.AdopterId,
                        principalTable: "Adopters",
                        principalColumn: "AdopterId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Appointments_Pets_PetId",
                        column: x => x.PetId,
                        principalTable: "Pets",
                        principalColumn: "PetId",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.CreateTable(
                name: "Diagnoses",
                columns: table => new
                {
                    DiagnosisId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PetId = table.Column<int>(type: "int", nullable: false),
                    Symptoms = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Result = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Diagnoses", x => x.DiagnosisId);
                    table.ForeignKey(
                        name: "FK_Diagnoses_Pets_PetId",
                        column: x => x.PetId,
                        principalTable: "Pets",
                        principalColumn: "PetId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Diagnoses_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.CreateTable(
                name: "CartItems",
                columns: table => new
                {
                    CartItemId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CartId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CartItems", x => x.CartItemId);
                    table.ForeignKey(
                        name: "FK_CartItems_Carts_CartId",
                        column: x => x.CartId,
                        principalTable: "Carts",
                        principalColumn: "CartId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CartItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    OrderItemId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PriceAtPurchase = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.OrderItemId);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.CreateTable(
                name: "Wishlists",
                columns: table => new
                {
                    WishlistId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    AddedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Wishlists", x => x.WishlistId);
                    table.ForeignKey(
                        name: "FK_Wishlists_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Wishlists_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.CreateIndex(
                name: "IX_Adopters_UserId",
                table: "Adopters",
                column: "UserId",
                unique: true);
            migrationBuilder.CreateIndex(
                name: "IX_AdoptionCenters_UserId",
                table: "AdoptionCenters",
                column: "UserId",
                unique: true);
            migrationBuilder.CreateIndex(
                name: "IX_Appointments_AdopterId",
                table: "Appointments",
                column: "AdopterId");
            migrationBuilder.CreateIndex(
                name: "IX_Appointments_PetId",
                table: "Appointments",
                column: "PetId");
            migrationBuilder.CreateIndex(
                name: "IX_Blacklists_AdopterId",
                table: "Blacklists",
                column: "AdopterId");
            migrationBuilder.CreateIndex(
                name: "IX_Blacklists_CenterId",
                table: "Blacklists",
                column: "CenterId");
            migrationBuilder.CreateIndex(
                name: "IX_CartItems_CartId",
                table: "CartItems",
                column: "CartId");
            migrationBuilder.CreateIndex(
                name: "IX_CartItems_ProductId",
                table: "CartItems",
                column: "ProductId");
            migrationBuilder.CreateIndex(
                name: "IX_Carts_UserId",
                table: "Carts",
                column: "UserId");
            migrationBuilder.CreateIndex(
                name: "IX_Diagnoses_PetId",
                table: "Diagnoses",
                column: "PetId");
            migrationBuilder.CreateIndex(
                name: "IX_Diagnoses_UserId",
                table: "Diagnoses",
                column: "UserId");
            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications",
                column: "UserId");
            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");
            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems",
                column: "ProductId");
            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                table: "Orders",
                column: "UserId");
            migrationBuilder.CreateIndex(
                name: "IX_Payments_OrderId",
                table: "Payments",
                column: "OrderId",
                unique: true);
            migrationBuilder.CreateIndex(
                name: "IX_PetReports_AdoptionRequestId",
                table: "PetReports",
                column: "AdoptionRequestId");
            migrationBuilder.CreateIndex(
                name: "IX_Pets_CenterId",
                table: "Pets",
                column: "CenterId");
            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");
            migrationBuilder.CreateIndex(
                name: "IX_Products_CenterId",
                table: "Products",
                column: "CenterId");
            migrationBuilder.CreateIndex(
                name: "IX_Ratings_UserId",
                table: "Ratings",
                column: "UserId");
            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                column: "RoleId");
            migrationBuilder.CreateIndex(
                name: "IX_Vets_UserId",
                table: "Vets",
                column: "UserId",
                unique: true);
            migrationBuilder.CreateIndex(
                name: "IX_Wishlists_ProductId",
                table: "Wishlists",
                column: "ProductId");
            migrationBuilder.CreateIndex(
                name: "IX_Wishlists_UserId",
                table: "Wishlists",
                column: "UserId");
        }
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppointmentRequests");
            migrationBuilder.DropTable(
                name: "Appointments");
            migrationBuilder.DropTable(
                name: "Blacklists");
            migrationBuilder.DropTable(
                name: "CartItems");
            migrationBuilder.DropTable(
                name: "Diagnoses");
            migrationBuilder.DropTable(
                name: "Notifications");
            migrationBuilder.DropTable(
                name: "OrderItems");
            migrationBuilder.DropTable(
                name: "Payments");
            migrationBuilder.DropTable(
                name: "PetReports");
            migrationBuilder.DropTable(
                name: "Ratings");
            migrationBuilder.DropTable(
                name: "Vets");
            migrationBuilder.DropTable(
                name: "Wishlists");
            migrationBuilder.DropTable(
                name: "Carts");
            migrationBuilder.DropTable(
                name: "Pets");
            migrationBuilder.DropTable(
                name: "Orders");
            migrationBuilder.DropTable(
                name: "Adopters");
            migrationBuilder.DropTable(
                name: "Products");
            migrationBuilder.DropTable(
                name: "AdoptionCenters");
            migrationBuilder.DropTable(
                name: "Categories");
            migrationBuilder.DropTable(
                name: "Users");
            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
```

## File: Migrations/20260620120853_InitialCreate.Designer.cs
```csharp
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PetHaven.Data;
#nullable disable
namespace PetHaven.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260620120853_InitialCreate")]
    partial class InitialCreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.28")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);
            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.Property<int>("AdopterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AdopterId"));
                    b.Property<string>("Address")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<decimal>("Balance")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<string>("ExperienceLevel")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<bool>("HasPetBefore")
                        .HasColumnType("bit");
                    b.Property<string>("HousingType")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<DateTime?>("LastReportDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("MissedReportsCount")
                        .HasColumnType("int");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("AdopterId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("Adopters");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.Property<int>("CenterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CenterId"));
                    b.Property<string>("Address")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("CenterName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("ContactInfo")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("CenterId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("AdoptionCenters");
                });
            modelBuilder.Entity("PetHaven.Models.Appointment", b =>
                {
                    b.Property<int>("AppointmentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AppointmentId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<DateTime>("AppointmentDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<string>("Reason")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("AppointmentId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("PetId");
                    b.ToTable("Appointments");
                });
            modelBuilder.Entity("PetHaven.Models.AppointmentRequest", b =>
                {
                    b.Property<int>("AppointmentRequestId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AppointmentRequestId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("HealthStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("Notes")
                        .HasColumnType("nvarchar(max)");
                    b.HasKey("AppointmentRequestId");
                    b.ToTable("AppointmentRequests");
                });
            modelBuilder.Entity("PetHaven.Models.Blacklist", b =>
                {
                    b.Property<int>("BlacklistId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("BlacklistId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<DateTime>("BlockedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<bool>("IsActive")
                        .HasColumnType("bit");
                    b.Property<string>("Reason")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.HasKey("BlacklistId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("CenterId");
                    b.ToTable("Blacklists");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.Property<int>("CartId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CartId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("CartId");
                    b.HasIndex("UserId");
                    b.ToTable("Carts");
                });
            modelBuilder.Entity("PetHaven.Models.CartItem", b =>
                {
                    b.Property<int>("CartItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CartItemId"));
                    b.Property<int>("CartId")
                        .HasColumnType("int");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("Quantity")
                        .HasColumnType("int");
                    b.HasKey("CartItemId");
                    b.HasIndex("CartId");
                    b.HasIndex("ProductId");
                    b.ToTable("CartItems");
                });
            modelBuilder.Entity("PetHaven.Models.Category", b =>
                {
                    b.Property<int>("CategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CategoryId"));
                    b.Property<string>("CategoryName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.HasKey("CategoryId");
                    b.ToTable("Categories");
                });
            modelBuilder.Entity("PetHaven.Models.Diagnosis", b =>
                {
                    b.Property<int>("DiagnosisId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("DiagnosisId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<string>("Result")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Symptoms")
                        .HasColumnType("nvarchar(max)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("DiagnosisId");
                    b.HasIndex("PetId");
                    b.HasIndex("UserId");
                    b.ToTable("Diagnoses");
                });
            modelBuilder.Entity("PetHaven.Models.Notification", b =>
                {
                    b.Property<int>("NotificationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("NotificationId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<bool>("IsRead")
                        .HasColumnType("bit");
                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("Type")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("NotificationId");
                    b.HasIndex("UserId");
                    b.ToTable("Notifications");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.Property<int>("OrderId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("OrderId"));
                    b.Property<DateTime>("OrderDate")
                        .HasColumnType("datetime2");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<decimal>("TotalPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("OrderId");
                    b.HasIndex("UserId");
                    b.ToTable("Orders");
                });
            modelBuilder.Entity("PetHaven.Models.OrderItem", b =>
                {
                    b.Property<int>("OrderItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("OrderItemId"));
                    b.Property<int>("OrderId")
                        .HasColumnType("int");
                    b.Property<decimal>("PriceAtPurchase")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("Quantity")
                        .HasColumnType("int");
                    b.Property<decimal>("UnitPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.HasKey("OrderItemId");
                    b.HasIndex("OrderId");
                    b.HasIndex("ProductId");
                    b.ToTable("OrderItems");
                });
            modelBuilder.Entity("PetHaven.Models.Payment", b =>
                {
                    b.Property<int>("PaymentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PaymentId"));
                    b.Property<decimal>("Amount")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("OrderId")
                        .HasColumnType("int");
                    b.Property<DateTime>("PaymentDate")
                        .HasColumnType("datetime2");
                    b.Property<string>("PaymentMethod")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("PaymentStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("PaymentId");
                    b.HasIndex("OrderId")
                        .IsUnique();
                    b.ToTable("Payments");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.Property<int>("PetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PetId"));
                    b.Property<int?>("Age")
                        .HasColumnType("int");
                    b.Property<string>("Breed")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Gender")
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");
                    b.Property<string>("HealthStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("PetName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<string>("Species")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("PetId");
                    b.HasIndex("CenterId");
                    b.ToTable("Pets");
                });
            modelBuilder.Entity("PetHaven.Models.PetReport", b =>
                {
                    b.Property<int>("ReportId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ReportId"));
                    b.Property<int>("AdoptionRequestId")
                        .HasColumnType("int");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("HealthStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("Notes")
                        .HasColumnType("nvarchar(max)");
                    b.HasKey("ReportId");
                    b.HasIndex("AdoptionRequestId");
                    b.ToTable("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.Property<int>("ProductId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ProductId"));
                    b.Property<int>("CategoryId")
                        .HasColumnType("int");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<decimal>("DiscountRate")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<decimal>("ProductPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("StockQuantity")
                        .HasColumnType("int");
                    b.HasKey("ProductId");
                    b.HasIndex("CategoryId");
                    b.HasIndex("CenterId");
                    b.ToTable("Products");
                });
            modelBuilder.Entity("PetHaven.Models.Rating", b =>
                {
                    b.Property<int>("RatingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RatingId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("ReviewText")
                        .HasColumnType("nvarchar(max)");
                    b.Property<int>("StarsCount")
                        .HasColumnType("int");
                    b.Property<int>("TargetId")
                        .HasColumnType("int");
                    b.Property<string>("TargetType")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("RatingId");
                    b.HasIndex("UserId");
                    b.ToTable("Ratings");
                });
            modelBuilder.Entity("PetHaven.Models.Role", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RoleId"));
                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.HasKey("RoleId");
                    b.ToTable("Roles");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserId"));
                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("RoleId")
                        .HasColumnType("int");
                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.HasKey("UserId");
                    b.HasIndex("RoleId");
                    b.ToTable("Users");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.Property<int>("VetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("VetId"));
                    b.Property<string>("ClinicAddress")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("ClinicName")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("Email")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<int?>("ExperienceYears")
                        .HasColumnType("int");
                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<bool>("IsVerified")
                        .HasColumnType("bit");
                    b.Property<string>("LicenseNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<decimal?>("Location_Lat")
                        .HasPrecision(18, 8)
                        .HasColumnType("decimal(18,8)");
                    b.Property<decimal?>("Location_Lng")
                        .HasPrecision(18, 8)
                        .HasColumnType("decimal(18,8)");
                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("Specialization")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("VetId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("Vets");
                });
            modelBuilder.Entity("PetHaven.Models.Wishlist", b =>
                {
                    b.Property<int>("WishlistId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("WishlistId"));
                    b.Property<DateTime>("AddedDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("WishlistId");
                    b.HasIndex("ProductId");
                    b.HasIndex("UserId");
                    b.ToTable("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("Adopter")
                        .HasForeignKey("PetHaven.Models.Adopter", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("AdoptionCenter")
                        .HasForeignKey("PetHaven.Models.AdoptionCenter", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Appointment", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany("Appointments")
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany("Appointments")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Pet");
                });
            modelBuilder.Entity("PetHaven.Models.Blacklist", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany("Blacklists")
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Blacklists")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Carts")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.CartItem", b =>
                {
                    b.HasOne("PetHaven.Models.Cart", "Cart")
                        .WithMany("CartItems")
                        .HasForeignKey("CartId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("CartItems")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Cart");
                    b.Navigation("Product");
                });
            modelBuilder.Entity("PetHaven.Models.Diagnosis", b =>
                {
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany("Diagnoses")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Diagnoses")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Pet");
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Notification", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Notifications")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Orders")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.OrderItem", b =>
                {
                    b.HasOne("PetHaven.Models.Order", "Order")
                        .WithMany("OrderItems")
                        .HasForeignKey("OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("OrderItems")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Order");
                    b.Navigation("Product");
                });
            modelBuilder.Entity("PetHaven.Models.Payment", b =>
                {
                    b.HasOne("PetHaven.Models.Order", "Order")
                        .WithOne("Payment")
                        .HasForeignKey("PetHaven.Models.Payment", "OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Order");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Pets")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.PetReport", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany("PetReports")
                        .HasForeignKey("AdoptionRequestId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.HasOne("PetHaven.Models.Category", "Category")
                        .WithMany("Products")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Products")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Category");
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.Rating", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Ratings")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.HasOne("PetHaven.Models.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Role");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("Vet")
                        .HasForeignKey("PetHaven.Models.Vet", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Wishlist", b =>
                {
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("Wishlists")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Wishlists")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Product");
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.Navigation("Appointments");
                    b.Navigation("Blacklists");
                    b.Navigation("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.Navigation("Blacklists");
                    b.Navigation("Pets");
                    b.Navigation("Products");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.Navigation("CartItems");
                });
            modelBuilder.Entity("PetHaven.Models.Category", b =>
                {
                    b.Navigation("Products");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.Navigation("OrderItems");
                    b.Navigation("Payment");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.Navigation("Appointments");
                    b.Navigation("Diagnoses");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.Navigation("CartItems");
                    b.Navigation("OrderItems");
                    b.Navigation("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Role", b =>
                {
                    b.Navigation("Users");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.Navigation("Adopter");
                    b.Navigation("AdoptionCenter");
                    b.Navigation("Carts");
                    b.Navigation("Diagnoses");
                    b.Navigation("Notifications");
                    b.Navigation("Orders");
                    b.Navigation("Ratings");
                    b.Navigation("Vet");
                    b.Navigation("Wishlists");
                });
#pragma warning restore 612, 618
        }
    }
}
```

## File: Migrations/20260701125852_AddScoringAndNotesToAdoption.cs
```csharp
using Microsoft.EntityFrameworkCore.Migrations;
#nullable disable
namespace PetHaven.Migrations
{
    public partial class AddScoringAndNotesToAdoption : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FreeHoursPerDay",
                table: "Adopters",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FreeHoursPerDay",
                table: "Adopters");
        }
    }
}
```

## File: Migrations/20260701125852_AddScoringAndNotesToAdoption.Designer.cs
```csharp
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PetHaven.Data;
#nullable disable
namespace PetHaven.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260701125852_AddScoringAndNotesToAdoption")]
    partial class AddScoringAndNotesToAdoption
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.28")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);
            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.Property<int>("AdopterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AdopterId"));
                    b.Property<string>("Address")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<decimal>("Balance")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<string>("ExperienceLevel")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("FreeHoursPerDay")
                        .HasColumnType("int");
                    b.Property<bool>("HasPetBefore")
                        .HasColumnType("bit");
                    b.Property<string>("HousingType")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<DateTime?>("LastReportDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("MissedReportsCount")
                        .HasColumnType("int");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("AdopterId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("Adopters");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.Property<int>("CenterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CenterId"));
                    b.Property<string>("Address")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("CenterName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("ContactInfo")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("CenterId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("AdoptionCenters");
                });
            modelBuilder.Entity("PetHaven.Models.Appointment", b =>
                {
                    b.Property<int>("AppointmentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AppointmentId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<DateTime>("AppointmentDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<string>("Reason")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("AppointmentId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("PetId");
                    b.ToTable("Appointments");
                });
            modelBuilder.Entity("PetHaven.Models.AppointmentRequest", b =>
                {
                    b.Property<int>("AppointmentRequestId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AppointmentRequestId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("HealthStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("Notes")
                        .HasColumnType("nvarchar(max)");
                    b.HasKey("AppointmentRequestId");
                    b.ToTable("AppointmentRequests");
                });
            modelBuilder.Entity("PetHaven.Models.Blacklist", b =>
                {
                    b.Property<int>("BlacklistId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("BlacklistId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<DateTime>("BlockedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<bool>("IsActive")
                        .HasColumnType("bit");
                    b.Property<string>("Reason")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.HasKey("BlacklistId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("CenterId");
                    b.ToTable("Blacklists");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.Property<int>("CartId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CartId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("CartId");
                    b.HasIndex("UserId");
                    b.ToTable("Carts");
                });
            modelBuilder.Entity("PetHaven.Models.CartItem", b =>
                {
                    b.Property<int>("CartItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CartItemId"));
                    b.Property<int>("CartId")
                        .HasColumnType("int");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("Quantity")
                        .HasColumnType("int");
                    b.HasKey("CartItemId");
                    b.HasIndex("CartId");
                    b.HasIndex("ProductId");
                    b.ToTable("CartItems");
                });
            modelBuilder.Entity("PetHaven.Models.Category", b =>
                {
                    b.Property<int>("CategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CategoryId"));
                    b.Property<string>("CategoryName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.HasKey("CategoryId");
                    b.ToTable("Categories");
                });
            modelBuilder.Entity("PetHaven.Models.Diagnosis", b =>
                {
                    b.Property<int>("DiagnosisId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("DiagnosisId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<string>("Result")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Symptoms")
                        .HasColumnType("nvarchar(max)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("DiagnosisId");
                    b.HasIndex("PetId");
                    b.HasIndex("UserId");
                    b.ToTable("Diagnoses");
                });
            modelBuilder.Entity("PetHaven.Models.Notification", b =>
                {
                    b.Property<int>("NotificationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("NotificationId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<bool>("IsRead")
                        .HasColumnType("bit");
                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("Type")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("NotificationId");
                    b.HasIndex("UserId");
                    b.ToTable("Notifications");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.Property<int>("OrderId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("OrderId"));
                    b.Property<DateTime>("OrderDate")
                        .HasColumnType("datetime2");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<decimal>("TotalPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("OrderId");
                    b.HasIndex("UserId");
                    b.ToTable("Orders");
                });
            modelBuilder.Entity("PetHaven.Models.OrderItem", b =>
                {
                    b.Property<int>("OrderItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("OrderItemId"));
                    b.Property<int>("OrderId")
                        .HasColumnType("int");
                    b.Property<decimal>("PriceAtPurchase")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("Quantity")
                        .HasColumnType("int");
                    b.Property<decimal>("UnitPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.HasKey("OrderItemId");
                    b.HasIndex("OrderId");
                    b.HasIndex("ProductId");
                    b.ToTable("OrderItems");
                });
            modelBuilder.Entity("PetHaven.Models.Payment", b =>
                {
                    b.Property<int>("PaymentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PaymentId"));
                    b.Property<decimal>("Amount")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("OrderId")
                        .HasColumnType("int");
                    b.Property<DateTime>("PaymentDate")
                        .HasColumnType("datetime2");
                    b.Property<string>("PaymentMethod")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("PaymentStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("PaymentId");
                    b.HasIndex("OrderId")
                        .IsUnique();
                    b.ToTable("Payments");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.Property<int>("PetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PetId"));
                    b.Property<int?>("Age")
                        .HasColumnType("int");
                    b.Property<string>("Breed")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Gender")
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");
                    b.Property<string>("HealthStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("PetName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<string>("Species")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("PetId");
                    b.HasIndex("CenterId");
                    b.ToTable("Pets");
                });
            modelBuilder.Entity("PetHaven.Models.PetReport", b =>
                {
                    b.Property<int>("ReportId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ReportId"));
                    b.Property<int>("AdoptionRequestId")
                        .HasColumnType("int");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("HealthStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("Notes")
                        .HasColumnType("nvarchar(max)");
                    b.HasKey("ReportId");
                    b.HasIndex("AdoptionRequestId");
                    b.ToTable("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.Property<int>("ProductId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ProductId"));
                    b.Property<int>("CategoryId")
                        .HasColumnType("int");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<decimal>("DiscountRate")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<decimal>("ProductPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("StockQuantity")
                        .HasColumnType("int");
                    b.HasKey("ProductId");
                    b.HasIndex("CategoryId");
                    b.HasIndex("CenterId");
                    b.ToTable("Products");
                });
            modelBuilder.Entity("PetHaven.Models.Rating", b =>
                {
                    b.Property<int>("RatingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RatingId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("ReviewText")
                        .HasColumnType("nvarchar(max)");
                    b.Property<int>("StarsCount")
                        .HasColumnType("int");
                    b.Property<int>("TargetId")
                        .HasColumnType("int");
                    b.Property<string>("TargetType")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("RatingId");
                    b.HasIndex("UserId");
                    b.ToTable("Ratings");
                });
            modelBuilder.Entity("PetHaven.Models.Role", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RoleId"));
                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.HasKey("RoleId");
                    b.ToTable("Roles");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserId"));
                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("RoleId")
                        .HasColumnType("int");
                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.HasKey("UserId");
                    b.HasIndex("RoleId");
                    b.ToTable("Users");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.Property<int>("VetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("VetId"));
                    b.Property<string>("ClinicAddress")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("ClinicName")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("Email")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<int?>("ExperienceYears")
                        .HasColumnType("int");
                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<bool>("IsVerified")
                        .HasColumnType("bit");
                    b.Property<string>("LicenseNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<decimal?>("Location_Lat")
                        .HasPrecision(18, 8)
                        .HasColumnType("decimal(18,8)");
                    b.Property<decimal?>("Location_Lng")
                        .HasPrecision(18, 8)
                        .HasColumnType("decimal(18,8)");
                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("Specialization")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("VetId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("Vets");
                });
            modelBuilder.Entity("PetHaven.Models.Wishlist", b =>
                {
                    b.Property<int>("WishlistId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("WishlistId"));
                    b.Property<DateTime>("AddedDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("WishlistId");
                    b.HasIndex("ProductId");
                    b.HasIndex("UserId");
                    b.ToTable("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("Adopter")
                        .HasForeignKey("PetHaven.Models.Adopter", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("AdoptionCenter")
                        .HasForeignKey("PetHaven.Models.AdoptionCenter", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Appointment", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany("Appointments")
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany("Appointments")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Pet");
                });
            modelBuilder.Entity("PetHaven.Models.Blacklist", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany("Blacklists")
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Blacklists")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Carts")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.CartItem", b =>
                {
                    b.HasOne("PetHaven.Models.Cart", "Cart")
                        .WithMany("CartItems")
                        .HasForeignKey("CartId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("CartItems")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Cart");
                    b.Navigation("Product");
                });
            modelBuilder.Entity("PetHaven.Models.Diagnosis", b =>
                {
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany("Diagnoses")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Diagnoses")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Pet");
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Notification", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Notifications")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Orders")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.OrderItem", b =>
                {
                    b.HasOne("PetHaven.Models.Order", "Order")
                        .WithMany("OrderItems")
                        .HasForeignKey("OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("OrderItems")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Order");
                    b.Navigation("Product");
                });
            modelBuilder.Entity("PetHaven.Models.Payment", b =>
                {
                    b.HasOne("PetHaven.Models.Order", "Order")
                        .WithOne("Payment")
                        .HasForeignKey("PetHaven.Models.Payment", "OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Order");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Pets")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.PetReport", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany("PetReports")
                        .HasForeignKey("AdoptionRequestId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.HasOne("PetHaven.Models.Category", "Category")
                        .WithMany("Products")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Products")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Category");
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.Rating", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Ratings")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.HasOne("PetHaven.Models.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Role");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("Vet")
                        .HasForeignKey("PetHaven.Models.Vet", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Wishlist", b =>
                {
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("Wishlists")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Wishlists")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Product");
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.Navigation("Appointments");
                    b.Navigation("Blacklists");
                    b.Navigation("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.Navigation("Blacklists");
                    b.Navigation("Pets");
                    b.Navigation("Products");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.Navigation("CartItems");
                });
            modelBuilder.Entity("PetHaven.Models.Category", b =>
                {
                    b.Navigation("Products");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.Navigation("OrderItems");
                    b.Navigation("Payment");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.Navigation("Appointments");
                    b.Navigation("Diagnoses");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.Navigation("CartItems");
                    b.Navigation("OrderItems");
                    b.Navigation("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Role", b =>
                {
                    b.Navigation("Users");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.Navigation("Adopter");
                    b.Navigation("AdoptionCenter");
                    b.Navigation("Carts");
                    b.Navigation("Diagnoses");
                    b.Navigation("Notifications");
                    b.Navigation("Orders");
                    b.Navigation("Ratings");
                    b.Navigation("Vet");
                    b.Navigation("Wishlists");
                });
#pragma warning restore 612, 618
        }
    }
}
```

## File: Migrations/20260701144125_FixAdoptionAndRemoveAppointmentRequest.cs
```csharp
using System;
using Microsoft.EntityFrameworkCore.Migrations;
#nullable disable
namespace PetHaven.Migrations
{
    public partial class FixAdoptionAndRemoveAppointmentRequest : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PetReports_Adopters_AdoptionRequestId",
                table: "PetReports");
            migrationBuilder.DropTable(
                name: "AppointmentRequests");
            migrationBuilder.AddColumn<int>(
                name: "AdopterId",
                table: "PetReports",
                type: "int",
                nullable: true);
            migrationBuilder.CreateTable(
                name: "AdoptionRequests",
                columns: table => new
                {
                    AdoptionRequestId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdopterId = table.Column<int>(type: "int", nullable: false),
                    PetId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Score = table.Column<int>(type: "int", nullable: false),
                    CenterNote = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdoptionRequests", x => x.AdoptionRequestId);
                    table.ForeignKey(
                        name: "FK_AdoptionRequests_Adopters_AdopterId",
                        column: x => x.AdopterId,
                        principalTable: "Adopters",
                        principalColumn: "AdopterId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AdoptionRequests_Pets_PetId",
                        column: x => x.PetId,
                        principalTable: "Pets",
                        principalColumn: "PetId",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.CreateIndex(
                name: "IX_PetReports_AdopterId",
                table: "PetReports",
                column: "AdopterId");
            migrationBuilder.CreateIndex(
                name: "IX_AdoptionRequests_AdopterId",
                table: "AdoptionRequests",
                column: "AdopterId");
            migrationBuilder.CreateIndex(
                name: "IX_AdoptionRequests_PetId",
                table: "AdoptionRequests",
                column: "PetId");
            migrationBuilder.AddForeignKey(
                name: "FK_PetReports_Adopters_AdopterId",
                table: "PetReports",
                column: "AdopterId",
                principalTable: "Adopters",
                principalColumn: "AdopterId");
            migrationBuilder.AddForeignKey(
                name: "FK_PetReports_AdoptionRequests_AdoptionRequestId",
                table: "PetReports",
                column: "AdoptionRequestId",
                principalTable: "AdoptionRequests",
                principalColumn: "AdoptionRequestId",
                onDelete: ReferentialAction.Cascade);
        }
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PetReports_Adopters_AdopterId",
                table: "PetReports");
            migrationBuilder.DropForeignKey(
                name: "FK_PetReports_AdoptionRequests_AdoptionRequestId",
                table: "PetReports");
            migrationBuilder.DropTable(
                name: "AdoptionRequests");
            migrationBuilder.DropIndex(
                name: "IX_PetReports_AdopterId",
                table: "PetReports");
            migrationBuilder.DropColumn(
                name: "AdopterId",
                table: "PetReports");
            migrationBuilder.CreateTable(
                name: "AppointmentRequests",
                columns: table => new
                {
                    AppointmentRequestId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HealthStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ImageURL = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentRequests", x => x.AppointmentRequestId);
                });
            migrationBuilder.AddForeignKey(
                name: "FK_PetReports_Adopters_AdoptionRequestId",
                table: "PetReports",
                column: "AdoptionRequestId",
                principalTable: "Adopters",
                principalColumn: "AdopterId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
```

## File: Migrations/20260701144125_FixAdoptionAndRemoveAppointmentRequest.Designer.cs
```csharp
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PetHaven.Data;
#nullable disable
namespace PetHaven.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260701144125_FixAdoptionAndRemoveAppointmentRequest")]
    partial class FixAdoptionAndRemoveAppointmentRequest
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.28")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);
            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.Property<int>("AdopterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AdopterId"));
                    b.Property<string>("Address")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<decimal>("Balance")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<string>("ExperienceLevel")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("FreeHoursPerDay")
                        .HasColumnType("int");
                    b.Property<bool>("HasPetBefore")
                        .HasColumnType("bit");
                    b.Property<string>("HousingType")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<DateTime?>("LastReportDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("MissedReportsCount")
                        .HasColumnType("int");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("AdopterId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("Adopters");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.Property<int>("CenterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CenterId"));
                    b.Property<string>("Address")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("CenterName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("ContactInfo")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("CenterId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("AdoptionCenters");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionRequest", b =>
                {
                    b.Property<int>("AdoptionRequestId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AdoptionRequestId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<string>("CenterNote")
                        .HasColumnType("nvarchar(max)");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<int>("Score")
                        .HasColumnType("int");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("AdoptionRequestId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("PetId");
                    b.ToTable("AdoptionRequests");
                });
            modelBuilder.Entity("PetHaven.Models.Appointment", b =>
                {
                    b.Property<int>("AppointmentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AppointmentId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<DateTime>("AppointmentDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<string>("Reason")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("AppointmentId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("PetId");
                    b.ToTable("Appointments");
                });
            modelBuilder.Entity("PetHaven.Models.Blacklist", b =>
                {
                    b.Property<int>("BlacklistId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("BlacklistId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<DateTime>("BlockedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<bool>("IsActive")
                        .HasColumnType("bit");
                    b.Property<string>("Reason")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.HasKey("BlacklistId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("CenterId");
                    b.ToTable("Blacklists");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.Property<int>("CartId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CartId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("CartId");
                    b.HasIndex("UserId");
                    b.ToTable("Carts");
                });
            modelBuilder.Entity("PetHaven.Models.CartItem", b =>
                {
                    b.Property<int>("CartItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CartItemId"));
                    b.Property<int>("CartId")
                        .HasColumnType("int");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("Quantity")
                        .HasColumnType("int");
                    b.HasKey("CartItemId");
                    b.HasIndex("CartId");
                    b.HasIndex("ProductId");
                    b.ToTable("CartItems");
                });
            modelBuilder.Entity("PetHaven.Models.Category", b =>
                {
                    b.Property<int>("CategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CategoryId"));
                    b.Property<string>("CategoryName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.HasKey("CategoryId");
                    b.ToTable("Categories");
                });
            modelBuilder.Entity("PetHaven.Models.Diagnosis", b =>
                {
                    b.Property<int>("DiagnosisId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("DiagnosisId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<string>("Result")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Symptoms")
                        .HasColumnType("nvarchar(max)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("DiagnosisId");
                    b.HasIndex("PetId");
                    b.HasIndex("UserId");
                    b.ToTable("Diagnoses");
                });
            modelBuilder.Entity("PetHaven.Models.Notification", b =>
                {
                    b.Property<int>("NotificationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("NotificationId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<bool>("IsRead")
                        .HasColumnType("bit");
                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("Type")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("NotificationId");
                    b.HasIndex("UserId");
                    b.ToTable("Notifications");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.Property<int>("OrderId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("OrderId"));
                    b.Property<DateTime>("OrderDate")
                        .HasColumnType("datetime2");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<decimal>("TotalPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("OrderId");
                    b.HasIndex("UserId");
                    b.ToTable("Orders");
                });
            modelBuilder.Entity("PetHaven.Models.OrderItem", b =>
                {
                    b.Property<int>("OrderItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("OrderItemId"));
                    b.Property<int>("OrderId")
                        .HasColumnType("int");
                    b.Property<decimal>("PriceAtPurchase")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("Quantity")
                        .HasColumnType("int");
                    b.Property<decimal>("UnitPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.HasKey("OrderItemId");
                    b.HasIndex("OrderId");
                    b.HasIndex("ProductId");
                    b.ToTable("OrderItems");
                });
            modelBuilder.Entity("PetHaven.Models.Payment", b =>
                {
                    b.Property<int>("PaymentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PaymentId"));
                    b.Property<decimal>("Amount")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("OrderId")
                        .HasColumnType("int");
                    b.Property<DateTime>("PaymentDate")
                        .HasColumnType("datetime2");
                    b.Property<string>("PaymentMethod")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("PaymentStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("PaymentId");
                    b.HasIndex("OrderId")
                        .IsUnique();
                    b.ToTable("Payments");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.Property<int>("PetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PetId"));
                    b.Property<int?>("Age")
                        .HasColumnType("int");
                    b.Property<string>("Breed")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Gender")
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");
                    b.Property<string>("HealthStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("PetName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<string>("Species")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("PetId");
                    b.HasIndex("CenterId");
                    b.ToTable("Pets");
                });
            modelBuilder.Entity("PetHaven.Models.PetReport", b =>
                {
                    b.Property<int>("ReportId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ReportId"));
                    b.Property<int?>("AdopterId")
                        .HasColumnType("int");
                    b.Property<int>("AdoptionRequestId")
                        .HasColumnType("int");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("HealthStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("Notes")
                        .HasColumnType("nvarchar(max)");
                    b.HasKey("ReportId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("AdoptionRequestId");
                    b.ToTable("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.Property<int>("ProductId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ProductId"));
                    b.Property<int>("CategoryId")
                        .HasColumnType("int");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<decimal>("DiscountRate")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<decimal>("ProductPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("StockQuantity")
                        .HasColumnType("int");
                    b.HasKey("ProductId");
                    b.HasIndex("CategoryId");
                    b.HasIndex("CenterId");
                    b.ToTable("Products");
                });
            modelBuilder.Entity("PetHaven.Models.Rating", b =>
                {
                    b.Property<int>("RatingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RatingId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("ReviewText")
                        .HasColumnType("nvarchar(max)");
                    b.Property<int>("StarsCount")
                        .HasColumnType("int");
                    b.Property<int>("TargetId")
                        .HasColumnType("int");
                    b.Property<string>("TargetType")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("RatingId");
                    b.HasIndex("UserId");
                    b.ToTable("Ratings");
                });
            modelBuilder.Entity("PetHaven.Models.Role", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RoleId"));
                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.HasKey("RoleId");
                    b.ToTable("Roles");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserId"));
                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("RoleId")
                        .HasColumnType("int");
                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.HasKey("UserId");
                    b.HasIndex("RoleId");
                    b.ToTable("Users");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.Property<int>("VetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("VetId"));
                    b.Property<string>("ClinicAddress")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("ClinicName")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("Email")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<int?>("ExperienceYears")
                        .HasColumnType("int");
                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<bool>("IsVerified")
                        .HasColumnType("bit");
                    b.Property<string>("LicenseNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<decimal?>("Location_Lat")
                        .HasPrecision(18, 8)
                        .HasColumnType("decimal(18,8)");
                    b.Property<decimal?>("Location_Lng")
                        .HasPrecision(18, 8)
                        .HasColumnType("decimal(18,8)");
                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("Specialization")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("VetId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("Vets");
                });
            modelBuilder.Entity("PetHaven.Models.Wishlist", b =>
                {
                    b.Property<int>("WishlistId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("WishlistId"));
                    b.Property<DateTime>("AddedDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("WishlistId");
                    b.HasIndex("ProductId");
                    b.HasIndex("UserId");
                    b.ToTable("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("Adopter")
                        .HasForeignKey("PetHaven.Models.Adopter", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("AdoptionCenter")
                        .HasForeignKey("PetHaven.Models.AdoptionCenter", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionRequest", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany()
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany()
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Pet");
                });
            modelBuilder.Entity("PetHaven.Models.Appointment", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany("Appointments")
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany("Appointments")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Pet");
                });
            modelBuilder.Entity("PetHaven.Models.Blacklist", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany("Blacklists")
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Blacklists")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Carts")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.CartItem", b =>
                {
                    b.HasOne("PetHaven.Models.Cart", "Cart")
                        .WithMany("CartItems")
                        .HasForeignKey("CartId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("CartItems")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Cart");
                    b.Navigation("Product");
                });
            modelBuilder.Entity("PetHaven.Models.Diagnosis", b =>
                {
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany("Diagnoses")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Diagnoses")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Pet");
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Notification", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Notifications")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Orders")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.OrderItem", b =>
                {
                    b.HasOne("PetHaven.Models.Order", "Order")
                        .WithMany("OrderItems")
                        .HasForeignKey("OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("OrderItems")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Order");
                    b.Navigation("Product");
                });
            modelBuilder.Entity("PetHaven.Models.Payment", b =>
                {
                    b.HasOne("PetHaven.Models.Order", "Order")
                        .WithOne("Payment")
                        .HasForeignKey("PetHaven.Models.Payment", "OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Order");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Pets")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.PetReport", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", null)
                        .WithMany("PetReports")
                        .HasForeignKey("AdopterId");
                    b.HasOne("PetHaven.Models.AdoptionRequest", "AdoptionRequest")
                        .WithMany("PetReports")
                        .HasForeignKey("AdoptionRequestId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("AdoptionRequest");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.HasOne("PetHaven.Models.Category", "Category")
                        .WithMany("Products")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Products")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Category");
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.Rating", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Ratings")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.HasOne("PetHaven.Models.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Role");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("Vet")
                        .HasForeignKey("PetHaven.Models.Vet", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Wishlist", b =>
                {
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("Wishlists")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Wishlists")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Product");
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.Navigation("Appointments");
                    b.Navigation("Blacklists");
                    b.Navigation("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.Navigation("Blacklists");
                    b.Navigation("Pets");
                    b.Navigation("Products");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionRequest", b =>
                {
                    b.Navigation("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.Navigation("CartItems");
                });
            modelBuilder.Entity("PetHaven.Models.Category", b =>
                {
                    b.Navigation("Products");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.Navigation("OrderItems");
                    b.Navigation("Payment");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.Navigation("Appointments");
                    b.Navigation("Diagnoses");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.Navigation("CartItems");
                    b.Navigation("OrderItems");
                    b.Navigation("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Role", b =>
                {
                    b.Navigation("Users");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.Navigation("Adopter");
                    b.Navigation("AdoptionCenter");
                    b.Navigation("Carts");
                    b.Navigation("Diagnoses");
                    b.Navigation("Notifications");
                    b.Navigation("Orders");
                    b.Navigation("Ratings");
                    b.Navigation("Vet");
                    b.Navigation("Wishlists");
                });
#pragma warning restore 612, 618
        }
    }
}
```

## File: Migrations/20260717045016_add_vetIdToAppointment.cs
```csharp
using Microsoft.EntityFrameworkCore.Migrations;
#nullable disable
namespace PetHaven.Migrations
{
    public partial class add_vetIdToAppointment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "VetId",
                table: "Appointments",
                type: "int",
                nullable: false,
                defaultValue: 0);
            migrationBuilder.CreateIndex(
                name: "IX_Appointments_VetId",
                table: "Appointments",
                column: "VetId");
            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Vets_VetId",
                table: "Appointments",
                column: "VetId",
                principalTable: "Vets",
                principalColumn: "VetId",
                onDelete: ReferentialAction.Restrict);
        }
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Vets_VetId",
                table: "Appointments");
            migrationBuilder.DropIndex(
                name: "IX_Appointments_VetId",
                table: "Appointments");
            migrationBuilder.DropColumn(
                name: "VetId",
                table: "Appointments");
        }
    }
}
```

## File: Migrations/20260717045016_add_vetIdToAppointment.Designer.cs
```csharp
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PetHaven.Data;
#nullable disable
namespace PetHaven.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260717045016_add_vetIdToAppointment")]
    partial class add_vetIdToAppointment
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.28")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);
            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.Property<int>("AdopterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AdopterId"));
                    b.Property<string>("Address")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<decimal>("Balance")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<string>("ExperienceLevel")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("FreeHoursPerDay")
                        .HasColumnType("int");
                    b.Property<bool>("HasPetBefore")
                        .HasColumnType("bit");
                    b.Property<string>("HousingType")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<DateTime?>("LastReportDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("MissedReportsCount")
                        .HasColumnType("int");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("AdopterId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("Adopters");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.Property<int>("CenterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CenterId"));
                    b.Property<string>("Address")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("CenterName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("ContactInfo")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("CenterId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("AdoptionCenters");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionRequest", b =>
                {
                    b.Property<int>("AdoptionRequestId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AdoptionRequestId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<string>("CenterNote")
                        .HasColumnType("nvarchar(max)");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<int>("Score")
                        .HasColumnType("int");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("AdoptionRequestId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("PetId");
                    b.ToTable("AdoptionRequests");
                });
            modelBuilder.Entity("PetHaven.Models.Appointment", b =>
                {
                    b.Property<int>("AppointmentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AppointmentId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<DateTime>("AppointmentDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<string>("Reason")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("VetId")
                        .HasColumnType("int");
                    b.HasKey("AppointmentId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("PetId");
                    b.HasIndex("VetId");
                    b.ToTable("Appointments");
                });
            modelBuilder.Entity("PetHaven.Models.Blacklist", b =>
                {
                    b.Property<int>("BlacklistId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("BlacklistId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<DateTime>("BlockedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<bool>("IsActive")
                        .HasColumnType("bit");
                    b.Property<string>("Reason")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.HasKey("BlacklistId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("CenterId");
                    b.ToTable("Blacklists");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.Property<int>("CartId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CartId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("CartId");
                    b.HasIndex("UserId");
                    b.ToTable("Carts");
                });
            modelBuilder.Entity("PetHaven.Models.CartItem", b =>
                {
                    b.Property<int>("CartItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CartItemId"));
                    b.Property<int>("CartId")
                        .HasColumnType("int");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("Quantity")
                        .HasColumnType("int");
                    b.HasKey("CartItemId");
                    b.HasIndex("CartId");
                    b.HasIndex("ProductId");
                    b.ToTable("CartItems");
                });
            modelBuilder.Entity("PetHaven.Models.Category", b =>
                {
                    b.Property<int>("CategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CategoryId"));
                    b.Property<string>("CategoryName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.HasKey("CategoryId");
                    b.ToTable("Categories");
                });
            modelBuilder.Entity("PetHaven.Models.Diagnosis", b =>
                {
                    b.Property<int>("DiagnosisId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("DiagnosisId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<string>("Result")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Symptoms")
                        .HasColumnType("nvarchar(max)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("DiagnosisId");
                    b.HasIndex("PetId");
                    b.HasIndex("UserId");
                    b.ToTable("Diagnoses");
                });
            modelBuilder.Entity("PetHaven.Models.Notification", b =>
                {
                    b.Property<int>("NotificationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("NotificationId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<bool>("IsRead")
                        .HasColumnType("bit");
                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("Type")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("NotificationId");
                    b.HasIndex("UserId");
                    b.ToTable("Notifications");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.Property<int>("OrderId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("OrderId"));
                    b.Property<DateTime>("OrderDate")
                        .HasColumnType("datetime2");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<decimal>("TotalPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("OrderId");
                    b.HasIndex("UserId");
                    b.ToTable("Orders");
                });
            modelBuilder.Entity("PetHaven.Models.OrderItem", b =>
                {
                    b.Property<int>("OrderItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("OrderItemId"));
                    b.Property<int>("OrderId")
                        .HasColumnType("int");
                    b.Property<decimal>("PriceAtPurchase")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("Quantity")
                        .HasColumnType("int");
                    b.Property<decimal>("UnitPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.HasKey("OrderItemId");
                    b.HasIndex("OrderId");
                    b.HasIndex("ProductId");
                    b.ToTable("OrderItems");
                });
            modelBuilder.Entity("PetHaven.Models.Payment", b =>
                {
                    b.Property<int>("PaymentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PaymentId"));
                    b.Property<decimal>("Amount")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("OrderId")
                        .HasColumnType("int");
                    b.Property<DateTime>("PaymentDate")
                        .HasColumnType("datetime2");
                    b.Property<string>("PaymentMethod")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("PaymentStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("PaymentId");
                    b.HasIndex("OrderId")
                        .IsUnique();
                    b.ToTable("Payments");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.Property<int>("PetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PetId"));
                    b.Property<int?>("Age")
                        .HasColumnType("int");
                    b.Property<string>("Breed")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Gender")
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");
                    b.Property<string>("HealthStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("PetName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<string>("Species")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("PetId");
                    b.HasIndex("CenterId");
                    b.ToTable("Pets");
                });
            modelBuilder.Entity("PetHaven.Models.PetReport", b =>
                {
                    b.Property<int>("ReportId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ReportId"));
                    b.Property<int?>("AdopterId")
                        .HasColumnType("int");
                    b.Property<int>("AdoptionRequestId")
                        .HasColumnType("int");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("HealthStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("Notes")
                        .HasColumnType("nvarchar(max)");
                    b.HasKey("ReportId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("AdoptionRequestId");
                    b.ToTable("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.Property<int>("ProductId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ProductId"));
                    b.Property<int>("CategoryId")
                        .HasColumnType("int");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<decimal>("DiscountRate")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<decimal>("ProductPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("StockQuantity")
                        .HasColumnType("int");
                    b.HasKey("ProductId");
                    b.HasIndex("CategoryId");
                    b.HasIndex("CenterId");
                    b.ToTable("Products");
                });
            modelBuilder.Entity("PetHaven.Models.Rating", b =>
                {
                    b.Property<int>("RatingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RatingId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("ReviewText")
                        .HasColumnType("nvarchar(max)");
                    b.Property<int>("StarsCount")
                        .HasColumnType("int");
                    b.Property<int>("TargetId")
                        .HasColumnType("int");
                    b.Property<string>("TargetType")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("RatingId");
                    b.HasIndex("UserId");
                    b.ToTable("Ratings");
                });
            modelBuilder.Entity("PetHaven.Models.Role", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RoleId"));
                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.HasKey("RoleId");
                    b.ToTable("Roles");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserId"));
                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("RoleId")
                        .HasColumnType("int");
                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.HasKey("UserId");
                    b.HasIndex("RoleId");
                    b.ToTable("Users");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.Property<int>("VetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("VetId"));
                    b.Property<string>("ClinicAddress")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("ClinicName")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("Email")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<int?>("ExperienceYears")
                        .HasColumnType("int");
                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<bool>("IsVerified")
                        .HasColumnType("bit");
                    b.Property<string>("LicenseNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<decimal?>("Location_Lat")
                        .HasPrecision(18, 8)
                        .HasColumnType("decimal(18,8)");
                    b.Property<decimal?>("Location_Lng")
                        .HasPrecision(18, 8)
                        .HasColumnType("decimal(18,8)");
                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("Specialization")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("VetId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("Vets");
                });
            modelBuilder.Entity("PetHaven.Models.Wishlist", b =>
                {
                    b.Property<int>("WishlistId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("WishlistId"));
                    b.Property<DateTime>("AddedDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("WishlistId");
                    b.HasIndex("ProductId");
                    b.HasIndex("UserId");
                    b.ToTable("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("Adopter")
                        .HasForeignKey("PetHaven.Models.Adopter", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("AdoptionCenter")
                        .HasForeignKey("PetHaven.Models.AdoptionCenter", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionRequest", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany()
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany()
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Pet");
                });
            modelBuilder.Entity("PetHaven.Models.Appointment", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany("Appointments")
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany("Appointments")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Vet", "Vet")
                        .WithMany("Appointments")
                        .HasForeignKey("VetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Pet");
                    b.Navigation("Vet");
                });
            modelBuilder.Entity("PetHaven.Models.Blacklist", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany("Blacklists")
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Blacklists")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Carts")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.CartItem", b =>
                {
                    b.HasOne("PetHaven.Models.Cart", "Cart")
                        .WithMany("CartItems")
                        .HasForeignKey("CartId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("CartItems")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Cart");
                    b.Navigation("Product");
                });
            modelBuilder.Entity("PetHaven.Models.Diagnosis", b =>
                {
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany("Diagnoses")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Diagnoses")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Pet");
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Notification", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Notifications")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Orders")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.OrderItem", b =>
                {
                    b.HasOne("PetHaven.Models.Order", "Order")
                        .WithMany("OrderItems")
                        .HasForeignKey("OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("OrderItems")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Order");
                    b.Navigation("Product");
                });
            modelBuilder.Entity("PetHaven.Models.Payment", b =>
                {
                    b.HasOne("PetHaven.Models.Order", "Order")
                        .WithOne("Payment")
                        .HasForeignKey("PetHaven.Models.Payment", "OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Order");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Pets")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.PetReport", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", null)
                        .WithMany("PetReports")
                        .HasForeignKey("AdopterId");
                    b.HasOne("PetHaven.Models.AdoptionRequest", "AdoptionRequest")
                        .WithMany("PetReports")
                        .HasForeignKey("AdoptionRequestId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("AdoptionRequest");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.HasOne("PetHaven.Models.Category", "Category")
                        .WithMany("Products")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Products")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Category");
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.Rating", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Ratings")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.HasOne("PetHaven.Models.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Role");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("Vet")
                        .HasForeignKey("PetHaven.Models.Vet", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Wishlist", b =>
                {
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("Wishlists")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Wishlists")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Product");
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.Navigation("Appointments");
                    b.Navigation("Blacklists");
                    b.Navigation("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.Navigation("Blacklists");
                    b.Navigation("Pets");
                    b.Navigation("Products");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionRequest", b =>
                {
                    b.Navigation("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.Navigation("CartItems");
                });
            modelBuilder.Entity("PetHaven.Models.Category", b =>
                {
                    b.Navigation("Products");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.Navigation("OrderItems");
                    b.Navigation("Payment");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.Navigation("Appointments");
                    b.Navigation("Diagnoses");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.Navigation("CartItems");
                    b.Navigation("OrderItems");
                    b.Navigation("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Role", b =>
                {
                    b.Navigation("Users");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.Navigation("Adopter");
                    b.Navigation("AdoptionCenter");
                    b.Navigation("Carts");
                    b.Navigation("Diagnoses");
                    b.Navigation("Notifications");
                    b.Navigation("Orders");
                    b.Navigation("Ratings");
                    b.Navigation("Vet");
                    b.Navigation("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.Navigation("Appointments");
                });
#pragma warning restore 612, 618
        }
    }
}
```

## File: Migrations/20260814094117_AddProfileImageUrlToUser.cs
```csharp
using Microsoft.EntityFrameworkCore.Migrations;
#nullable disable
namespace PetHaven.Migrations
{
    public partial class AddProfileImageUrlToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfileImageUrl",
                table: "Users",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);
        }
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfileImageUrl",
                table: "Users");
        }
    }
}
```

## File: Migrations/20260814094117_AddProfileImageUrlToUser.Designer.cs
```csharp
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PetHaven.Data;
#nullable disable
namespace PetHaven.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260814094117_AddProfileImageUrlToUser")]
    partial class AddProfileImageUrlToUser
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.28")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);
            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.Property<int>("AdopterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AdopterId"));
                    b.Property<string>("Address")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<decimal>("Balance")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<string>("ExperienceLevel")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("FreeHoursPerDay")
                        .HasColumnType("int");
                    b.Property<bool>("HasPetBefore")
                        .HasColumnType("bit");
                    b.Property<string>("HousingType")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<DateTime?>("LastReportDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("MissedReportsCount")
                        .HasColumnType("int");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("AdopterId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("Adopters");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.Property<int>("CenterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CenterId"));
                    b.Property<string>("Address")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("CenterName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("ContactInfo")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("CenterId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("AdoptionCenters");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionRequest", b =>
                {
                    b.Property<int>("AdoptionRequestId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AdoptionRequestId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<string>("CenterNote")
                        .HasColumnType("nvarchar(max)");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<int>("Score")
                        .HasColumnType("int");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("AdoptionRequestId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("PetId");
                    b.ToTable("AdoptionRequests");
                });
            modelBuilder.Entity("PetHaven.Models.Appointment", b =>
                {
                    b.Property<int>("AppointmentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AppointmentId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<DateTime>("AppointmentDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<string>("Reason")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("VetId")
                        .HasColumnType("int");
                    b.HasKey("AppointmentId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("PetId");
                    b.HasIndex("VetId");
                    b.ToTable("Appointments");
                });
            modelBuilder.Entity("PetHaven.Models.Blacklist", b =>
                {
                    b.Property<int>("BlacklistId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("BlacklistId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<DateTime>("BlockedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<bool>("IsActive")
                        .HasColumnType("bit");
                    b.Property<string>("Reason")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.HasKey("BlacklistId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("CenterId");
                    b.ToTable("Blacklists");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.Property<int>("CartId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CartId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("CartId");
                    b.HasIndex("UserId");
                    b.ToTable("Carts");
                });
            modelBuilder.Entity("PetHaven.Models.CartItem", b =>
                {
                    b.Property<int>("CartItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CartItemId"));
                    b.Property<int>("CartId")
                        .HasColumnType("int");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("Quantity")
                        .HasColumnType("int");
                    b.HasKey("CartItemId");
                    b.HasIndex("CartId");
                    b.HasIndex("ProductId");
                    b.ToTable("CartItems");
                });
            modelBuilder.Entity("PetHaven.Models.Category", b =>
                {
                    b.Property<int>("CategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CategoryId"));
                    b.Property<string>("CategoryName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.HasKey("CategoryId");
                    b.ToTable("Categories");
                });
            modelBuilder.Entity("PetHaven.Models.Diagnosis", b =>
                {
                    b.Property<int>("DiagnosisId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("DiagnosisId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<string>("Result")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Symptoms")
                        .HasColumnType("nvarchar(max)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("DiagnosisId");
                    b.HasIndex("PetId");
                    b.HasIndex("UserId");
                    b.ToTable("Diagnoses");
                });
            modelBuilder.Entity("PetHaven.Models.Notification", b =>
                {
                    b.Property<int>("NotificationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("NotificationId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<bool>("IsRead")
                        .HasColumnType("bit");
                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("Type")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("NotificationId");
                    b.HasIndex("UserId");
                    b.ToTable("Notifications");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.Property<int>("OrderId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("OrderId"));
                    b.Property<DateTime>("OrderDate")
                        .HasColumnType("datetime2");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<decimal>("TotalPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("OrderId");
                    b.HasIndex("UserId");
                    b.ToTable("Orders");
                });
            modelBuilder.Entity("PetHaven.Models.OrderItem", b =>
                {
                    b.Property<int>("OrderItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("OrderItemId"));
                    b.Property<int>("OrderId")
                        .HasColumnType("int");
                    b.Property<decimal>("PriceAtPurchase")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("Quantity")
                        .HasColumnType("int");
                    b.Property<decimal>("UnitPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.HasKey("OrderItemId");
                    b.HasIndex("OrderId");
                    b.HasIndex("ProductId");
                    b.ToTable("OrderItems");
                });
            modelBuilder.Entity("PetHaven.Models.Payment", b =>
                {
                    b.Property<int>("PaymentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PaymentId"));
                    b.Property<decimal>("Amount")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("OrderId")
                        .HasColumnType("int");
                    b.Property<DateTime>("PaymentDate")
                        .HasColumnType("datetime2");
                    b.Property<string>("PaymentMethod")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("PaymentStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("PaymentId");
                    b.HasIndex("OrderId")
                        .IsUnique();
                    b.ToTable("Payments");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.Property<int>("PetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PetId"));
                    b.Property<int?>("Age")
                        .HasColumnType("int");
                    b.Property<string>("Breed")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Gender")
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");
                    b.Property<string>("HealthStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("PetName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<string>("Species")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("PetId");
                    b.HasIndex("CenterId");
                    b.ToTable("Pets");
                });
            modelBuilder.Entity("PetHaven.Models.PetReport", b =>
                {
                    b.Property<int>("ReportId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ReportId"));
                    b.Property<int?>("AdopterId")
                        .HasColumnType("int");
                    b.Property<int>("AdoptionRequestId")
                        .HasColumnType("int");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("HealthStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("Notes")
                        .HasColumnType("nvarchar(max)");
                    b.HasKey("ReportId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("AdoptionRequestId");
                    b.ToTable("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.Property<int>("ProductId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ProductId"));
                    b.Property<int>("CategoryId")
                        .HasColumnType("int");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<decimal>("DiscountRate")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<decimal>("ProductPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("StockQuantity")
                        .HasColumnType("int");
                    b.HasKey("ProductId");
                    b.HasIndex("CategoryId");
                    b.HasIndex("CenterId");
                    b.ToTable("Products");
                });
            modelBuilder.Entity("PetHaven.Models.Rating", b =>
                {
                    b.Property<int>("RatingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RatingId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("ReviewText")
                        .HasColumnType("nvarchar(max)");
                    b.Property<int>("StarsCount")
                        .HasColumnType("int");
                    b.Property<int>("TargetId")
                        .HasColumnType("int");
                    b.Property<string>("TargetType")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("RatingId");
                    b.HasIndex("UserId");
                    b.ToTable("Ratings");
                });
            modelBuilder.Entity("PetHaven.Models.Role", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RoleId"));
                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.HasKey("RoleId");
                    b.ToTable("Roles");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserId"));
                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("ProfileImageUrl")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<int>("RoleId")
                        .HasColumnType("int");
                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.HasKey("UserId");
                    b.HasIndex("RoleId");
                    b.ToTable("Users");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.Property<int>("VetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("VetId"));
                    b.Property<string>("ClinicAddress")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("ClinicName")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("Email")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<int?>("ExperienceYears")
                        .HasColumnType("int");
                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<bool>("IsVerified")
                        .HasColumnType("bit");
                    b.Property<string>("LicenseNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<decimal?>("Location_Lat")
                        .HasPrecision(18, 8)
                        .HasColumnType("decimal(18,8)");
                    b.Property<decimal?>("Location_Lng")
                        .HasPrecision(18, 8)
                        .HasColumnType("decimal(18,8)");
                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("Specialization")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("VetId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("Vets");
                });
            modelBuilder.Entity("PetHaven.Models.Wishlist", b =>
                {
                    b.Property<int>("WishlistId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("WishlistId"));
                    b.Property<DateTime>("AddedDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("WishlistId");
                    b.HasIndex("ProductId");
                    b.HasIndex("UserId");
                    b.ToTable("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("Adopter")
                        .HasForeignKey("PetHaven.Models.Adopter", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("AdoptionCenter")
                        .HasForeignKey("PetHaven.Models.AdoptionCenter", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionRequest", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany()
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany()
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Pet");
                });
            modelBuilder.Entity("PetHaven.Models.Appointment", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany("Appointments")
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany("Appointments")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Vet", "Vet")
                        .WithMany("Appointments")
                        .HasForeignKey("VetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Pet");
                    b.Navigation("Vet");
                });
            modelBuilder.Entity("PetHaven.Models.Blacklist", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany("Blacklists")
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Blacklists")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Carts")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.CartItem", b =>
                {
                    b.HasOne("PetHaven.Models.Cart", "Cart")
                        .WithMany("CartItems")
                        .HasForeignKey("CartId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("CartItems")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Cart");
                    b.Navigation("Product");
                });
            modelBuilder.Entity("PetHaven.Models.Diagnosis", b =>
                {
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany("Diagnoses")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Diagnoses")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Pet");
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Notification", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Notifications")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Orders")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.OrderItem", b =>
                {
                    b.HasOne("PetHaven.Models.Order", "Order")
                        .WithMany("OrderItems")
                        .HasForeignKey("OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("OrderItems")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Order");
                    b.Navigation("Product");
                });
            modelBuilder.Entity("PetHaven.Models.Payment", b =>
                {
                    b.HasOne("PetHaven.Models.Order", "Order")
                        .WithOne("Payment")
                        .HasForeignKey("PetHaven.Models.Payment", "OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Order");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Pets")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.PetReport", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", null)
                        .WithMany("PetReports")
                        .HasForeignKey("AdopterId");
                    b.HasOne("PetHaven.Models.AdoptionRequest", "AdoptionRequest")
                        .WithMany("PetReports")
                        .HasForeignKey("AdoptionRequestId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("AdoptionRequest");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.HasOne("PetHaven.Models.Category", "Category")
                        .WithMany("Products")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Products")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Category");
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.Rating", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Ratings")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.HasOne("PetHaven.Models.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Role");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("Vet")
                        .HasForeignKey("PetHaven.Models.Vet", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Wishlist", b =>
                {
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("Wishlists")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Wishlists")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Product");
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.Navigation("Appointments");
                    b.Navigation("Blacklists");
                    b.Navigation("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.Navigation("Blacklists");
                    b.Navigation("Pets");
                    b.Navigation("Products");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionRequest", b =>
                {
                    b.Navigation("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.Navigation("CartItems");
                });
            modelBuilder.Entity("PetHaven.Models.Category", b =>
                {
                    b.Navigation("Products");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.Navigation("OrderItems");
                    b.Navigation("Payment");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.Navigation("Appointments");
                    b.Navigation("Diagnoses");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.Navigation("CartItems");
                    b.Navigation("OrderItems");
                    b.Navigation("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Role", b =>
                {
                    b.Navigation("Users");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.Navigation("Adopter");
                    b.Navigation("AdoptionCenter");
                    b.Navigation("Carts");
                    b.Navigation("Diagnoses");
                    b.Navigation("Notifications");
                    b.Navigation("Orders");
                    b.Navigation("Ratings");
                    b.Navigation("Vet");
                    b.Navigation("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.Navigation("Appointments");
                });
#pragma warning restore 612, 618
        }
    }
}
```

## File: Migrations/20260814123755_AddVaccinations.cs
```csharp
using System;
using Microsoft.EntityFrameworkCore.Migrations;
#nullable disable
namespace PetHaven.Migrations
{
    public partial class AddVaccinations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Vaccinations",
                columns: table => new
                {
                    VaccinationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PetId = table.Column<int>(type: "int", nullable: false),
                    VaccineName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    VaccinationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NextDueDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vaccinations", x => x.VaccinationId);
                    table.ForeignKey(
                        name: "FK_Vaccinations_Pets_PetId",
                        column: x => x.PetId,
                        principalTable: "Pets",
                        principalColumn: "PetId",
                        onDelete: ReferentialAction.Cascade);
                });
            migrationBuilder.CreateIndex(
                name: "IX_Vaccinations_PetId",
                table: "Vaccinations",
                column: "PetId");
        }
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Vaccinations");
        }
    }
}
```

## File: Migrations/20260814123755_AddVaccinations.Designer.cs
```csharp
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PetHaven.Data;
#nullable disable
namespace PetHaven.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260814123755_AddVaccinations")]
    partial class AddVaccinations
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.28")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);
            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.Property<int>("AdopterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AdopterId"));
                    b.Property<string>("Address")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<decimal>("Balance")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<string>("ExperienceLevel")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("FreeHoursPerDay")
                        .HasColumnType("int");
                    b.Property<bool>("HasPetBefore")
                        .HasColumnType("bit");
                    b.Property<string>("HousingType")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<DateTime?>("LastReportDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("MissedReportsCount")
                        .HasColumnType("int");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("AdopterId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("Adopters");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.Property<int>("CenterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CenterId"));
                    b.Property<string>("Address")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("CenterName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("ContactInfo")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("CenterId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("AdoptionCenters");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionRequest", b =>
                {
                    b.Property<int>("AdoptionRequestId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AdoptionRequestId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<string>("CenterNote")
                        .HasColumnType("nvarchar(max)");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<int>("Score")
                        .HasColumnType("int");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("AdoptionRequestId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("PetId");
                    b.ToTable("AdoptionRequests");
                });
            modelBuilder.Entity("PetHaven.Models.Appointment", b =>
                {
                    b.Property<int>("AppointmentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AppointmentId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<DateTime>("AppointmentDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<string>("Reason")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("VetId")
                        .HasColumnType("int");
                    b.HasKey("AppointmentId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("PetId");
                    b.HasIndex("VetId");
                    b.ToTable("Appointments");
                });
            modelBuilder.Entity("PetHaven.Models.Blacklist", b =>
                {
                    b.Property<int>("BlacklistId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("BlacklistId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<DateTime>("BlockedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<bool>("IsActive")
                        .HasColumnType("bit");
                    b.Property<string>("Reason")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.HasKey("BlacklistId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("CenterId");
                    b.ToTable("Blacklists");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.Property<int>("CartId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CartId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("CartId");
                    b.HasIndex("UserId");
                    b.ToTable("Carts");
                });
            modelBuilder.Entity("PetHaven.Models.CartItem", b =>
                {
                    b.Property<int>("CartItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CartItemId"));
                    b.Property<int>("CartId")
                        .HasColumnType("int");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("Quantity")
                        .HasColumnType("int");
                    b.HasKey("CartItemId");
                    b.HasIndex("CartId");
                    b.HasIndex("ProductId");
                    b.ToTable("CartItems");
                });
            modelBuilder.Entity("PetHaven.Models.Category", b =>
                {
                    b.Property<int>("CategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CategoryId"));
                    b.Property<string>("CategoryName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.HasKey("CategoryId");
                    b.ToTable("Categories");
                });
            modelBuilder.Entity("PetHaven.Models.Diagnosis", b =>
                {
                    b.Property<int>("DiagnosisId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("DiagnosisId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<string>("Result")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Symptoms")
                        .HasColumnType("nvarchar(max)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("DiagnosisId");
                    b.HasIndex("PetId");
                    b.HasIndex("UserId");
                    b.ToTable("Diagnoses");
                });
            modelBuilder.Entity("PetHaven.Models.Notification", b =>
                {
                    b.Property<int>("NotificationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("NotificationId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<bool>("IsRead")
                        .HasColumnType("bit");
                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("Type")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("NotificationId");
                    b.HasIndex("UserId");
                    b.ToTable("Notifications");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.Property<int>("OrderId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("OrderId"));
                    b.Property<DateTime>("OrderDate")
                        .HasColumnType("datetime2");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<decimal>("TotalPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("OrderId");
                    b.HasIndex("UserId");
                    b.ToTable("Orders");
                });
            modelBuilder.Entity("PetHaven.Models.OrderItem", b =>
                {
                    b.Property<int>("OrderItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("OrderItemId"));
                    b.Property<int>("OrderId")
                        .HasColumnType("int");
                    b.Property<decimal>("PriceAtPurchase")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("Quantity")
                        .HasColumnType("int");
                    b.Property<decimal>("UnitPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.HasKey("OrderItemId");
                    b.HasIndex("OrderId");
                    b.HasIndex("ProductId");
                    b.ToTable("OrderItems");
                });
            modelBuilder.Entity("PetHaven.Models.Payment", b =>
                {
                    b.Property<int>("PaymentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PaymentId"));
                    b.Property<decimal>("Amount")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("OrderId")
                        .HasColumnType("int");
                    b.Property<DateTime>("PaymentDate")
                        .HasColumnType("datetime2");
                    b.Property<string>("PaymentMethod")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("PaymentStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("PaymentId");
                    b.HasIndex("OrderId")
                        .IsUnique();
                    b.ToTable("Payments");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.Property<int>("PetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PetId"));
                    b.Property<int?>("Age")
                        .HasColumnType("int");
                    b.Property<string>("Breed")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Gender")
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");
                    b.Property<string>("HealthStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("PetName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<string>("Species")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("PetId");
                    b.HasIndex("CenterId");
                    b.ToTable("Pets");
                });
            modelBuilder.Entity("PetHaven.Models.PetReport", b =>
                {
                    b.Property<int>("ReportId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ReportId"));
                    b.Property<int?>("AdopterId")
                        .HasColumnType("int");
                    b.Property<int>("AdoptionRequestId")
                        .HasColumnType("int");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("HealthStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("Notes")
                        .HasColumnType("nvarchar(max)");
                    b.HasKey("ReportId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("AdoptionRequestId");
                    b.ToTable("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.Property<int>("ProductId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ProductId"));
                    b.Property<int>("CategoryId")
                        .HasColumnType("int");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<decimal>("DiscountRate")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<string>("ImageURL")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<decimal>("ProductPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("StockQuantity")
                        .HasColumnType("int");
                    b.HasKey("ProductId");
                    b.HasIndex("CategoryId");
                    b.HasIndex("CenterId");
                    b.ToTable("Products");
                });
            modelBuilder.Entity("PetHaven.Models.Rating", b =>
                {
                    b.Property<int>("RatingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RatingId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("ReviewText")
                        .HasColumnType("nvarchar(max)");
                    b.Property<int>("StarsCount")
                        .HasColumnType("int");
                    b.Property<int>("TargetId")
                        .HasColumnType("int");
                    b.Property<string>("TargetType")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("RatingId");
                    b.HasIndex("UserId");
                    b.ToTable("Ratings");
                });
            modelBuilder.Entity("PetHaven.Models.Role", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RoleId"));
                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.HasKey("RoleId");
                    b.ToTable("Roles");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserId"));
                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("RoleId")
                        .HasColumnType("int");
                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.HasKey("UserId");
                    b.HasIndex("RoleId");
                    b.ToTable("Users");
                });
            modelBuilder.Entity("PetHaven.Models.Vaccination", b =>
                {
                    b.Property<int>("VaccinationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("VaccinationId"));
                    b.Property<string>("Description")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<DateTime?>("NextDueDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<DateTime>("VaccinationDate")
                        .HasColumnType("datetime2");
                    b.Property<string>("VaccineName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.HasKey("VaccinationId");
                    b.HasIndex("PetId");
                    b.ToTable("Vaccinations");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.Property<int>("VetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("VetId"));
                    b.Property<string>("ClinicAddress")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("ClinicName")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("Email")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<int?>("ExperienceYears")
                        .HasColumnType("int");
                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<bool>("IsVerified")
                        .HasColumnType("bit");
                    b.Property<string>("LicenseNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<decimal?>("Location_Lat")
                        .HasPrecision(18, 8)
                        .HasColumnType("decimal(18,8)");
                    b.Property<decimal?>("Location_Lng")
                        .HasPrecision(18, 8)
                        .HasColumnType("decimal(18,8)");
                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("Specialization")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("VetId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("Vets");
                });
            modelBuilder.Entity("PetHaven.Models.Wishlist", b =>
                {
                    b.Property<int>("WishlistId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("WishlistId"));
                    b.Property<DateTime>("AddedDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("WishlistId");
                    b.HasIndex("ProductId");
                    b.HasIndex("UserId");
                    b.ToTable("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("Adopter")
                        .HasForeignKey("PetHaven.Models.Adopter", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("AdoptionCenter")
                        .HasForeignKey("PetHaven.Models.AdoptionCenter", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionRequest", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany()
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany()
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Pet");
                });
            modelBuilder.Entity("PetHaven.Models.Appointment", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany("Appointments")
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany("Appointments")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Vet", "Vet")
                        .WithMany("Appointments")
                        .HasForeignKey("VetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Pet");
                    b.Navigation("Vet");
                });
            modelBuilder.Entity("PetHaven.Models.Blacklist", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany("Blacklists")
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Blacklists")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Carts")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.CartItem", b =>
                {
                    b.HasOne("PetHaven.Models.Cart", "Cart")
                        .WithMany("CartItems")
                        .HasForeignKey("CartId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("CartItems")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Cart");
                    b.Navigation("Product");
                });
            modelBuilder.Entity("PetHaven.Models.Diagnosis", b =>
                {
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany("Diagnoses")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Diagnoses")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Pet");
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Notification", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Notifications")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Orders")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.OrderItem", b =>
                {
                    b.HasOne("PetHaven.Models.Order", "Order")
                        .WithMany("OrderItems")
                        .HasForeignKey("OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("OrderItems")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Order");
                    b.Navigation("Product");
                });
            modelBuilder.Entity("PetHaven.Models.Payment", b =>
                {
                    b.HasOne("PetHaven.Models.Order", "Order")
                        .WithOne("Payment")
                        .HasForeignKey("PetHaven.Models.Payment", "OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Order");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Pets")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.PetReport", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", null)
                        .WithMany("PetReports")
                        .HasForeignKey("AdopterId");
                    b.HasOne("PetHaven.Models.AdoptionRequest", "AdoptionRequest")
                        .WithMany("PetReports")
                        .HasForeignKey("AdoptionRequestId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("AdoptionRequest");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.HasOne("PetHaven.Models.Category", "Category")
                        .WithMany("Products")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Products")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Category");
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.Rating", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Ratings")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.HasOne("PetHaven.Models.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Role");
                });
            modelBuilder.Entity("PetHaven.Models.Vaccination", b =>
                {
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany("Vaccinations")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Pet");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("Vet")
                        .HasForeignKey("PetHaven.Models.Vet", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Wishlist", b =>
                {
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("Wishlists")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Wishlists")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Product");
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.Navigation("Appointments");
                    b.Navigation("Blacklists");
                    b.Navigation("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.Navigation("Blacklists");
                    b.Navigation("Pets");
                    b.Navigation("Products");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionRequest", b =>
                {
                    b.Navigation("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.Navigation("CartItems");
                });
            modelBuilder.Entity("PetHaven.Models.Category", b =>
                {
                    b.Navigation("Products");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.Navigation("OrderItems");
                    b.Navigation("Payment");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.Navigation("Appointments");
                    b.Navigation("Diagnoses");
                    b.Navigation("Vaccinations");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.Navigation("CartItems");
                    b.Navigation("OrderItems");
                    b.Navigation("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Role", b =>
                {
                    b.Navigation("Users");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.Navigation("Adopter");
                    b.Navigation("AdoptionCenter");
                    b.Navigation("Carts");
                    b.Navigation("Diagnoses");
                    b.Navigation("Notifications");
                    b.Navigation("Orders");
                    b.Navigation("Ratings");
                    b.Navigation("Vet");
                    b.Navigation("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.Navigation("Appointments");
                });
#pragma warning restore 612, 618
        }
    }
}
```

## File: Migrations/20260818082858_UpdateAddProfileImageUrlToUser.cs
```csharp
using Microsoft.EntityFrameworkCore.Migrations;
#nullable disable
namespace PetHaven.Migrations
{
    public partial class UpdateAddProfileImageUrlToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
            migrationBuilder.AlterColumn<string>(
                name: "ImageURL",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);
            migrationBuilder.AlterColumn<string>(
                name: "ImageURL",
                table: "Pets",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);
            migrationBuilder.AlterColumn<string>(
                name: "ImageURL",
                table: "PetReports",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);
            migrationBuilder.AlterColumn<string>(
                name: "ImageURL",
                table: "Categories",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);
        }
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Users");
            migrationBuilder.AlterColumn<string>(
                name: "ImageURL",
                table: "Products",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
            migrationBuilder.AlterColumn<string>(
                name: "ImageURL",
                table: "Pets",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
            migrationBuilder.AlterColumn<string>(
                name: "ImageURL",
                table: "PetReports",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
            migrationBuilder.AlterColumn<string>(
                name: "ImageURL",
                table: "Categories",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
```

## File: Migrations/20260818082858_UpdateAddProfileImageUrlToUser.Designer.cs
```csharp
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PetHaven.Data;
#nullable disable
namespace PetHaven.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260818082858_UpdateAddProfileImageUrlToUser")]
    partial class UpdateAddProfileImageUrlToUser
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.28")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);
            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.Property<int>("AdopterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AdopterId"));
                    b.Property<string>("Address")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<decimal>("Balance")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<string>("ExperienceLevel")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("FreeHoursPerDay")
                        .HasColumnType("int");
                    b.Property<bool>("HasPetBefore")
                        .HasColumnType("bit");
                    b.Property<string>("HousingType")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<DateTime?>("LastReportDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("MissedReportsCount")
                        .HasColumnType("int");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("AdopterId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("Adopters");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.Property<int>("CenterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CenterId"));
                    b.Property<string>("Address")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("CenterName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("ContactInfo")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("CenterId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("AdoptionCenters");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionRequest", b =>
                {
                    b.Property<int>("AdoptionRequestId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AdoptionRequestId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<string>("CenterNote")
                        .HasColumnType("nvarchar(max)");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<int>("Score")
                        .HasColumnType("int");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("AdoptionRequestId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("PetId");
                    b.ToTable("AdoptionRequests");
                });
            modelBuilder.Entity("PetHaven.Models.Appointment", b =>
                {
                    b.Property<int>("AppointmentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AppointmentId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<DateTime>("AppointmentDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<string>("Reason")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("VetId")
                        .HasColumnType("int");
                    b.HasKey("AppointmentId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("PetId");
                    b.HasIndex("VetId");
                    b.ToTable("Appointments");
                });
            modelBuilder.Entity("PetHaven.Models.Blacklist", b =>
                {
                    b.Property<int>("BlacklistId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("BlacklistId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<DateTime>("BlockedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<bool>("IsActive")
                        .HasColumnType("bit");
                    b.Property<string>("Reason")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.HasKey("BlacklistId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("CenterId");
                    b.ToTable("Blacklists");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.Property<int>("CartId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CartId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("CartId");
                    b.HasIndex("UserId");
                    b.ToTable("Carts");
                });
            modelBuilder.Entity("PetHaven.Models.CartItem", b =>
                {
                    b.Property<int>("CartItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CartItemId"));
                    b.Property<int>("CartId")
                        .HasColumnType("int");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("Quantity")
                        .HasColumnType("int");
                    b.HasKey("CartItemId");
                    b.HasIndex("CartId");
                    b.HasIndex("ProductId");
                    b.ToTable("CartItems");
                });
            modelBuilder.Entity("PetHaven.Models.Category", b =>
                {
                    b.Property<int>("CategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CategoryId"));
                    b.Property<string>("CategoryName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("ImageURL")
                        .HasColumnType("nvarchar(max)");
                    b.HasKey("CategoryId");
                    b.ToTable("Categories");
                });
            modelBuilder.Entity("PetHaven.Models.Diagnosis", b =>
                {
                    b.Property<int>("DiagnosisId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("DiagnosisId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<string>("Result")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Symptoms")
                        .HasColumnType("nvarchar(max)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("DiagnosisId");
                    b.HasIndex("PetId");
                    b.HasIndex("UserId");
                    b.ToTable("Diagnoses");
                });
            modelBuilder.Entity("PetHaven.Models.Notification", b =>
                {
                    b.Property<int>("NotificationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("NotificationId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<bool>("IsRead")
                        .HasColumnType("bit");
                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("Type")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("NotificationId");
                    b.HasIndex("UserId");
                    b.ToTable("Notifications");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.Property<int>("OrderId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("OrderId"));
                    b.Property<DateTime>("OrderDate")
                        .HasColumnType("datetime2");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<decimal>("TotalPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("OrderId");
                    b.HasIndex("UserId");
                    b.ToTable("Orders");
                });
            modelBuilder.Entity("PetHaven.Models.OrderItem", b =>
                {
                    b.Property<int>("OrderItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("OrderItemId"));
                    b.Property<int>("OrderId")
                        .HasColumnType("int");
                    b.Property<decimal>("PriceAtPurchase")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("Quantity")
                        .HasColumnType("int");
                    b.Property<decimal>("UnitPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.HasKey("OrderItemId");
                    b.HasIndex("OrderId");
                    b.HasIndex("ProductId");
                    b.ToTable("OrderItems");
                });
            modelBuilder.Entity("PetHaven.Models.Payment", b =>
                {
                    b.Property<int>("PaymentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PaymentId"));
                    b.Property<decimal>("Amount")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("OrderId")
                        .HasColumnType("int");
                    b.Property<DateTime>("PaymentDate")
                        .HasColumnType("datetime2");
                    b.Property<string>("PaymentMethod")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("PaymentStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("PaymentId");
                    b.HasIndex("OrderId")
                        .IsUnique();
                    b.ToTable("Payments");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.Property<int>("PetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PetId"));
                    b.Property<int?>("Age")
                        .HasColumnType("int");
                    b.Property<string>("Breed")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Gender")
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");
                    b.Property<string>("HealthStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("ImageURL")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("PetName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<string>("Species")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("PetId");
                    b.HasIndex("CenterId");
                    b.ToTable("Pets");
                });
            modelBuilder.Entity("PetHaven.Models.PetReport", b =>
                {
                    b.Property<int>("ReportId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ReportId"));
                    b.Property<int?>("AdopterId")
                        .HasColumnType("int");
                    b.Property<int>("AdoptionRequestId")
                        .HasColumnType("int");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("HealthStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("ImageURL")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Notes")
                        .HasColumnType("nvarchar(max)");
                    b.HasKey("ReportId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("AdoptionRequestId");
                    b.ToTable("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.Property<int>("ProductId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ProductId"));
                    b.Property<int>("CategoryId")
                        .HasColumnType("int");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<decimal>("DiscountRate")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<string>("ImageURL")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<decimal>("ProductPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("StockQuantity")
                        .HasColumnType("int");
                    b.HasKey("ProductId");
                    b.HasIndex("CategoryId");
                    b.HasIndex("CenterId");
                    b.ToTable("Products");
                });
            modelBuilder.Entity("PetHaven.Models.Rating", b =>
                {
                    b.Property<int>("RatingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RatingId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("ReviewText")
                        .HasColumnType("nvarchar(max)");
                    b.Property<int>("StarsCount")
                        .HasColumnType("int");
                    b.Property<int>("TargetId")
                        .HasColumnType("int");
                    b.Property<string>("TargetType")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("RatingId");
                    b.HasIndex("UserId");
                    b.ToTable("Ratings");
                });
            modelBuilder.Entity("PetHaven.Models.Role", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RoleId"));
                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.HasKey("RoleId");
                    b.ToTable("Roles");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserId"));
                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("ImageUrl")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("RoleId")
                        .HasColumnType("int");
                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.HasKey("UserId");
                    b.HasIndex("RoleId");
                    b.ToTable("Users");
                });
            modelBuilder.Entity("PetHaven.Models.Vaccination", b =>
                {
                    b.Property<int>("VaccinationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("VaccinationId"));
                    b.Property<string>("Description")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<DateTime?>("NextDueDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<DateTime>("VaccinationDate")
                        .HasColumnType("datetime2");
                    b.Property<string>("VaccineName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.HasKey("VaccinationId");
                    b.HasIndex("PetId");
                    b.ToTable("Vaccinations");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.Property<int>("VetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("VetId"));
                    b.Property<string>("ClinicAddress")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("ClinicName")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("Email")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<int?>("ExperienceYears")
                        .HasColumnType("int");
                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<bool>("IsVerified")
                        .HasColumnType("bit");
                    b.Property<string>("LicenseNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<decimal?>("Location_Lat")
                        .HasPrecision(18, 8)
                        .HasColumnType("decimal(18,8)");
                    b.Property<decimal?>("Location_Lng")
                        .HasPrecision(18, 8)
                        .HasColumnType("decimal(18,8)");
                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("Specialization")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("VetId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("Vets");
                });
            modelBuilder.Entity("PetHaven.Models.Wishlist", b =>
                {
                    b.Property<int>("WishlistId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("WishlistId"));
                    b.Property<DateTime>("AddedDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("WishlistId");
                    b.HasIndex("ProductId");
                    b.HasIndex("UserId");
                    b.ToTable("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("Adopter")
                        .HasForeignKey("PetHaven.Models.Adopter", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("AdoptionCenter")
                        .HasForeignKey("PetHaven.Models.AdoptionCenter", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionRequest", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany()
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany()
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Pet");
                });
            modelBuilder.Entity("PetHaven.Models.Appointment", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany("Appointments")
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany("Appointments")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Vet", "Vet")
                        .WithMany("Appointments")
                        .HasForeignKey("VetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Pet");
                    b.Navigation("Vet");
                });
            modelBuilder.Entity("PetHaven.Models.Blacklist", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany("Blacklists")
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Blacklists")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Carts")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.CartItem", b =>
                {
                    b.HasOne("PetHaven.Models.Cart", "Cart")
                        .WithMany("CartItems")
                        .HasForeignKey("CartId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("CartItems")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Cart");
                    b.Navigation("Product");
                });
            modelBuilder.Entity("PetHaven.Models.Diagnosis", b =>
                {
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany("Diagnoses")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Diagnoses")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Pet");
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Notification", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Notifications")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Orders")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.OrderItem", b =>
                {
                    b.HasOne("PetHaven.Models.Order", "Order")
                        .WithMany("OrderItems")
                        .HasForeignKey("OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("OrderItems")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Order");
                    b.Navigation("Product");
                });
            modelBuilder.Entity("PetHaven.Models.Payment", b =>
                {
                    b.HasOne("PetHaven.Models.Order", "Order")
                        .WithOne("Payment")
                        .HasForeignKey("PetHaven.Models.Payment", "OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Order");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Pets")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.PetReport", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", null)
                        .WithMany("PetReports")
                        .HasForeignKey("AdopterId");
                    b.HasOne("PetHaven.Models.AdoptionRequest", "AdoptionRequest")
                        .WithMany("PetReports")
                        .HasForeignKey("AdoptionRequestId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("AdoptionRequest");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.HasOne("PetHaven.Models.Category", "Category")
                        .WithMany("Products")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Products")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Category");
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.Rating", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Ratings")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.HasOne("PetHaven.Models.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Role");
                });
            modelBuilder.Entity("PetHaven.Models.Vaccination", b =>
                {
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany("Vaccinations")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Pet");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("Vet")
                        .HasForeignKey("PetHaven.Models.Vet", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Wishlist", b =>
                {
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("Wishlists")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Wishlists")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Product");
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.Navigation("Appointments");
                    b.Navigation("Blacklists");
                    b.Navigation("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.Navigation("Blacklists");
                    b.Navigation("Pets");
                    b.Navigation("Products");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionRequest", b =>
                {
                    b.Navigation("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.Navigation("CartItems");
                });
            modelBuilder.Entity("PetHaven.Models.Category", b =>
                {
                    b.Navigation("Products");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.Navigation("OrderItems");
                    b.Navigation("Payment");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.Navigation("Appointments");
                    b.Navigation("Diagnoses");
                    b.Navigation("Vaccinations");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.Navigation("CartItems");
                    b.Navigation("OrderItems");
                    b.Navigation("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Role", b =>
                {
                    b.Navigation("Users");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.Navigation("Adopter");
                    b.Navigation("AdoptionCenter");
                    b.Navigation("Carts");
                    b.Navigation("Diagnoses");
                    b.Navigation("Notifications");
                    b.Navigation("Orders");
                    b.Navigation("Ratings");
                    b.Navigation("Vet");
                    b.Navigation("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.Navigation("Appointments");
                });
#pragma warning restore 612, 618
        }
    }
}
```

## File: Migrations/ApplicationDbContextModelSnapshot.cs
```csharp
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PetHaven.Data;
#nullable disable
namespace PetHaven.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.28")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);
            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.Property<int>("AdopterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AdopterId"));
                    b.Property<string>("Address")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<decimal>("Balance")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<string>("ExperienceLevel")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("FreeHoursPerDay")
                        .HasColumnType("int");
                    b.Property<bool>("HasPetBefore")
                        .HasColumnType("bit");
                    b.Property<string>("HousingType")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<DateTime?>("LastReportDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("MissedReportsCount")
                        .HasColumnType("int");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("AdopterId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("Adopters");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.Property<int>("CenterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CenterId"));
                    b.Property<string>("Address")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("CenterName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("ContactInfo")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("CenterId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("AdoptionCenters");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionRequest", b =>
                {
                    b.Property<int>("AdoptionRequestId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AdoptionRequestId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<string>("CenterNote")
                        .HasColumnType("nvarchar(max)");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<int>("Score")
                        .HasColumnType("int");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("AdoptionRequestId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("PetId");
                    b.ToTable("AdoptionRequests");
                });
            modelBuilder.Entity("PetHaven.Models.Appointment", b =>
                {
                    b.Property<int>("AppointmentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AppointmentId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<DateTime>("AppointmentDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<string>("Reason")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("VetId")
                        .HasColumnType("int");
                    b.HasKey("AppointmentId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("PetId");
                    b.HasIndex("VetId");
                    b.ToTable("Appointments");
                });
            modelBuilder.Entity("PetHaven.Models.Blacklist", b =>
                {
                    b.Property<int>("BlacklistId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("BlacklistId"));
                    b.Property<int>("AdopterId")
                        .HasColumnType("int");
                    b.Property<DateTime>("BlockedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<bool>("IsActive")
                        .HasColumnType("bit");
                    b.Property<string>("Reason")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.HasKey("BlacklistId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("CenterId");
                    b.ToTable("Blacklists");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.Property<int>("CartId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CartId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("CartId");
                    b.HasIndex("UserId");
                    b.ToTable("Carts");
                });
            modelBuilder.Entity("PetHaven.Models.CartItem", b =>
                {
                    b.Property<int>("CartItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CartItemId"));
                    b.Property<int>("CartId")
                        .HasColumnType("int");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("Quantity")
                        .HasColumnType("int");
                    b.HasKey("CartItemId");
                    b.HasIndex("CartId");
                    b.HasIndex("ProductId");
                    b.ToTable("CartItems");
                });
            modelBuilder.Entity("PetHaven.Models.Category", b =>
                {
                    b.Property<int>("CategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CategoryId"));
                    b.Property<string>("CategoryName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("ImageURL")
                        .HasColumnType("nvarchar(max)");
                    b.HasKey("CategoryId");
                    b.ToTable("Categories");
                });
            modelBuilder.Entity("PetHaven.Models.Diagnosis", b =>
                {
                    b.Property<int>("DiagnosisId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("DiagnosisId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<string>("Result")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Symptoms")
                        .HasColumnType("nvarchar(max)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("DiagnosisId");
                    b.HasIndex("PetId");
                    b.HasIndex("UserId");
                    b.ToTable("Diagnoses");
                });
            modelBuilder.Entity("PetHaven.Models.Notification", b =>
                {
                    b.Property<int>("NotificationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("NotificationId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<bool>("IsRead")
                        .HasColumnType("bit");
                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("Type")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("NotificationId");
                    b.HasIndex("UserId");
                    b.ToTable("Notifications");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.Property<int>("OrderId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("OrderId"));
                    b.Property<DateTime>("OrderDate")
                        .HasColumnType("datetime2");
                    b.Property<string>("Status")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<decimal>("TotalPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("OrderId");
                    b.HasIndex("UserId");
                    b.ToTable("Orders");
                });
            modelBuilder.Entity("PetHaven.Models.OrderItem", b =>
                {
                    b.Property<int>("OrderItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("OrderItemId"));
                    b.Property<int>("OrderId")
                        .HasColumnType("int");
                    b.Property<decimal>("PriceAtPurchase")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("Quantity")
                        .HasColumnType("int");
                    b.Property<decimal>("UnitPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.HasKey("OrderItemId");
                    b.HasIndex("OrderId");
                    b.HasIndex("ProductId");
                    b.ToTable("OrderItems");
                });
            modelBuilder.Entity("PetHaven.Models.Payment", b =>
                {
                    b.Property<int>("PaymentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PaymentId"));
                    b.Property<decimal>("Amount")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("OrderId")
                        .HasColumnType("int");
                    b.Property<DateTime>("PaymentDate")
                        .HasColumnType("datetime2");
                    b.Property<string>("PaymentMethod")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("PaymentStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("PaymentId");
                    b.HasIndex("OrderId")
                        .IsUnique();
                    b.ToTable("Payments");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.Property<int>("PetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PetId"));
                    b.Property<int?>("Age")
                        .HasColumnType("int");
                    b.Property<string>("Breed")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Gender")
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");
                    b.Property<string>("HealthStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("ImageURL")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("PetName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<string>("Species")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.HasKey("PetId");
                    b.HasIndex("CenterId");
                    b.ToTable("Pets");
                });
            modelBuilder.Entity("PetHaven.Models.PetReport", b =>
                {
                    b.Property<int>("ReportId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ReportId"));
                    b.Property<int?>("AdopterId")
                        .HasColumnType("int");
                    b.Property<int>("AdoptionRequestId")
                        .HasColumnType("int");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("HealthStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("ImageURL")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Notes")
                        .HasColumnType("nvarchar(max)");
                    b.HasKey("ReportId");
                    b.HasIndex("AdopterId");
                    b.HasIndex("AdoptionRequestId");
                    b.ToTable("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.Property<int>("ProductId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ProductId"));
                    b.Property<int>("CategoryId")
                        .HasColumnType("int");
                    b.Property<int>("CenterId")
                        .HasColumnType("int");
                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");
                    b.Property<decimal>("DiscountRate")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<string>("ImageURL")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<decimal>("ProductPrice")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");
                    b.Property<int>("StockQuantity")
                        .HasColumnType("int");
                    b.HasKey("ProductId");
                    b.HasIndex("CategoryId");
                    b.HasIndex("CenterId");
                    b.ToTable("Products");
                });
            modelBuilder.Entity("PetHaven.Models.Rating", b =>
                {
                    b.Property<int>("RatingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RatingId"));
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("ReviewText")
                        .HasColumnType("nvarchar(max)");
                    b.Property<int>("StarsCount")
                        .HasColumnType("int");
                    b.Property<int>("TargetId")
                        .HasColumnType("int");
                    b.Property<string>("TargetType")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("RatingId");
                    b.HasIndex("UserId");
                    b.ToTable("Ratings");
                });
            modelBuilder.Entity("PetHaven.Models.Role", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RoleId"));
                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.HasKey("RoleId");
                    b.ToTable("Roles");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserId"));
                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<string>("ImageUrl")
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");
                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<int>("RoleId")
                        .HasColumnType("int");
                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.HasKey("UserId");
                    b.HasIndex("RoleId");
                    b.ToTable("Users");
                });
            modelBuilder.Entity("PetHaven.Models.Vaccination", b =>
                {
                    b.Property<int>("VaccinationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("VaccinationId"));
                    b.Property<string>("Description")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<DateTime?>("NextDueDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("PetId")
                        .HasColumnType("int");
                    b.Property<DateTime>("VaccinationDate")
                        .HasColumnType("datetime2");
                    b.Property<string>("VaccineName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.HasKey("VaccinationId");
                    b.HasIndex("PetId");
                    b.ToTable("Vaccinations");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.Property<int>("VetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("VetId"));
                    b.Property<string>("ClinicAddress")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<string>("ClinicName")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");
                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");
                    b.Property<string>("Email")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<int?>("ExperienceYears")
                        .HasColumnType("int");
                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");
                    b.Property<bool>("IsVerified")
                        .HasColumnType("bit");
                    b.Property<string>("LicenseNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<decimal?>("Location_Lat")
                        .HasPrecision(18, 8)
                        .HasColumnType("decimal(18,8)");
                    b.Property<decimal?>("Location_Lng")
                        .HasPrecision(18, 8)
                        .HasColumnType("decimal(18,8)");
                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");
                    b.Property<string>("Specialization")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("VetId");
                    b.HasIndex("UserId")
                        .IsUnique();
                    b.ToTable("Vets");
                });
            modelBuilder.Entity("PetHaven.Models.Wishlist", b =>
                {
                    b.Property<int>("WishlistId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");
                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("WishlistId"));
                    b.Property<DateTime>("AddedDate")
                        .HasColumnType("datetime2");
                    b.Property<int>("ProductId")
                        .HasColumnType("int");
                    b.Property<int>("UserId")
                        .HasColumnType("int");
                    b.HasKey("WishlistId");
                    b.HasIndex("ProductId");
                    b.HasIndex("UserId");
                    b.ToTable("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("Adopter")
                        .HasForeignKey("PetHaven.Models.Adopter", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("AdoptionCenter")
                        .HasForeignKey("PetHaven.Models.AdoptionCenter", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionRequest", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany()
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany()
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Pet");
                });
            modelBuilder.Entity("PetHaven.Models.Appointment", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany("Appointments")
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany("Appointments")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Vet", "Vet")
                        .WithMany("Appointments")
                        .HasForeignKey("VetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Pet");
                    b.Navigation("Vet");
                });
            modelBuilder.Entity("PetHaven.Models.Blacklist", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", "Adopter")
                        .WithMany("Blacklists")
                        .HasForeignKey("AdopterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Blacklists")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Adopter");
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Carts")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.CartItem", b =>
                {
                    b.HasOne("PetHaven.Models.Cart", "Cart")
                        .WithMany("CartItems")
                        .HasForeignKey("CartId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("CartItems")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Cart");
                    b.Navigation("Product");
                });
            modelBuilder.Entity("PetHaven.Models.Diagnosis", b =>
                {
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany("Diagnoses")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Diagnoses")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Pet");
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Notification", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Notifications")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Orders")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.OrderItem", b =>
                {
                    b.HasOne("PetHaven.Models.Order", "Order")
                        .WithMany("OrderItems")
                        .HasForeignKey("OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("OrderItems")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Order");
                    b.Navigation("Product");
                });
            modelBuilder.Entity("PetHaven.Models.Payment", b =>
                {
                    b.HasOne("PetHaven.Models.Order", "Order")
                        .WithOne("Payment")
                        .HasForeignKey("PetHaven.Models.Payment", "OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Order");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Pets")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.PetReport", b =>
                {
                    b.HasOne("PetHaven.Models.Adopter", null)
                        .WithMany("PetReports")
                        .HasForeignKey("AdopterId");
                    b.HasOne("PetHaven.Models.AdoptionRequest", "AdoptionRequest")
                        .WithMany("PetReports")
                        .HasForeignKey("AdoptionRequestId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("AdoptionRequest");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.HasOne("PetHaven.Models.Category", "Category")
                        .WithMany("Products")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.AdoptionCenter", "Center")
                        .WithMany("Products")
                        .HasForeignKey("CenterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Category");
                    b.Navigation("Center");
                });
            modelBuilder.Entity("PetHaven.Models.Rating", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Ratings")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.HasOne("PetHaven.Models.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Role");
                });
            modelBuilder.Entity("PetHaven.Models.Vaccination", b =>
                {
                    b.HasOne("PetHaven.Models.Pet", "Pet")
                        .WithMany("Vaccinations")
                        .HasForeignKey("PetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("Pet");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithOne("Vet")
                        .HasForeignKey("PetHaven.Models.Vet", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Wishlist", b =>
                {
                    b.HasOne("PetHaven.Models.Product", "Product")
                        .WithMany("Wishlists")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                    b.HasOne("PetHaven.Models.User", "User")
                        .WithMany("Wishlists")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                    b.Navigation("Product");
                    b.Navigation("User");
                });
            modelBuilder.Entity("PetHaven.Models.Adopter", b =>
                {
                    b.Navigation("Appointments");
                    b.Navigation("Blacklists");
                    b.Navigation("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionCenter", b =>
                {
                    b.Navigation("Blacklists");
                    b.Navigation("Pets");
                    b.Navigation("Products");
                });
            modelBuilder.Entity("PetHaven.Models.AdoptionRequest", b =>
                {
                    b.Navigation("PetReports");
                });
            modelBuilder.Entity("PetHaven.Models.Cart", b =>
                {
                    b.Navigation("CartItems");
                });
            modelBuilder.Entity("PetHaven.Models.Category", b =>
                {
                    b.Navigation("Products");
                });
            modelBuilder.Entity("PetHaven.Models.Order", b =>
                {
                    b.Navigation("OrderItems");
                    b.Navigation("Payment");
                });
            modelBuilder.Entity("PetHaven.Models.Pet", b =>
                {
                    b.Navigation("Appointments");
                    b.Navigation("Diagnoses");
                    b.Navigation("Vaccinations");
                });
            modelBuilder.Entity("PetHaven.Models.Product", b =>
                {
                    b.Navigation("CartItems");
                    b.Navigation("OrderItems");
                    b.Navigation("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Role", b =>
                {
                    b.Navigation("Users");
                });
            modelBuilder.Entity("PetHaven.Models.User", b =>
                {
                    b.Navigation("Adopter");
                    b.Navigation("AdoptionCenter");
                    b.Navigation("Carts");
                    b.Navigation("Diagnoses");
                    b.Navigation("Notifications");
                    b.Navigation("Orders");
                    b.Navigation("Ratings");
                    b.Navigation("Vet");
                    b.Navigation("Wishlists");
                });
            modelBuilder.Entity("PetHaven.Models.Vet", b =>
                {
                    b.Navigation("Appointments");
                });
#pragma warning restore 612, 618
        }
    }
}
```

## File: Models/Adopter.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class Adopter
    {
        [Key]
        public int AdopterId { get; set; }
        [Required]
        public int UserId { get; set; }
        [MaxLength(500)]
        public string? Address { get; set; }
        [MaxLength(50)]
        public string? HousingType { get; set; }
        public bool HasPetBefore { get; set; }
        [MaxLength(50)]
        public string? ExperienceLevel { get; set; }
        public int MissedReportsCount { get; set; }
        public int FreeHoursPerDay { get; set; }
        public DateTime? LastReportDate { get; set; }
        [Required]
        public decimal Balance { get; set; }
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
        public virtual ICollection<Appointment>? Appointments { get; set; }
        public virtual ICollection<Blacklist>? Blacklists { get; set; }
        public virtual ICollection<PetReport>? PetReports { get; set; }
    }
}
```

## File: Models/AdoptionCenter.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class AdoptionCenter
    {
        [Key]
        public int CenterId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        [MaxLength(200)]
        public string CenterName { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? Address { get; set; }
        [MaxLength(200)]
        public string? ContactInfo { get; set; }
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
        public virtual ICollection<Product>? Products { get; set; }
        public virtual ICollection<Pet>? Pets { get; set; }
        public virtual ICollection<Blacklist>? Blacklists { get; set; }
    }
}
```

## File: Models/AdoptionRequest.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class AdoptionRequest
    {
        [Key]
        public int AdoptionRequestId { get; set; }
        [Required]
        public int AdopterId { get; set; }
        [Required]
        public int PetId { get; set; }
        [MaxLength(50)]
        public string? Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public int Score { get; set; }
        public string? CenterNote { get; set; }
        [ForeignKey("AdopterId")]
        public virtual Adopter Adopter { get; set; } = null!;
        [ForeignKey("PetId")]
        public virtual Pet Pet { get; set; } = null!;
        public virtual ICollection<PetReport> PetReports { get; set; } = new List<PetReport>();
    }
}
```

## File: Models/Appointment.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class Appointment
    {
        [Key]
        public int AppointmentId { get; set; }
        [Required]
        public int AdopterId { get; set; }
        [Required]
        public int PetId { get; set; }
        [Required]
        public int VetId { get; set; }
        public DateTime AppointmentDate { get; set; }
        [MaxLength(50)]
        public string? Status { get; set; }
        public string? Reason { get; set; }
        [ForeignKey("AdopterId")]
        public virtual Adopter? Adopter { get; set; }
        [ForeignKey("PetId")]
        public virtual Pet? Pet { get; set; }
        [ForeignKey("VetId")]
        public virtual Vet? Vet { get; set; }
    }
}
```

## File: Models/Blacklist.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class Blacklist
    {
        [Key]
        public int BlacklistId { get; set; }
        [Required]
        public int AdopterId { get; set; }
        [Required]
        public int CenterId { get; set; }
        [MaxLength(500)]
        public string? Reason { get; set; }
        public DateTime BlockedAt { get; set; }
        public bool IsActive { get; set; }
        [ForeignKey("AdopterId")]
        public virtual Adopter? Adopter { get; set; }
        [ForeignKey("CenterId")]
        public virtual AdoptionCenter? Center { get; set; }
    }
}
```

## File: Models/Cart.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class Cart
    {
        [Key]
        public int CartId { get; set; }
        [Required]
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
        public virtual ICollection<CartItem>? CartItems { get; set; }
    }
}
```

## File: Models/CartItem.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class CartItem
    {
        [Key]
        public int CartItemId { get; set; }
        [Required]
        public int CartId { get; set; }
        [Required]
        public int ProductId { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
        [ForeignKey("CartId")]
        public virtual Cart? Cart { get; set; }
        [ForeignKey("ProductId")]
        public virtual Product? Product { get; set; }
    }
}
```

## File: Models/Category.cs
```csharp
using System.ComponentModel.DataAnnotations;
namespace PetHaven.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }
        [Required]
        [MaxLength(100)]
        public string CategoryName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ImageURL { get; set; }
        public virtual ICollection<Product>? Products { get; set; }
    }
}
```

## File: Models/Diagnosis.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class Diagnosis
    {
        [Key]
        public int DiagnosisId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public int PetId { get; set; }
        public string? Symptoms { get; set; }
        public string? Result { get; set; }
        public DateTime CreatedAt { get; set; }
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
        [ForeignKey("PetId")]
        public virtual Pet? Pet { get; set; }
    }
}
```

## File: Models/Notification.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class Notification
    {
        [Key]
        public int NotificationId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        [MaxLength(50)]
        public string? Type { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
    }
}
```

## File: Models/Order.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }
        [Required]
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        [Required]
        public decimal TotalPrice { get; set; }
        [MaxLength(50)]
        public string? Status { get; set; }
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
        public virtual ICollection<OrderItem>? OrderItems { get; set; }
        public virtual Payment? Payment { get; set; }
    }
}
```

## File: Models/OrderItem.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class OrderItem
    {
        [Key]
        public int OrderItemId { get; set; }
        [Required]
        public int OrderId { get; set; }
        [Required]
        public int ProductId { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
        [Required]
        public decimal UnitPrice { get; set; }
        public decimal PriceAtPurchase { get; set; }
        [ForeignKey("OrderId")]
        public virtual Order? Order { get; set; }
        [ForeignKey("ProductId")]
        public virtual Product? Product { get; set; }
    }
}
```

## File: Models/Payment.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }
        [Required]
        public int OrderId { get; set; }
        [Required]
        public decimal Amount { get; set; }
        [MaxLength(50)]
        public string? PaymentMethod { get; set; }
        [MaxLength(50)]
        public string? PaymentStatus { get; set; }
        public DateTime PaymentDate { get; set; }
        [ForeignKey("OrderId")]
        public virtual Order? Order { get; set; }
    }
}
```

## File: Models/Pet.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class Pet
    {
        [Key]
        public int PetId { get; set; }
        [Required]
        public int CenterId { get; set; }
        [Required]
        [MaxLength(100)]
        public string PetName { get; set; } = string.Empty;
        [MaxLength(50)]
        public string? Species { get; set; }
        [MaxLength(50)]
        public string? Breed { get; set; }
        public int? Age { get; set; }
        [MaxLength(20)]
        public string? Gender { get; set; }
        [MaxLength(50)]
        public string? HealthStatus { get; set; }
        public string? Description { get; set; }
        public string? ImageURL { get; set; }
        [ForeignKey("CenterId")]
        public virtual AdoptionCenter? Center { get; set; }
        public virtual ICollection<Appointment>? Appointments { get; set; }
        public virtual ICollection<Diagnosis>? Diagnoses { get; set; }
        public virtual ICollection<Vaccination>? Vaccinations { get; set; }
    }
}
```

## File: Models/PetReport.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class PetReport
    {
        [Key]
        public int ReportId { get; set; }
        [Required]
        public int AdoptionRequestId { get; set; }
        public string? ImageURL { get; set; }
        [MaxLength(50)]
        public string? HealthStatus { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        [ForeignKey("AdoptionRequestId")]
        public virtual AdoptionRequest AdoptionRequest { get; set; } = null!;
    }
}
```

## File: Models/Product.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        [Required]
        public int CenterId { get; set; }
        [Required]
        public int CategoryId { get; set; }
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        [Required]
        public decimal ProductPrice { get; set; }
        public decimal DiscountRate { get; set; }
        [Required]
        public int StockQuantity { get; set; }
        public string? ImageURL { get; set; }
        [ForeignKey("CenterId")]
        public virtual AdoptionCenter? Center { get; set; }
        [ForeignKey("CategoryId")]
        public virtual Category? Category { get; set; }
        public virtual ICollection<CartItem>? CartItems { get; set; }
        public virtual ICollection<OrderItem>? OrderItems { get; set; }
        public virtual ICollection<Wishlist>? Wishlists { get; set; }
    }
}
```

## File: Models/Rating.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class Rating
    {
        [Key]
        public int RatingId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        [MaxLength(50)]
        public string TargetType { get; set; } = string.Empty;
        [Required]
        public int TargetId { get; set; }
        [Required]
        [Range(1, 5)]
        public int StarsCount { get; set; }
        public string? ReviewText { get; set; }
        public DateTime CreatedAt { get; set; }
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
    }
}
```

## File: Models/Role.cs
```csharp
using System.ComponentModel.DataAnnotations;
namespace PetHaven.Models
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; }
        [Required]
        [MaxLength(100)]
        public string RoleName { get; set; } = string.Empty;
        public virtual ICollection<User>? Users { get; set; }
    }
}
```

## File: Models/User.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        [Required]
        public int RoleId { get; set; }
        [Required]
        [MaxLength(100)]
        public string UserName { get; set; } = string.Empty;
        [Required]
        [MaxLength(200)]
        public string FullName { get; set; } = string.Empty;
        [Required]
        [MaxLength(200)]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
        [MaxLength(50)]
        public string? PhoneNumber { get; set; }
        public string? ImageUrl { get; set; }
        [ForeignKey("RoleId")]
        public virtual Role? Role { get; set; }
        public virtual ICollection<Notification>? Notifications { get; set; }
        public virtual ICollection<Rating>? Ratings { get; set; }
        public virtual ICollection<Cart>? Carts { get; set; }
        public virtual ICollection<Order>? Orders { get; set; }
        public virtual ICollection<Wishlist>? Wishlists { get; set; }
        public virtual ICollection<Diagnosis>? Diagnoses { get; set; }
        public virtual Adopter? Adopter { get; set; }
        public virtual AdoptionCenter? AdoptionCenter { get; set; }
        public virtual Vet? Vet { get; set; }
    }
}
```

## File: Models/Vaccination.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class Vaccination
    {
        [Key]
        public int VaccinationId { get; set; }
        [Required]
        public int PetId { get; set; }
        [Required]
        [MaxLength(200)]
        public string VaccineName { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? Description { get; set; }
        public DateTime VaccinationDate { get; set; }
        public DateTime? NextDueDate { get; set; }
        [ForeignKey("PetId")]
        public virtual Pet? Pet { get; set; }
    }
}
```

## File: Models/Vet.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class Vet
    {
        [Key]
        public int VetId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        [MaxLength(200)]
        public string FullName { get; set; } = string.Empty;
        [MaxLength(100)]
        public string? Specialization { get; set; }
        [MaxLength(500)]
        public string? ClinicName { get; set; }
        [MaxLength(500)]
        public string? ClinicAddress { get; set; }
        [MaxLength(50)]
        public string? PhoneNumber { get; set; }
        [MaxLength(100)]
        public string? Email { get; set; }
        public int? ExperienceYears { get; set; }
        [MaxLength(50)]
        public string? LicenseNumber { get; set; }
        public decimal? Location_Lat { get; set; }
        public decimal? Location_Lng { get; set; }
        public bool IsVerified { get; set; }
        public DateTime CreatedAt { get; set; }
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        [NotMapped]
        public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
    }
}
```

## File: Models/Wishlist.cs
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PetHaven.Models
{
    public class Wishlist
    {
        [Key]
        public int WishlistId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public int ProductId { get; set; }
        public DateTime AddedDate { get; set; }
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
        [ForeignKey("ProductId")]
        public virtual Product? Product { get; set; }
    }
}
```

## File: Properties/launchSettings.json
```json
{
  "$schema": "http://json.schemastore.org/launchsettings.json",
  "iisSettings": {
    "windowsAuthentication": false,
    "anonymousAuthentication": true,
    "iisExpress": {
      "applicationUrl": "http://localhost:36004",
      "sslPort": 44374
    }
  },
  "profiles": {
    "http": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "launchUrl": "swagger",
      "applicationUrl": "http://localhost:5248",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
    "https": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "launchUrl": "swagger",
      "applicationUrl": "https://localhost:7283;http://localhost:5248",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
    "IIS Express": {
      "commandName": "IISExpress",
      "launchBrowser": true,
      "launchUrl": "swagger",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}
```

## File: Services/AdopterDashboardService.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public class AdopterDashboardService : IAdopterDashboardService
    {
        private readonly ApplicationDbContext _context;
        public AdopterDashboardService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<AdopterDashboardDto> GetAdopterDashboardAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var adopter = await _context.Adopters
                .FirstOrDefaultAsync(a => a.UserId == parsedUserId);
            if (adopter == null)
                throw new Exception("لم يتم العثور على حساب المتبني.");
            var pendingCount = await _context.AdoptionRequests
                .CountAsync(r => r.AdopterId == adopter.AdopterId && r.Status == "Pending");
            var adoptedCount = await _context.AdoptionRequests
                .CountAsync(r => r.AdopterId == adopter.AdopterId && r.Status == "Approved");
            var recentOrdersCount = await _context.Orders
                .CountAsync(o => o.UserId == parsedUserId);
            var lastAdoption = await _context.AdoptionRequests
                .Include(r => r.Pet)
                .Where(r => r.AdopterId == adopter.AdopterId && r.Status == "Approved")
                .OrderByDescending(r => r.CreatedAt)
                .FirstOrDefaultAsync();
            string? lastPetName = lastAdoption?.Pet?.PetName;
            int? daysSinceLastAdoption = null;
            if (adopter.LastReportDate.HasValue)
            {
                daysSinceLastAdoption = (int)(DateTime.UtcNow - adopter.LastReportDate.Value).TotalDays;
            }
            string welcomeMessage = "مرحباً بعودتك! 👋";
            if (daysSinceLastAdoption.HasValue && daysSinceLastAdoption >= 180 && !string.IsNullOrEmpty(lastPetName))
            {
                int months = daysSinceLastAdoption.Value / 30;
                welcomeMessage = $"Hello! It's been {months} months since you adopted {lastPetName}. Please share an update photo to reassure the center.";
            }
            else if (pendingCount > 0)
            {
                welcomeMessage = $"لديك {pendingCount} طلب تبني قيد الانتظار. نتمنى لك التوفيق! 🍀";
            }
            else if (adoptedCount > 0 && !string.IsNullOrEmpty(lastPetName))
            {
                welcomeMessage = $"نتمنى لك أوقاتاً سعيدة مع {lastPetName}! 🐾";
            }
            return new AdopterDashboardDto
            {
                PendingAdoptionsCount = pendingCount,
                AdoptedPetsCount = adoptedCount,
                RecentOrdersCount = recentOrdersCount,
                DaysSinceLastAdoption = daysSinceLastAdoption,
                LastAdoptedPetName = lastPetName,
                WelcomeMessage = welcomeMessage
            };
        }
        public async Task<IEnumerable<PetResponseDto>> GetAdoptedPetsAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var adopter = await _context.Adopters
                .FirstOrDefaultAsync(a => a.UserId == parsedUserId);
            if (adopter == null)
                throw new Exception("لم يتم العثور على حساب المتبني.");
            var adoptedPets = await _context.AdoptionRequests
                .Include(r => r.Pet)
                    .ThenInclude(p => p.Center)
                .Where(r => r.AdopterId == adopter.AdopterId && r.Status == "Approved")
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new PetResponseDto
                {
                    PetId = r.Pet.PetId,
                    Name = r.Pet.PetName,
                    Species = r.Pet.Species,
                    Breed = r.Pet.Breed,
                    Age = r.Pet.Age,
                    Gender = r.Pet.Gender,
                    Description = r.Pet.Description,
                    HealthStatus = r.Pet.HealthStatus,
                    ImageUrl = r.Pet.ImageURL,
                    CenterName = r.Pet.Center != null ? r.Pet.Center.CenterName : string.Empty
                })
                .ToListAsync();
            return adoptedPets;
        }
    }
}
```

## File: Services/AdoptionService.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;
namespace PetHaven.Services
{
    public class AdoptionService : IAdoptionService
    {
        private readonly ApplicationDbContext _context;
        public AdoptionService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<bool> SubmitRequestAsync(SubmitAdoptionRequestDto dto, string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var adopter = await _context.Adopters
                .FirstOrDefaultAsync(a => a.UserId == parsedUserId);
            if (adopter == null)
                throw new Exception("لم يتم العثور على ملف المتبني. يرجى التأكد من تسجيل الحساب كمتبنٍ.");
            adopter.HousingType     = dto.HousingType;
            adopter.HasPetBefore    = dto.HasPetBefore;
            adopter.ExperienceLevel = dto.ExperienceLevel;
            adopter.FreeHoursPerDay = dto.FreeHoursPerDay;
            int score = 0;
            if (dto.HasPetBefore)
                score += 25;
            if (dto.HousingType == "House")
                score += 25;
            else if (dto.HousingType == "Apartment")
                score += 10;
            if (dto.FreeHoursPerDay >= 4)
                score += 20;
            else if (dto.FreeHoursPerDay >= 2)
                score += 15;
            if (dto.ExperienceLevel == "Expert")
                score += 30;
            else if (dto.ExperienceLevel == "Intermediate")
                score += 20;
            else if (dto.ExperienceLevel == "Beginner")
                score += 10;
            var pet = await _context.Pets.FindAsync(dto.PetId);
            if (pet == null)
                throw new Exception("الحيوان المطلوب غير موجود أو تم اعتماده بالفعل.");
            var isBlacklisted = await _context.Blacklists
                .AnyAsync(b => b.AdopterId == adopter.AdopterId
                            && b.CenterId == pet.CenterId
                            && b.IsActive);
            if (isBlacklisted)
                throw new UnauthorizedAccessException("عذراً، لا يمكنك إرسال طلب تبني. لقد تم حظرك من قبل هذا المركز.");
            var request = new AdoptionRequest
            {
                AdopterId = adopter.AdopterId,
                PetId     = dto.PetId,
                Status    = "Pending",
                Score     = score,
                CreatedAt = DateTime.UtcNow
            };
            _context.AdoptionRequests.Add(request);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<IEnumerable<AdopterRequestResponseDto>> GetAdopterRequestsAsync(string userId)
        {
            var adopter = await ResolveAdopterAsync(userId);
            return await _context.AdoptionRequests
                .Where(r => r.AdopterId == adopter.AdopterId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new AdopterRequestResponseDto
                {
                    RequestId = r.AdoptionRequestId,
                    PetId = r.PetId,
                    PetName = r.Pet.PetName,
                    PetImage = r.Pet.ImageURL,
                    Status = r.Status ?? "Pending",
                    SubmittedAt = r.CreatedAt,
                    Score = r.Score,
                    CenterNotes = r.CenterNote,
                    Species = r.Pet.Species,
                    Breed = r.Pet.Breed,
                    Age = r.Pet.Age,
                    Gender = r.Pet.Gender,
                    HealthStatus = r.Pet.HealthStatus,
                    Description = r.Pet.Description,
                    CenterName = r.Pet.Center != null ? r.Pet.Center.CenterName : null
                })
                .ToListAsync();
        }
        public async Task<AdopterRequestResponseDto?> GetAdopterRequestAsync(int requestId, string userId)
        {
            var adopter = await ResolveAdopterAsync(userId);
            return await _context.AdoptionRequests
                .Where(r => r.AdoptionRequestId == requestId && r.AdopterId == adopter.AdopterId)
                .Select(r => new AdopterRequestResponseDto
                {
                    RequestId = r.AdoptionRequestId,
                    PetId = r.PetId,
                    PetName = r.Pet.PetName,
                    PetImage = r.Pet.ImageURL,
                    Status = r.Status ?? "Pending",
                    SubmittedAt = r.CreatedAt,
                    Score = r.Score,
                    CenterNotes = r.CenterNote,
                    Species = r.Pet.Species,
                    Breed = r.Pet.Breed,
                    Age = r.Pet.Age,
                    Gender = r.Pet.Gender,
                    HealthStatus = r.Pet.HealthStatus,
                    Description = r.Pet.Description,
                    CenterName = r.Pet.Center != null ? r.Pet.Center.CenterName : null
                })
                .FirstOrDefaultAsync();
        }
        public async Task<IEnumerable<AdoptionRequestResponseDto>> GetCenterRequestsAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var center = await _context.AdoptionCenters
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);
            if (center == null)
                throw new Exception("لم يتم العثور على ملف المركز.");
            var requests = await _context.AdoptionRequests
                .Include(r => r.Pet)
                .Include(r => r.Adopter)
                    .ThenInclude(a => a.User)
                .Where(r => r.Pet.CenterId == center.CenterId)
                .OrderByDescending(r => r.Score)
                .Select(r => new AdoptionRequestResponseDto
                {
                    RequestId   = r.AdoptionRequestId,
                    PetName     = r.Pet.PetName,
                    AdopterName = r.Adopter.User != null ? r.Adopter.User.FullName : "—",
                    Score       = r.Score,
                    Status      = r.Status ?? "Pending",
                    RequestDate = r.CreatedAt
                })
                .ToListAsync();
            return requests;
        }
        public async Task<bool> RespondToRequestAsync(int requestId, RespondToRequestDto dto, string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var request = await _context.AdoptionRequests
                .Include(r => r.Pet)
                    .ThenInclude(p => p.Center)
                .Include(r => r.Adopter)
                .FirstOrDefaultAsync(r => r.AdoptionRequestId == requestId);
            if (request == null)
                throw new Exception("الطلب غير موجود.");
            if (request.Pet?.Center?.UserId != parsedUserId)
                throw new UnauthorizedAccessException("ليس لديك صلاحية للرد على هذا الطلب.");
            request.Status     = dto.Status;
            request.CenterNote = dto.CenterNote;
            if (dto.Status == "Approved" && request.Adopter != null)
            {
                request.Adopter.LastReportDate     = DateTime.UtcNow;
                request.Adopter.MissedReportsCount = 0;
            }
            await _context.SaveChangesAsync();
            return true;
        }
        private async Task<Adopter> ResolveAdopterAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new UnauthorizedAccessException("معرّف المستخدم غير صالح.");
            var adopter = await _context.Adopters
                .FirstOrDefaultAsync(a => a.UserId == parsedUserId);
            return adopter
                ?? throw new UnauthorizedAccessException("لم يتم العثور على ملف المتبني.");
        }
    }
}
```

## File: Services/AppointmentsService.cs
```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.Models;
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public class AppointmentsService : IAppointmentsService
    {
        private static readonly TimeSpan DefaultStartTime = new(9, 0, 0);
        private static readonly TimeSpan DefaultEndTime = new(17, 0, 0);
        private const int SlotDurationMinutes = 30;
        private readonly ApplicationDbContext _context;
        public AppointmentsService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<AppointmentResponseDto>> GetVetScheduleAsync(int vetUserId, DateTime? date)
        {
            var vet = await _context.Vets.FirstOrDefaultAsync(v => v.UserId == vetUserId);
            if (vet == null) throw new UnauthorizedAccessException("هوية الطبيب غير معروفة.");
            var targetDate = date ?? DateTime.Today;
            var query = _context.Appointments
                .Where(a => a.VetId == vet.VetId && a.AppointmentDate.Date == targetDate.Date)
                .Include(a => a.Pet)
                .Include(a => a.Adopter)!.ThenInclude(ad => ad!.User)
                .OrderBy(a => a.AppointmentDate);
            var appointments = await query.ToListAsync();
            return appointments.Select(MapToDto);
        }
        public async Task<AppointmentSummaryDto> GetVetSummaryAsync(int vetUserId, DateTime? date)
        {
            var vet = await _context.Vets.FirstOrDefaultAsync(v => v.UserId == vetUserId);
            if (vet == null) throw new UnauthorizedAccessException("هوية الطبيب غير معروفة.");
            var targetDate = date ?? DateTime.Today;
            var todayAppointments = await _context.Appointments
                .Where(a => a.VetId == vet.VetId && a.AppointmentDate.Date == targetDate.Date)
                .ToListAsync();
            return new AppointmentSummaryDto
            {
                TotalToday   = todayAppointments.Count,
                PendingCount = todayAppointments.Count(a => a.Status == "Pending"),
                ConfirmedCount = todayAppointments.Count(a => a.Status == "Confirmed"),
                CancelledCount = todayAppointments.Count(a => a.Status == "Cancelled"),
                CompletedCount = todayAppointments.Count(a => a.Status == "Completed")
            };
        }
        public async Task<bool> UpdateAppointmentStatusAsync(int appointmentId, string status, int vetUserId)
        {
            var vet = await _context.Vets.FirstOrDefaultAsync(v => v.UserId == vetUserId);
            if (vet == null) throw new UnauthorizedAccessException("هوية الطبيب غير معروفة.");
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);
            if (appointment == null) return false;
            if (appointment.VetId != vet.VetId)
                throw new UnauthorizedAccessException("لا يمكنك تعديل موعد لا يخصك.");
            appointment.Status = status;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> RescheduleAppointmentAsync(int appointmentId, DateTime newDate, int vetUserId)
        {
            var vet = await _context.Vets.FirstOrDefaultAsync(v => v.UserId == vetUserId);
            if (vet == null) throw new UnauthorizedAccessException("هوية الطبيب غير معروفة.");
            if (newDate <= DateTime.Now)
                throw new ArgumentException("لا يمكن نقل الموعد إلى وقت سابق أو الحالي.");
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);
            if (appointment == null) return false;
            if (appointment.VetId != vet.VetId)
                throw new UnauthorizedAccessException("لا يمكنك تعديل موعد لا يخصك.");
            if (!await IsSlotAvailableAsync(appointment.VetId, newDate, appointment.AppointmentId))
                throw new ArgumentException("وقت الموعد المحدد لم يعد متاحًا.");
            appointment.AppointmentDate = newDate;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<IEnumerable<AdopterAppointmentDto>> GetAdopterAppointmentsAsync(int adopterUserId)
        {
            var adopter = await ResolveAdopterAsync(adopterUserId);
            return await _context.Appointments
                .Where(a => a.AdopterId == adopter.AdopterId)
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new AdopterAppointmentDto
                {
                    AppointmentId = a.AppointmentId,
                    PetId = a.PetId,
                    PetName = a.Pet != null ? a.Pet.PetName : string.Empty,
                    VetId = a.VetId,
                    VetName = a.Vet != null ? a.Vet.FullName : string.Empty,
                    AppointmentDate = a.AppointmentDate,
                    Reason = a.Reason,
                    Status = a.Status
                })
                .ToListAsync();
        }
        public async Task<AdopterAppointmentDto?> GetAdopterAppointmentAsync(int appointmentId, int adopterUserId)
        {
            var adopter = await ResolveAdopterAsync(adopterUserId);
            return await _context.Appointments
                .Where(a => a.AppointmentId == appointmentId && a.AdopterId == adopter.AdopterId)
                .Select(a => new AdopterAppointmentDto
                {
                    AppointmentId = a.AppointmentId,
                    PetId = a.PetId,
                    PetName = a.Pet != null ? a.Pet.PetName : string.Empty,
                    VetId = a.VetId,
                    VetName = a.Vet != null ? a.Vet.FullName : string.Empty,
                    AppointmentDate = a.AppointmentDate,
                    Reason = a.Reason,
                    Status = a.Status
                })
                .FirstOrDefaultAsync();
        }
        public async Task<AppointmentAvailabilityDto> GetAvailableSlotsAsync(int vetId, DateTime date)
        {
            if (vetId <= 0)
                throw new ArgumentException("معرّف الطبيب غير صالح.");
            var vet = await _context.Vets
                .AsNoTracking()
                .FirstOrDefaultAsync(v => v.VetId == vetId);
            if (vet == null)
                throw new KeyNotFoundException("الطبيب البيطري المطلوب غير موجود.");
            if (!vet.IsVerified)
                throw new ArgumentException("الطبيب البيطري غير متاح للحجز حاليًا.");
            var requestedDate = date.Date;
            if (requestedDate < DateTime.Today)
                throw new ArgumentException("لا يمكن عرض مواعيد متاحة لتاريخ سابق.");
            var dayStart = requestedDate;
            var dayEnd = requestedDate.AddDays(1);
            var slotDuration = TimeSpan.FromMinutes(SlotDurationMinutes);
            var busyStarts = await _context.Appointments
                .AsNoTracking()
                .Where(a => a.VetId == vetId
                    && a.Status != "Cancelled"
                    && a.AppointmentDate < dayEnd
                    && a.AppointmentDate.AddMinutes(SlotDurationMinutes) > dayStart)
                .Select(a => a.AppointmentDate)
                .ToListAsync();
            var now = DateTime.Now;
            var availableSlots = new List<string>();
            for (var slotStart = requestedDate.Add(DefaultStartTime);
                 slotStart.Add(slotDuration) <= requestedDate.Add(DefaultEndTime);
                 slotStart = slotStart.Add(slotDuration))
            {
                if (requestedDate == now.Date && slotStart <= now)
                    continue;
                var slotEnd = slotStart.Add(slotDuration);
                var overlaps = busyStarts.Any(existingStart =>
                    existingStart < slotEnd && existingStart.Add(slotDuration) > slotStart);
                if (!overlaps)
                    availableSlots.Add(slotStart.ToString("HH:mm"));
            }
            return new AppointmentAvailabilityDto
            {
                VetId = vetId,
                Date = requestedDate.ToString("yyyy-MM-dd"),
                SlotDurationMinutes = SlotDurationMinutes,
                AvailableSlots = availableSlots
            };
        }
        public async Task<bool> RescheduleAdopterAppointmentAsync(
            int appointmentId,
            DateTime newDate,
            int adopterUserId)
        {
            if (newDate <= DateTime.Now)
                throw new ArgumentException("لا يمكن نقل الموعد إلى وقت سابق أو الحالي.");
            var adopter = await ResolveAdopterAsync(adopterUserId);
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);
            if (appointment == null) return false;
            if (appointment.AdopterId != adopter.AdopterId)
                throw new UnauthorizedAccessException("لا يمكنك تعديل موعد لا يخصك.");
            if (appointment.Status != "Pending" && appointment.Status != "Confirmed")
                throw new ArgumentException("يمكن إعادة جدولة المواعيد المعلقة أو المؤكدة فقط.");
            if (!await IsSlotAvailableAsync(appointment.VetId, newDate, appointment.AppointmentId))
                throw new ArgumentException("وقت الموعد المحدد لم يعد متاحًا.");
            appointment.AppointmentDate = newDate;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<Appointment> BookAppointmentAsync(CreateAppointmentDto dto, int currentUserId)
        {
            if (dto.AppointmentDate <= DateTime.Now)
            {
                throw new ArgumentException("لا يمكن حجز موعد في وقت سابق أو في الوقت الحالي.");
            }
            var vet = await _context.Vets
                .AsNoTracking()
                .FirstOrDefaultAsync(v => v.VetId == dto.VetId);
            if (vet == null)
            {
                throw new KeyNotFoundException("فشل الحجز: المعرّف المرسل لا يخص طبيباً بيطرياً مسجلاً في النظام.");
            }
            if (!vet.IsVerified)
                throw new ArgumentException("الطبيب البيطري غير متاح للحجز حاليًا.");
            var adopter = await _context.Adopters.FirstOrDefaultAsync(a => a.UserId == currentUserId);
            if (adopter == null)
            {
                throw new UnauthorizedAccessException("يوجد خطأ في بيانات المربي (السجل غير موجود)");
            }
            if (!await IsSlotAvailableAsync(dto.VetId, dto.AppointmentDate))
                throw new ArgumentException("وقت الموعد المحدد لم يعد متاحًا.");
            var appointment = new Appointment
            {
                AdopterId = adopter.AdopterId,
                PetId = dto.PetId,
                VetId = dto.VetId,
                AppointmentDate = dto.AppointmentDate,
                Reason = dto.Reason,
                Status = "Pending"
            };
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }
        public async Task<bool> CancelAppointmentAsync(int appointmentId, int adopterUserId)
        {
            var adopter = await _context.Adopters.FirstOrDefaultAsync(a => a.UserId == adopterUserId);
            if (adopter == null) throw new UnauthorizedAccessException("هوية المربي غير معروفة.");
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);
            if (appointment == null) return false;
            if (appointment.AdopterId != adopter.AdopterId)
                throw new UnauthorizedAccessException("لا يمكنك إلغاء موعد لا يخصك.");
            appointment.Status = "Cancelled";
            await _context.SaveChangesAsync();
            return true;
        }
        private AppointmentResponseDto MapToDto(Appointment a)
        {
            return new AppointmentResponseDto
            {
                AppointmentId   = a.AppointmentId,
                PetId           = a.PetId,
                PetName         = a.Pet?.PetName ?? "غير معروف",
                Species         = a.Pet?.Species,
                Breed           = a.Pet?.Breed,
                PetImageUrl     = a.Pet?.ImageURL,
                OwnerName       = a.Adopter?.User?.FullName ?? "غير معروف",
                AppointmentDate = a.AppointmentDate,
                Status          = a.Status,
                Reason          = a.Reason,
                TimeDisplay     = a.AppointmentDate.ToString("hh:mm tt")
            };
        }
        private async Task<Adopter> ResolveAdopterAsync(int adopterUserId)
        {
            return await _context.Adopters
                .FirstOrDefaultAsync(a => a.UserId == adopterUserId)
                ?? throw new UnauthorizedAccessException("هوية المربي غير معروفة.");
        }
        private async Task<bool> IsSlotAvailableAsync(
            int vetId,
            DateTime appointmentDate,
            int? excludeAppointmentId = null)
        {
            if (appointmentDate <= DateTime.Now || !IsConfiguredSlot(appointmentDate))
                return false;
            var slotEnd = appointmentDate.AddMinutes(SlotDurationMinutes);
            return !await _context.Appointments
                .AsNoTracking()
                .AnyAsync(a => a.VetId == vetId
                    && (!excludeAppointmentId.HasValue || a.AppointmentId != excludeAppointmentId.Value)
                    && a.Status != "Cancelled"
                    && a.AppointmentDate < slotEnd
                    && a.AppointmentDate.AddMinutes(SlotDurationMinutes) > appointmentDate);
        }
        private static bool IsConfiguredSlot(DateTime appointmentDate)
        {
            var time = appointmentDate.TimeOfDay;
            var slotDuration = TimeSpan.FromMinutes(SlotDurationMinutes);
            return time >= DefaultStartTime
                && time.Add(slotDuration) <= DefaultEndTime
                && (time - DefaultStartTime).Ticks % slotDuration.Ticks == 0;
        }
    }
}
```

## File: Services/AuthService.cs
```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Helpers;
using PetHaven.Models;
namespace PetHaven.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtHelper _jwtHelper;
        private readonly IConfiguration _configuration;
        public AuthService(ApplicationDbContext context, JwtHelper jwtHelper, IConfiguration configuration)
        {
            _context = context;
            _jwtHelper = jwtHelper;
            _configuration = configuration;
        }
        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var emailExists = await _context.Users
                .AnyAsync(u => u.Email == dto.Email);
            if (emailExists)
                throw new Exception("البريد الإلكتروني مستخدم بالفعل!");
            var userNameExists = await _context.Users
                .AnyAsync(u => u.UserName == dto.UserName);
            if (userNameExists)
                throw new Exception("اسم المستخدم مستخدم بالفعل!");
            var mappedRole = dto.Role.Trim() switch
            {
                "Pet Owner"       => "Adopter",
                "Veterinarian"    => "Vet",
                "Adoption Center" => "AdoptionCenter",
                _                 => throw new Exception($"الدور '{dto.Role}' غير مدعوم. الأدوار المقبولة: Pet Owner, Veterinarian, Adoption Center.")
            };
            var role = await _context.Roles
                .FirstOrDefaultAsync(r => r.RoleName == mappedRole);
            if (role == null)
                throw new Exception($"الدور '{mappedRole}' غير موجود في قاعدة البيانات! أضف الأدوار أولاً.");
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var user = new User
            {
                FullName    = dto.FullName,
                UserName    = dto.UserName,
                PhoneNumber = dto.PhoneNumber,
                Email       = dto.Email,
                Password    = hashedPassword,
                RoleId      = role.RoleId
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            switch (mappedRole)
            {
                case "Adopter":
                    var adopter = new Adopter
                    {
                        UserId             = user.UserId,
                        Address            = null,
                        HousingType        = null,
                        HasPetBefore       = false,
                        ExperienceLevel    = null,
                        MissedReportsCount = 0,
                        LastReportDate     = null,
                        Balance            = 0
                    };
                    _context.Adopters.Add(adopter);
                    var cart = new Cart
                    {
                        UserId    = user.UserId,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.Carts.Add(cart);
                    break;
                case "AdoptionCenter":
                    var center = new AdoptionCenter
                    {
                        UserId     = user.UserId,
                        CenterName = dto.FullName,
                        Address    = null,
                        ContactInfo = null
                    };
                    _context.AdoptionCenters.Add(center);
                    break;
                case "Vet":
                    var vet = new Vet
                    {
                        UserId          = user.UserId,
                        FullName        = dto.FullName,
                        Email           = dto.Email,
                        PhoneNumber     = dto.PhoneNumber,
                    };
                    _context.Vets.Add(vet);
                    break;
            }
            await _context.SaveChangesAsync();
            var expiryInMinutes = _configuration.GetValue<int>("Jwt:ExpiryInMinutes", 20);
            var token = _jwtHelper.GenerateToken(user, role.RoleName);
            return new AuthResponseDto
            {
                Token        = token,
                RefreshToken = _jwtHelper.GenerateRefreshToken(),
                ExpiresAt    = DateTime.UtcNow.AddMinutes(expiryInMinutes),
                User = new UserDto
                {
                    UserId      = user.UserId,
                    UserName    = user.UserName,
                    FullName    = user.FullName,
                    Email       = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Role        = role.RoleName
                }
            };
        }
        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null)
                throw new Exception("البريد الإلكتروني أو كلمة المرور غير صحيحة!");
            var isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password);
            if (!isPasswordValid)
                throw new Exception("البريد الإلكتروني أو كلمة المرور غير صحيحة!");
            var expiryInMinutes = _configuration.GetValue<int>("Jwt:ExpiryInMinutes", 20);
            var token = _jwtHelper.GenerateToken(user, user.Role?.RoleName ?? "User");
            return new AuthResponseDto
            {
                Token        = token,
                RefreshToken = _jwtHelper.GenerateRefreshToken(),
                ExpiresAt    = DateTime.UtcNow.AddMinutes(expiryInMinutes),
                User = new UserDto
                {
                    UserId      = user.UserId,
                    UserName    = user.UserName,
                    FullName    = user.FullName,
                    Email       = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Role        = user.Role?.RoleName ?? "User"
                }
            };
        }
    }
}
```

## File: Services/BlacklistService.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;
namespace PetHaven.Services
{
    public class BlacklistService : IBlacklistService
    {
        private readonly ApplicationDbContext _context;
        public BlacklistService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<bool> BanAdopterAsync(BanAdopterDto dto, string centerUserId)
        {
            if (!int.TryParse(centerUserId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var center = await _context.AdoptionCenters
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);
            if (center == null)
                throw new Exception("لم يتم العثور على ملف المركز.");
            var existingBan = await _context.Blacklists
                .AnyAsync(b => b.CenterId  == center.CenterId
                            && b.AdopterId == dto.AdopterId
                            && b.IsActive  == true);
            if (existingBan)
                throw new Exception("هذا المتبني محظور بالفعل لدى مركزكم.");
            var ban = new Blacklist
            {
                CenterId   = center.CenterId,
                AdopterId  = dto.AdopterId,
                Reason     = dto.Reason,
                BlockedAt  = DateTime.UtcNow,
                IsActive   = true
            };
            _context.Blacklists.Add(ban);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<IEnumerable<BlacklistResponseDto>> GetCenterBlacklistAsync(string centerUserId)
        {
            if (!int.TryParse(centerUserId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var center = await _context.AdoptionCenters
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);
            if (center == null)
                throw new Exception("لم يتم العثور على ملف المركز.");
            var blacklist = await _context.Blacklists
                .Include(b => b.Adopter)
                    .ThenInclude(a => a!.User)
                .Where(b => b.CenterId == center.CenterId && b.IsActive == true)
                .OrderByDescending(b => b.BlockedAt)
                .Select(b => new BlacklistResponseDto
                {
                    BlacklistId = b.BlacklistId,
                    AdopterName = b.Adopter != null && b.Adopter.User != null
                                    ? b.Adopter.User.FullName
                                    : "—",
                    Reason      = b.Reason ?? string.Empty,
                    BanDate     = b.BlockedAt,
                    IsActive    = b.IsActive
                })
                .ToListAsync();
            return blacklist;
        }
        public async Task<bool> UnbanAdopterAsync(int adopterId, string centerUserId)
        {
            if (!int.TryParse(centerUserId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var center = await _context.AdoptionCenters
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);
            if (center == null)
                throw new Exception("لم يتم العثور على ملف المركز.");
            var ban = await _context.Blacklists
                .FirstOrDefaultAsync(b => b.CenterId  == center.CenterId
                                       && b.AdopterId == adopterId
                                       && b.IsActive  == true);
            if (ban == null)
                throw new Exception("لا يوجد حظر نشط لهذا المتبني في مركزكم.");
            ban.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
```

## File: Services/CartService.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;
namespace PetHaven.Services
{
    public class CartService : ICartService
    {
        private readonly ApplicationDbContext _context;
        public CartService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<CartResponseDto> GetUserCartAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");
            var cart = await _context.Carts
                .Include(c => c.CartItems!)
                    .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);
            if (cart == null)
                return new CartResponseDto { CartId = 0, CartTotal = 0, Items = new List<CartItemResponseDto>() };
            var items = cart.CartItems?
                .Where(ci => ci.Product != null)
                .Select(ci =>
                {
                    var unitPrice  = ci.Product!.ProductPrice * (1 - ci.Product.DiscountRate);
                    var totalPrice = unitPrice * ci.Quantity;
                    return new CartItemResponseDto
                    {
                        CartItemId  = ci.CartItemId,
                        ProductId   = ci.ProductId,
                        ProductName = ci.Product.Name,
                        Quantity    = ci.Quantity,
                        UnitPrice   = Math.Round(unitPrice,  2),
                        TotalPrice  = Math.Round(totalPrice, 2)
                    };
                })
                .ToList() ?? new List<CartItemResponseDto>();
            var cartTotal = items.Sum(i => i.TotalPrice);
            return new CartResponseDto
            {
                CartId    = cart.CartId,
                CartTotal = Math.Round(cartTotal, 2),
                Items     = items
            };
        }
        public async Task AddToCartAsync(AddToCartRequestDto dto, string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);
            if (cart == null)
            {
                cart = new Cart
                {
                    UserId    = parsedUserId,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }
            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null)
                throw new Exception("Product not found.");
            if (dto.Quantity > product.StockQuantity)
                throw new Exception($"Insufficient stock. Only {product.StockQuantity} unit(s) available.");
            var existingItem = cart.CartItems?
                .FirstOrDefault(ci => ci.ProductId == dto.ProductId);
            if (existingItem != null)
            {
                var newQuantity = existingItem.Quantity + dto.Quantity;
                if (newQuantity > product.StockQuantity)
                    throw new Exception($"Insufficient stock. You already have {existingItem.Quantity} in your cart. Only {product.StockQuantity} unit(s) available in total.");
                existingItem.Quantity = newQuantity;
            }
            else
            {
                var newItem = new CartItem
                {
                    CartId    = cart.CartId,
                    ProductId = dto.ProductId,
                    Quantity  = dto.Quantity
                };
                _context.CartItems.Add(newItem);
            }
            await _context.SaveChangesAsync();
        }
        public async Task UpdateCartItemQuantityAsync(int cartItemId, UpdateCartItemRequestDto dto, string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");
            var cartItem = await _context.CartItems
                .Include(ci => ci.Cart)
                .Include(ci => ci.Product)
                .FirstOrDefaultAsync(ci => ci.CartItemId == cartItemId);
            if (cartItem == null)
                throw new Exception("Cart item not found.");
            if (cartItem.Cart?.UserId != parsedUserId)
                throw new UnauthorizedAccessException("You do not have permission to modify this cart item.");
            if (cartItem.Product == null)
                throw new Exception("The product associated with this cart item no longer exists.");
            if (dto.Quantity > cartItem.Product.StockQuantity)
                throw new Exception($"Insufficient stock. Only {cartItem.Product.StockQuantity} unit(s) available.");
            cartItem.Quantity = dto.Quantity;
            await _context.SaveChangesAsync();
        }
        public async Task RemoveFromCartAsync(int cartItemId, string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");
            var cartItem = await _context.CartItems
                .Include(ci => ci.Cart)
                .FirstOrDefaultAsync(ci => ci.CartItemId == cartItemId);
            if (cartItem == null)
                throw new Exception("Cart item not found.");
            if (cartItem.Cart?.UserId != parsedUserId)
                throw new UnauthorizedAccessException("You do not have permission to remove this cart item.");
            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
        }
        public async Task ClearCartAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);
            if (cart == null || cart.CartItems == null || !cart.CartItems.Any())
                return;
            _context.CartItems.RemoveRange(cart.CartItems);
            await _context.SaveChangesAsync();
        }
    }
}
```

## File: Services/CenterDashboardService.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public class CenterDashboardService : ICenterDashboardService
    {
        private readonly ApplicationDbContext _context;
        public CenterDashboardService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<CenterDashboardStatsDto> GetDashboardStatsAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var center = await _context.AdoptionCenters
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);
            if (center == null)
                throw new Exception("لم يتم العثور على حساب المركز.");
            var today = DateTime.UtcNow.Date;
            var startOfMonth = new DateTime(today.Year, today.Month, 1);
            var availablePetsCount = await _context.Pets
                .CountAsync(p => p.CenterId == center.CenterId);
            var pendingRequestsCount = await _context.AdoptionRequests
                .Include(r => r.Pet)
                .CountAsync(r => r.Pet.CenterId == center.CenterId && r.Status == "Pending");
            var successfulAdoptionsThisMonth = await _context.AdoptionRequests
                .Include(r => r.Pet)
                .CountAsync(r => r.Pet.CenterId == center.CenterId
                                 && r.Status == "Approved"
                                 && r.CreatedAt >= startOfMonth);
            var storeSalesToday = await _context.Orders
                .Where(o => o.UserId == parsedUserId && o.OrderDate.Date == today && o.Status == "Paid")
                .SumAsync(o => o.TotalPrice);
            return new CenterDashboardStatsDto
            {
                AvailablePetsCount = availablePetsCount,
                PendingRequestsCount = pendingRequestsCount,
                SuccessfulAdoptionsThisMonth = successfulAdoptionsThisMonth,
                StoreSalesToday = storeSalesToday
            };
        }
        public async Task<IEnumerable<OrderResponseDto>> GetLatestOrdersAsync(string userId, int count = 5)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            return await _context.Orders
                .Where(o => o.UserId == parsedUserId)
                .Include(o => o.OrderItems!)
                    .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.OrderDate)
                .Take(count)
                .Select(o => new OrderResponseDto
                {
                    OrderId = o.OrderId,
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalPrice,
                    Status = o.Status ?? string.Empty,
                    Items = o.OrderItems != null
                        ? o.OrderItems.Select(oi => new OrderItemDto
                        {
                            ProductId = oi.ProductId,
                            ProductName = oi.Product != null ? oi.Product.Name : string.Empty,
                            Quantity = oi.Quantity,
                            UnitPrice = oi.UnitPrice
                        }).ToList()
                        : new List<OrderItemDto>()
                })
                .ToListAsync();
        }
        public async Task<IEnumerable<RecentAdoptionDto>> GetRecentAdoptionsAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var center = await _context.AdoptionCenters
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);
            if (center == null)
                throw new Exception("لم يتم العثور على حساب المركز.");
            return await _context.AdoptionRequests
                .Include(r => r.Pet)
                .Where(r => r.Pet.CenterId == center.CenterId && r.Status == "Approved")
                .OrderByDescending(r => r.CreatedAt)
                .Take(3)
                .Select(r => new RecentAdoptionDto
                {
                    PetName = r.Pet.PetName,
                    PetImageUrl = r.Pet.ImageURL,
                    AdoptedDate = r.CreatedAt
                })
                .ToListAsync();
        }
        public async Task<IEnumerable<RecentProductSaleDto>> GetRecentProductSalesAsync(string userId, int count = 3)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var center = await _context.AdoptionCenters
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);
            if (center == null)
                throw new Exception("لم يتم العثور على حساب المركز.");
            return await _context.OrderItems
                .Include(oi => oi.Order)
                .Include(oi => oi.Product)
                .Where(oi => oi.Product.CenterId == center.CenterId
                             && oi.Order.Status == "Paid")
                .OrderByDescending(oi => oi.Order.OrderDate)
                .Take(count)
                .Select(oi => new RecentProductSaleDto
                {
                    ProductName = oi.Product != null ? oi.Product.Name : "غير معروف",
                    Price = oi.UnitPrice,
                    SoldDate = oi.Order.OrderDate,
                    ProductImageUrl = oi.Product != null ? oi.Product.ImageURL : null
                })
                .ToListAsync();
        }
    }
}
```

## File: Services/IAdopterDashboardService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface IAdopterDashboardService
    {
        Task<AdopterDashboardDto> GetAdopterDashboardAsync(string userId);
        Task<IEnumerable<PetResponseDto>> GetAdoptedPetsAsync(string userId);
    }
}
```

## File: Services/IAdoptionService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface IAdoptionService
    {
        Task<bool> SubmitRequestAsync(SubmitAdoptionRequestDto dto, string userId);
        Task<IEnumerable<AdopterRequestResponseDto>> GetAdopterRequestsAsync(string userId);
        Task<AdopterRequestResponseDto?> GetAdopterRequestAsync(int requestId, string userId);
        Task<IEnumerable<AdoptionRequestResponseDto>> GetCenterRequestsAsync(string userId);
        Task<bool> RespondToRequestAsync(int requestId, RespondToRequestDto dto, string userId);
    }
}
```

## File: Services/IAppointmentsService.cs
```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PetHaven.Models;
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface IAppointmentsService
    {
        Task<IEnumerable<AppointmentResponseDto>> GetVetScheduleAsync(int vetUserId, DateTime? date);
        Task<AppointmentSummaryDto> GetVetSummaryAsync(int vetUserId, DateTime? date);
        Task<bool> UpdateAppointmentStatusAsync(int appointmentId, string status, int vetUserId);
        Task<bool> RescheduleAppointmentAsync(int appointmentId, DateTime newDate, int vetUserId);
        Task<IEnumerable<AdopterAppointmentDto>> GetAdopterAppointmentsAsync(int adopterUserId);
        Task<AdopterAppointmentDto?> GetAdopterAppointmentAsync(int appointmentId, int adopterUserId);
        Task<AppointmentAvailabilityDto> GetAvailableSlotsAsync(int vetId, DateTime date);
        Task<bool> RescheduleAdopterAppointmentAsync(int appointmentId, DateTime newDate, int adopterUserId);
        Task<Appointment> BookAppointmentAsync(CreateAppointmentDto dto, int currentUserId);
        Task<bool> CancelAppointmentAsync(int appointmentId, int adopterUserId);
    }
}
```

## File: Services/IAuthService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
    }
}
```

## File: Services/IBlacklistService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface IBlacklistService
    {
        Task<bool> BanAdopterAsync(BanAdopterDto dto, string centerUserId);
        Task<IEnumerable<BlacklistResponseDto>> GetCenterBlacklistAsync(string centerUserId);
        Task<bool> UnbanAdopterAsync(int adopterId, string centerUserId);
    }
}
```

## File: Services/ICartService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface ICartService
    {
        Task<CartResponseDto> GetUserCartAsync(string userId);
        Task AddToCartAsync(AddToCartRequestDto dto, string userId);
        Task UpdateCartItemQuantityAsync(int cartItemId, UpdateCartItemRequestDto dto, string userId);
        Task RemoveFromCartAsync(int cartItemId, string userId);
        Task ClearCartAsync(string userId);
    }
}
```

## File: Services/ICenterDashboardService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface ICenterDashboardService
    {
        Task<CenterDashboardStatsDto> GetDashboardStatsAsync(string userId);
        Task<IEnumerable<OrderResponseDto>> GetLatestOrdersAsync(string userId, int count = 5);
        Task<IEnumerable<RecentAdoptionDto>> GetRecentAdoptionsAsync(string userId);
        Task<IEnumerable<RecentProductSaleDto>> GetRecentProductSalesAsync(string userId, int count = 3);
    }
}
```

## File: Services/IOrderService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface IOrderService
    {
        Task<OrderResponseDto> CheckoutAsync(string userId);
        Task<IEnumerable<OrderResponseDto>> GetAdopterOrdersAsync(string userId);
        Task UpdateOrderStatusAsync(int orderId, string status);
    }
}
```

## File: Services/IPatientsService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface IPatientsService
    {
        Task<VetPatientsStatsDto> GetPatientsStatsAsync(string userId);
        Task<PatientListPageDto> GetPatientsAsync(string userId, string? search, string? species, string? status, int page, int pageSize);
        Task<PatientDetailDto> GetPatientDetailAsync(string userId, int petId);
        Task<IEnumerable<MedicalHistoryEntryDto>> GetMedicalHistoryAsync(string userId, int petId);
        Task<IEnumerable<VaccinationDto>> GetPetVaccinationsAsync(string userId, int petId);
        Task<VaccinationDto> AddVaccinationAsync(string userId, int petId, VaccinationRequestDto dto);
        Task<VaccinationDto> UpdateVaccinationAsync(string userId, int vaccinationId, VaccinationRequestDto dto);
        Task<bool> DeleteVaccinationAsync(string userId, int vaccinationId);
    }
}
```

## File: Services/IPaymentService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface IPaymentService
    {
        Task<bool> ProcessPaymentAsync(PaymentRequestDto dto, string userId);
    }
}
```

## File: Services/IPetReportService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface IPetReportService
    {
        Task<PetReportResponseDto> SubmitReportAsync(CreatePetReportDto dto, string userId);
        Task<IEnumerable<PetReportResponseDto>> GetCenterReportsAsync(string userId);
    }
}
```

## File: Services/IPetService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface IPetService
    {
        Task<PetResponseDto> AddPetAsync(CreatePetDto dto, string userId);
        Task<IEnumerable<PetResponseDto>> GetAllAvailablePetsAsync();
        Task<IEnumerable<PetResponseDto>> GetPetsByCenterAsync(string userId);
        Task<PetResponseDto> UpdatePetAsync(int petId, UpdatePetDto dto, string userId);
        Task DeletePetAsync(int petId, string userId);
        Task<PetResponseDto?> GetPetByIdAsync(int petId);
    }
}
```

## File: Services/IProductRatingService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface IProductRatingService
    {
        Task<ProductRatingResponseDto> AddRatingAsync(string userId, ProductRatingRequestDto request);
        Task<IEnumerable<ProductRatingResponseDto>> GetProductRatingsAsync(int productId);
        Task<CenterProductReviewsResponseDto> GetCenterReviewsAsync(string userId);
    }
}
```

## File: Services/IProfileService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface IProfileService
    {
        Task<UserProfileDto> GetUserProfileAsync(string userId);
        Task<bool> UpdateAdopterProfileAsync(string userId, UpdateAdopterProfileDto dto);
        Task<bool> UpdateCenterProfileAsync(string userId, UpdateCenterProfileDto dto);
        Task<bool> UpdateVetProfileAsync(string userId, UpdateVetProfileDto dto);
    }
}
```

## File: Services/IRecommendationAiService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface IRecommendationAiService
    {
        Task<object> GetServicesAsync(AiRecommendationRequestDto requestData);
    }
}
```

## File: Services/IReviewsService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface IReviewsService
    {
        Task<ReviewsListResponseDto> GetClientReviewsAsync(int vetUserId, string? search, string? filter, int page, int pageSize);
    }
}
```

## File: Services/IStoreCatalogService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface IStoreCatalogService
    {
        Task<IEnumerable<CategoryResponseDto>> GetAllCategoriesAsync();
        Task<IEnumerable<ProductResponseDto>> GetAllAvailableProductsAsync();
        Task<IEnumerable<ProductResponseDto>> GetCenterProductsAsync(string userId);
        Task<ProductResponseDto> AddProductAsync(ProductRequestDto dto, string userId);
        Task<ProductResponseDto> UpdateProductAsync(int productId, ProductRequestDto dto, string userId);
        Task DeleteProductAsync(int productId, string userId);
        Task<ProductDetailDto?> GetProductByIdAsync(int productId);
    }
}
```

## File: Services/IVetDashboardService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface IVetDashboardService
    {
        Task<VetDashboardStatsDto> GetDashboardStatsAsync(string userId);
        Task<IEnumerable<ClinicActivityPointDto>> GetClinicActivityAsync(string userId, string period);
        Task<IEnumerable<AppointmentBreakdownDto>> GetAppointmentBreakdownAsync(string userId);
        Task<IEnumerable<TopBreedDto>> GetTopBreedsAsync(string userId, int limit);
        Task<IEnumerable<RecentPatientDto>> GetRecentPatientsAsync(string userId, int count, string? search);
        Task<IEnumerable<AppointmentResponseDto>> GetTodayScheduleAsync(string userId);
    }
}
```

## File: Services/IVetRatingService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface IVetRatingService
    {
        Task<VetRatingResponseDto> AddRatingAsync(string userId, VetRatingRequestDto request);
        Task<double> GetVetAverageRatingAsync(int vetId);
    }
}
```

## File: Services/IVetService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface IVetService
    {
        Task<IEnumerable<VetResponseDto>> GetAllVetsAsync();
        Task<IEnumerable<VetResponseDto>> SearchVetsAsync(VetSearchDto searchDto);
        Task<VetResponseDto?> GetVetByIdAsync(int vetId);
    }
}
```

## File: Services/IWishlistService.cs
```csharp
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public interface IWishlistService
    {
        Task<IEnumerable<WishlistResponseDto>> GetUserWishlistAsync(string userId);
        Task AddToWishlistAsync(int productId, string userId);
        Task RemoveFromWishlistAsync(int productId, string userId);
    }
}
```

## File: Services/OrderService.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;
namespace PetHaven.Services
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _context;
        public OrderService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<OrderResponseDto> CheckoutAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");
            var cart = await _context.Carts
                .Include(c => c.CartItems!)
                    .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);
            if (cart == null || cart.CartItems == null || !cart.CartItems.Any())
                throw new Exception("Your cart is empty. Please add items before checking out.");
            var order = new Order
            {
                UserId    = parsedUserId,
                OrderDate = DateTime.UtcNow,
                Status    = "Pending",
                TotalPrice = 0
            };
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            decimal total = 0;
            var orderItems = new List<OrderItem>();
            foreach (var cartItem in cart.CartItems)
            {
                if (cartItem.Product == null) continue;
                if (cartItem.Quantity > cartItem.Product.StockQuantity)
                    throw new InvalidOperationException(
                        $"Not enough stock for product: {cartItem.Product.Name}. " +
                        $"Requested: {cartItem.Quantity}, Available: {cartItem.Product.StockQuantity}.");
                var unitPrice = cartItem.Product.ProductPrice * (1 - cartItem.Product.DiscountRate);
                var orderItem = new OrderItem
                {
                    OrderId         = order.OrderId,
                    ProductId       = cartItem.ProductId,
                    Quantity        = cartItem.Quantity,
                    UnitPrice       = Math.Round(unitPrice, 2),
                    PriceAtPurchase = Math.Round(unitPrice, 2)
                };
                cartItem.Product.StockQuantity -= cartItem.Quantity;
                orderItems.Add(orderItem);
                total += orderItem.UnitPrice * orderItem.Quantity;
            }
            _context.OrderItems.AddRange(orderItems);
            order.TotalPrice = Math.Round(total, 2);
            _context.CartItems.RemoveRange(cart.CartItems);
            await _context.SaveChangesAsync();
            return MapToDto(order, orderItems, cart.CartItems.ToList());
        }
        public async Task<IEnumerable<OrderResponseDto>> GetAdopterOrdersAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");
            var orders = await _context.Orders
                .Where(o => o.UserId == parsedUserId)
                .Include(o => o.OrderItems!)
                    .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
            return orders.Select(o => new OrderResponseDto
            {
                OrderId     = o.OrderId,
                OrderDate   = o.OrderDate,
                TotalAmount = o.TotalPrice,
                Status      = o.Status ?? string.Empty,
                Items       = o.OrderItems?
                    .Select(oi => new OrderItemDto
                    {
                        ProductId   = oi.ProductId,
                        ProductName = oi.Product?.Name ?? string.Empty,
                        Quantity    = oi.Quantity,
                        UnitPrice   = oi.UnitPrice
                    })
                    .ToList() ?? new List<OrderItemDto>()
            });
        }
        public async Task UpdateOrderStatusAsync(int orderId, string status)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
                throw new Exception($"Order with ID {orderId} was not found.");
            order.Status = status;
            await _context.SaveChangesAsync();
        }
        private static OrderResponseDto MapToDto(Order order, List<OrderItem> orderItems, List<CartItem> originalCartItems)
        {
            var productNames = originalCartItems
                .Where(ci => ci.Product != null)
                .ToDictionary(ci => ci.ProductId, ci => ci.Product!.Name);
            return new OrderResponseDto
            {
                OrderId     = order.OrderId,
                OrderDate   = order.OrderDate,
                TotalAmount = order.TotalPrice,
                Status      = order.Status ?? string.Empty,
                Items       = orderItems.Select(oi => new OrderItemDto
                {
                    ProductId   = oi.ProductId,
                    ProductName = productNames.TryGetValue(oi.ProductId, out var name) ? name : string.Empty,
                    Quantity    = oi.Quantity,
                    UnitPrice   = oi.UnitPrice
                }).ToList()
            };
        }
    }
}
```

## File: Services/PatientsService.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;
namespace PetHaven.Services
{
    public class PatientsService : IPatientsService
    {
        private readonly ApplicationDbContext _context;
        public PatientsService(ApplicationDbContext context)
        {
            _context = context;
        }
        private async Task<Vet> GetVetAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var vet = await _context.Vets
                .FirstOrDefaultAsync(v => v.UserId == parsedUserId);
            if (vet == null)
                throw new Exception("لم يتم العثور على حساب الطبيب البيطري.");
            return vet;
        }
        private async Task EnsurePetBelongsToVetAsync(int vetId, int petId)
        {
            var exists = await _context.Appointments
                .AnyAsync(a => a.VetId == vetId && a.PetId == petId);
            if (!exists)
                throw new UnauthorizedAccessException("هذا المريض لا يخص عيادتك.");
        }
        public async Task<VetPatientsStatsDto> GetPatientsStatsAsync(string userId)
        {
            var vet = await GetVetAsync(userId);
            var from30DaysAgo = DateTime.UtcNow.Date.AddDays(-30);
            var patientGroups = await _context.Appointments
                .Where(a => a.VetId == vet.VetId)
                .GroupBy(a => a.PetId)
                .Select(g => new
                {
                    PetId = g.Key,
                    FirstVisit = g.Min(a => a.AppointmentDate),
                    HasActive = g.Any(a => a.Status != "Completed" && a.Status != "Cancelled")
                })
                .ToListAsync();
            return new VetPatientsStatsDto
            {
                TotalPatients = patientGroups.Count,
                ActiveCases = patientGroups.Count(p => p.HasActive),
                RecentlyAdded30d = patientGroups.Count(p => p.FirstVisit.Date >= from30DaysAgo)
            };
        }
        public async Task<PatientListPageDto> GetPatientsAsync(string userId, string? search, string? species, string? status, int page, int pageSize)
        {
            var vet = await GetVetAsync(userId);
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 12;
            var query = _context.Appointments
                .Where(a => a.VetId == vet.VetId && a.Pet != null)
                .GroupBy(a => new
                {
                    a.PetId,
                    a.Pet!.PetName,
                    a.Pet.Species,
                    a.Pet.Breed,
                    a.Pet.Age,
                    a.Pet.Gender,
                    a.Pet.ImageURL,
                    a.Pet.HealthStatus
                })
                .Select(g => new PatientListDto
                {
                    PetId = g.Key.PetId,
                    PetName = g.Key.PetName,
                    Species = g.Key.Species,
                    Breed = g.Key.Breed,
                    Age = g.Key.Age,
                    Gender = g.Key.Gender,
                    ImageUrl = g.Key.ImageURL,
                    HealthStatus = g.Key.HealthStatus,
                    LastVisitDate = g.Max(a => a.AppointmentDate),
                    VisitCount = g.Count()
                });
            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();
                query = query.Where(p => p.PetName.Contains(term)
                                         || (p.Breed != null && p.Breed.Contains(term))
                                         || (p.Species != null && p.Species.Contains(term)));
            }
            if (!string.IsNullOrWhiteSpace(species))
            {
                var sp = species.Trim();
                query = query.Where(p => p.Species != null && p.Species.Contains(sp));
            }
            var items = await query
                .OrderByDescending(p => p.LastVisitDate)
                .ToListAsync();
            await EnrichPatientsAsync(vet.VetId, items);
            if (!string.IsNullOrWhiteSpace(status))
            {
                var st = status.Trim();
                items = items.Where(p => string.Equals(p.Status, st, StringComparison.OrdinalIgnoreCase)).ToList();
            }
            var total = items.Count;
            var paged = items.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            return new PatientListPageDto
            {
                TotalCount = total,
                Page = page,
                PageSize = pageSize,
                Items = paged
            };
        }
        public async Task<PatientDetailDto> GetPatientDetailAsync(string userId, int petId)
        {
            var vet = await GetVetAsync(userId);
            await EnsurePetBelongsToVetAsync(vet.VetId, petId);
            var pet = await _context.Pets
                .FirstOrDefaultAsync(p => p.PetId == petId);
            if (pet == null)
                throw new Exception("المريض غير موجود.");
            var appointments = await _context.Appointments
                .Where(a => a.PetId == petId && a.VetId == vet.VetId)
                .Include(a => a.Adopter)!.ThenInclude(ad => ad!.User)
                .OrderByDescending(a => a.AppointmentDate)
                .ToListAsync();
            var last = appointments.FirstOrDefault();
            var single = new PatientListDto
            {
                PetId = pet.PetId,
                PetName = pet.PetName,
                Species = pet.Species,
                Breed = pet.Breed,
                Age = pet.Age,
                Gender = pet.Gender,
                ImageUrl = pet.ImageURL,
                HealthStatus = pet.HealthStatus,
                LastVisitDate = last?.AppointmentDate,
                VisitCount = appointments.Count
            };
            await EnrichPatientsAsync(vet.VetId, new List<PatientListDto> { single });
            return new PatientDetailDto
            {
                PetId = pet.PetId,
                PetName = pet.PetName,
                Species = pet.Species,
                Breed = pet.Breed,
                Age = pet.Age,
                Gender = pet.Gender,
                ImageUrl = pet.ImageURL,
                HealthStatus = pet.HealthStatus,
                Status = single.Status,
                OwnerName = single.OwnerName,
                PatientIdDisplay = $"#PT-{pet.PetId:000000}",
                LastVisitDate = last?.AppointmentDate,
                VisitCount = appointments.Count,
                MedicalHistory = await GetMedicalHistoryInternalAsync(petId),
                Vaccinations = await GetPetVaccinationsInternalAsync(petId)
            };
        }
        public async Task<IEnumerable<MedicalHistoryEntryDto>> GetMedicalHistoryAsync(string userId, int petId)
        {
            var vet = await GetVetAsync(userId);
            await EnsurePetBelongsToVetAsync(vet.VetId, petId);
            return await GetMedicalHistoryInternalAsync(petId);
        }
        private async Task<IEnumerable<MedicalHistoryEntryDto>> GetMedicalHistoryInternalAsync(int petId)
        {
            var diagnoses = await _context.Diagnoses
                .Where(d => d.PetId == petId)
                .Include(d => d.User)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();
            return diagnoses.Select(d => new MedicalHistoryEntryDto
            {
                Id = d.DiagnosisId,
                Date = d.CreatedAt,
                Type = "CONSULTATION",
                Title = string.IsNullOrWhiteSpace(d.Result) ? "فحص عام" : d.Result!,
                Description = d.Symptoms,
                DoctorName = d.User?.FullName
            }).ToList();
        }
        public async Task<IEnumerable<VaccinationDto>> GetPetVaccinationsAsync(string userId, int petId)
        {
            var vet = await GetVetAsync(userId);
            await EnsurePetBelongsToVetAsync(vet.VetId, petId);
            return await GetPetVaccinationsInternalAsync(petId);
        }
        private async Task<IEnumerable<VaccinationDto>> GetPetVaccinationsInternalAsync(int petId)
        {
            var vaccinations = await _context.Vaccinations
                .Where(v => v.PetId == petId)
                .OrderByDescending(v => v.VaccinationDate)
                .ToListAsync();
            return vaccinations.Select(MapVaccination).ToList();
        }
        public async Task<VaccinationDto> AddVaccinationAsync(string userId, int petId, VaccinationRequestDto dto)
        {
            var vet = await GetVetAsync(userId);
            await EnsurePetBelongsToVetAsync(vet.VetId, petId);
            var vaccination = new Vaccination
            {
                PetId = petId,
                VaccineName = dto.VaccineName,
                Description = dto.Description,
                VaccinationDate = dto.VaccinationDate,
                NextDueDate = dto.NextDueDate
            };
            _context.Vaccinations.Add(vaccination);
            await _context.SaveChangesAsync();
            return MapVaccination(vaccination);
        }
        public async Task<VaccinationDto> UpdateVaccinationAsync(string userId, int vaccinationId, VaccinationRequestDto dto)
        {
            var vet = await GetVetAsync(userId);
            var vaccination = await _context.Vaccinations
                .FirstOrDefaultAsync(v => v.VaccinationId == vaccinationId);
            if (vaccination == null)
                throw new Exception("التطعيم غير موجود.");
            await EnsurePetBelongsToVetAsync(vet.VetId, vaccination.PetId);
            vaccination.VaccineName = dto.VaccineName;
            vaccination.Description = dto.Description;
            vaccination.VaccinationDate = dto.VaccinationDate;
            vaccination.NextDueDate = dto.NextDueDate;
            await _context.SaveChangesAsync();
            return MapVaccination(vaccination);
        }
        public async Task<bool> DeleteVaccinationAsync(string userId, int vaccinationId)
        {
            var vet = await GetVetAsync(userId);
            var vaccination = await _context.Vaccinations
                .FirstOrDefaultAsync(v => v.VaccinationId == vaccinationId);
            if (vaccination == null)
                return false;
            await EnsurePetBelongsToVetAsync(vet.VetId, vaccination.PetId);
            _context.Vaccinations.Remove(vaccination);
            await _context.SaveChangesAsync();
            return true;
        }
        private async Task EnrichPatientsAsync(int vetId, List<PatientListDto> items)
        {
            if (items.Count == 0) return;
            var petIds = items.Select(i => i.PetId).ToList();
            var today = DateTime.UtcNow.Date;
            var dueDate = today.AddDays(30);
            var latestAppointments = await _context.Appointments
                .Where(a => petIds.Contains(a.PetId) && a.VetId == vetId)
                .Include(a => a.Adopter)!.ThenInclude(ad => ad!.User)
                .ToListAsync();
            var ownersByPet = latestAppointments
                .GroupBy(a => a.PetId)
                .ToDictionary(g => g.Key, g => g.OrderByDescending(a => a.AppointmentDate).First());
            var upcomingPets = await _context.Appointments
                .Where(a => petIds.Contains(a.PetId)
                            && a.AppointmentDate > DateTime.UtcNow
                            && a.Status != "Completed"
                            && a.Status != "Cancelled")
                .Select(a => a.PetId)
                .Distinct()
                .ToListAsync();
            var vaccinePets = await _context.Vaccinations
                .Where(v => petIds.Contains(v.PetId)
                            && v.NextDueDate != null
                            && v.NextDueDate.Value.Date >= today
                            && v.NextDueDate.Value.Date <= dueDate)
                .Select(v => v.PetId)
                .Distinct()
                .ToListAsync();
            foreach (var item in items)
            {
                if (ownersByPet.TryGetValue(item.PetId, out var last))
                    item.OwnerName = last.Adopter?.User?.FullName ?? "غير معروف";
                else
                    item.OwnerName = "غير معروف";
                item.PatientIdDisplay = $"#PT-{item.PetId:000000}";
                if (vaccinePets.Contains(item.PetId))
                    item.Status = "Upcoming Vaccine";
                else if (upcomingPets.Contains(item.PetId))
                    item.Status = "Requires Follow-up";
                else if (!string.IsNullOrWhiteSpace(item.HealthStatus))
                    item.Status = item.HealthStatus;
                else
                    item.Status = "Healthy";
            }
        }
        private VaccinationDto MapVaccination(Vaccination v)
        {
            var today = DateTime.UtcNow.Date;
            string status;
            if (!v.NextDueDate.HasValue || v.NextDueDate.Value.Date > today.AddDays(30))
                status = "Up to date";
            else if (v.NextDueDate.Value.Date < today)
                status = "Overdue";
            else
                status = "Due soon";
            return new VaccinationDto
            {
                VaccinationId = v.VaccinationId,
                PetId = v.PetId,
                VaccineName = v.VaccineName,
                Description = v.Description,
                VaccinationDate = v.VaccinationDate,
                NextDueDate = v.NextDueDate,
                Status = status
            };
        }
    }
}
```

## File: Services/PaymentService.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;
namespace PetHaven.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly ApplicationDbContext _context;
        public PaymentService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<bool> ProcessPaymentAsync(PaymentRequestDto dto, string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.OrderId == dto.OrderId && o.UserId == parsedUserId);
            if (order == null)
                throw new Exception("الطلب غير موجود أو لا تملك صلاحية الوصول إليه.");
            if (order.Status == "Paid")
                throw new Exception("تم دفع قيمة هذا الطلب مسبقاً.");
            var adopter = await _context.Adopters
                .FirstOrDefaultAsync(a => a.UserId == parsedUserId);
            if (adopter == null)
                throw new Exception("لم يتم العثور على حساب المتبني.");
            if (adopter.Balance < order.TotalPrice)
                throw new Exception($"الرصيد غير كافٍ. الرصيد الحالي: {adopter.Balance:C}، المطلوب: {order.TotalPrice:C}.");
            adopter.Balance -= order.TotalPrice;
            var payment = new Payment
            {
                OrderId = order.OrderId,
                Amount = order.TotalPrice,
                PaymentMethod = dto.PaymentMethod,
                PaymentStatus = "Completed",
                PaymentDate = DateTime.UtcNow
            };
            _context.Payments.Add(payment);
            order.Status = "Paid";
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
```

## File: Services/PetReportService.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;
namespace PetHaven.Services
{
    public class PetReportService : IPetReportService
    {
        private readonly ApplicationDbContext _context;
        public PetReportService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<PetReportResponseDto> SubmitReportAsync(CreatePetReportDto dto, string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var adopter = await _context.Adopters
                .FirstOrDefaultAsync(a => a.UserId == parsedUserId);
            if (adopter == null)
                throw new Exception("لم يتم العثور على ملف المتبني.");
            var request = await _context.AdoptionRequests
                .Include(r => r.Pet)
                .Include(r => r.Adopter)
                    .ThenInclude(a => a.User)
                .FirstOrDefaultAsync(r => r.AdoptionRequestId == dto.AdoptionRequestId);
            if (request == null)
                throw new Exception("طلب التبني غير موجود.");
            if (request.AdopterId != adopter.AdopterId)
                throw new UnauthorizedAccessException("ليس لديك صلاحية لتقديم تقرير عن هذا الطلب.");
            if (request.Status != "Approved")
                throw new Exception("لا يمكن تقديم تقرير إلا بعد الموافقة على طلب التبني.");
            var report = new PetReport
            {
                AdoptionRequestId = dto.AdoptionRequestId,
                ImageURL          = dto.ImageUrl,
                HealthStatus      = dto.HealthStatus,
                Notes             = dto.Notes,
                CreatedAt         = DateTime.UtcNow
            };
            _context.PetReports.Add(report);
            adopter.LastReportDate     = DateTime.UtcNow;
            adopter.MissedReportsCount = 0;
            await _context.SaveChangesAsync();
            return new PetReportResponseDto
            {
                ReportId          = report.ReportId,
                AdoptionRequestId = report.AdoptionRequestId,
                AdopterId         = request.AdopterId,
                PetName           = request.Pet?.PetName ?? "—",
                AdopterName       = request.Adopter?.User?.FullName ?? "—",
                ImageUrl          = report.ImageURL,
                HealthStatus      = report.HealthStatus,
                Notes             = report.Notes,
                CreatedAt         = report.CreatedAt
            };
        }
        public async Task<IEnumerable<PetReportResponseDto>> GetCenterReportsAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var center = await _context.AdoptionCenters
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);
            if (center == null)
                throw new Exception("لم يتم العثور على ملف المركز.");
            var reports = await _context.PetReports
                .Include(pr => pr.AdoptionRequest)
                    .ThenInclude(ar => ar.Pet)
                .Include(pr => pr.AdoptionRequest)
                    .ThenInclude(ar => ar.Adopter)
                        .ThenInclude(a => a.User)
                .Where(pr => pr.AdoptionRequest.Pet.CenterId == center.CenterId)
                .OrderByDescending(pr => pr.CreatedAt)
                .Select(pr => new PetReportResponseDto
                {
                    ReportId          = pr.ReportId,
                    AdoptionRequestId = pr.AdoptionRequestId,
                    AdopterId         = pr.AdoptionRequest.AdopterId,
                    PetName           = pr.AdoptionRequest.Pet.PetName,
                    AdopterName       = pr.AdoptionRequest.Adopter.User != null
                                            ? pr.AdoptionRequest.Adopter.User.FullName
                                            : "—",
                    ImageUrl          = pr.ImageURL,
                    HealthStatus      = pr.HealthStatus,
                    Notes             = pr.Notes,
                    CreatedAt         = pr.CreatedAt
                })
                .ToListAsync();
            return reports;
        }
    }
}
```

## File: Services/PetService.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;
namespace PetHaven.Services
{
    public class PetService : IPetService
    {
        private readonly ApplicationDbContext _context;
        public PetService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<PetResponseDto> AddPetAsync(CreatePetDto dto, string userId)
        {
            if (!int.TryParse(userId, out var parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var center = await _context.AdoptionCenters
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);
            if (center == null)
                throw new Exception("لم يتم العثور على مركز تبني مرتبط بهذا الحساب.");
            var pet = new Pet
            {
                CenterId     = center.CenterId,
                PetName      = dto.Name,
                Species      = dto.Species,
                Breed        = dto.Breed,
                Age          = dto.Age,
                Gender       = dto.Gender,
                Description  = dto.Description,
                HealthStatus = dto.HealthStatus,
                ImageURL     = dto.ImageUrl
            };
            _context.Pets.Add(pet);
            await _context.SaveChangesAsync();
            return new PetResponseDto
            {
                PetId        = pet.PetId,
                Name         = pet.PetName,
                Species      = pet.Species,
                Breed        = pet.Breed,
                Age          = pet.Age,
                Gender       = pet.Gender,
                Description  = pet.Description,
                HealthStatus = pet.HealthStatus,
                ImageUrl     = pet.ImageURL,
                CenterName   = center.CenterName
            };
        }
        public async Task<IEnumerable<PetResponseDto>> GetAllAvailablePetsAsync()
        {
            var pets = await _context.Pets
                .Include(p => p.Center)
                .ToListAsync();
            return pets.Select(p => new PetResponseDto
            {
                PetId        = p.PetId,
                Name         = p.PetName,
                Species      = p.Species,
                Breed        = p.Breed,
                Age          = p.Age,
                Gender       = p.Gender,
                Description  = p.Description,
                HealthStatus = p.HealthStatus,
                ImageUrl     = p.ImageURL,
                CenterName   = p.Center?.CenterName ?? string.Empty
            });
        }
        public async Task<IEnumerable<PetResponseDto>> GetPetsByCenterAsync(string userId)
        {
            if (!int.TryParse(userId, out var parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var center = await _context.AdoptionCenters
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);
            if (center == null)
                throw new Exception("لم يتم العثور على مركز تبني مرتبط بهذا الحساب.");
            var pets = await _context.Pets
                .Where(p => p.CenterId == center.CenterId)
                .ToListAsync();
            return pets.Select(p => new PetResponseDto
            {
                PetId        = p.PetId,
                Name         = p.PetName,
                Species      = p.Species,
                Breed        = p.Breed,
                Age          = p.Age,
                Gender       = p.Gender,
                Description  = p.Description,
                HealthStatus = p.HealthStatus,
                ImageUrl     = p.ImageURL,
                CenterName   = center.CenterName
            });
        }
        public async Task<PetResponseDto> UpdatePetAsync(int petId, UpdatePetDto dto, string userId)
        {
            if (!int.TryParse(userId, out var parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var pet = await _context.Pets
                .Include(p => p.Center)
                .FirstOrDefaultAsync(p => p.PetId == petId);
            if (pet == null)
                throw new Exception("الحيوان الأليف المطلوب غير موجود.");
            if (pet.Center == null || pet.Center.UserId != parsedUserId)
                throw new UnauthorizedAccessException("ليس لديك صلاحية لتعديل هذا الحيوان الأليف.");
            if (dto.Name        != null) pet.PetName      = dto.Name;
            if (dto.Age         != null) pet.Age          = dto.Age;
            if (dto.HealthStatus!= null) pet.HealthStatus = dto.HealthStatus;
            if (dto.Description != null) pet.Description  = dto.Description;
            if (dto.ImageUrl    != null) pet.ImageURL     = dto.ImageUrl;
            await _context.SaveChangesAsync();
            return new PetResponseDto
            {
                PetId        = pet.PetId,
                Name         = pet.PetName,
                Species      = pet.Species,
                Breed        = pet.Breed,
                Age          = pet.Age,
                Gender       = pet.Gender,
                Description  = pet.Description,
                HealthStatus = pet.HealthStatus,
                ImageUrl     = pet.ImageURL,
                CenterName   = pet.Center.CenterName
            };
        }
        public async Task DeletePetAsync(int petId, string userId)
        {
            if (!int.TryParse(userId, out var parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var pet = await _context.Pets
                .Include(p => p.Center)
                .FirstOrDefaultAsync(p => p.PetId == petId);
            if (pet == null)
                throw new Exception("الحيوان الأليف المطلوب غير موجود.");
            if (pet.Center == null || pet.Center.UserId != parsedUserId)
                throw new UnauthorizedAccessException("ليس لديك صلاحية لحذف هذا الحيوان الأليف.");
            _context.Pets.Remove(pet);
            await _context.SaveChangesAsync();
        }
        public async Task<PetResponseDto?> GetPetByIdAsync(int petId)
        {
            var pet = await _context.Pets
                .Include(p => p.Center)
                .FirstOrDefaultAsync(p => p.PetId == petId);
            var isAdopted = await _context.AdoptionRequests
                .AnyAsync(r => r.PetId == petId && r.Status == "Approved");
            if (pet == null)
                return null;
            return new PetResponseDto
            {
                PetId = pet.PetId,
                Name = pet.PetName,
                Species = pet.Species,
                Breed        = pet.Breed,
                Age          = pet.Age,
                Gender       = pet.Gender,
                Description  = pet.Description,
                HealthStatus = pet.HealthStatus,
                ImageUrl     = pet.ImageURL,
                CenterName   = pet.Center?.CenterName ?? string.Empty,
               Status = isAdopted ? "Adopted" : "Available"
            };
        }
    }
}
```

## File: Services/ProductRatingService.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;
namespace PetHaven.Services
{
    public class ProductRatingService : IProductRatingService
    {
        private readonly ApplicationDbContext _context;
        public ProductRatingService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ProductRatingResponseDto> AddRatingAsync(string userId, ProductRatingRequestDto request)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");
            if (request.Rating < 1 || request.Rating > 5)
                throw new Exception("Rating must be between 1 and 5.");
            var productExists = await _context.Products.AnyAsync(p => p.ProductId == request.ProductId);
            if (!productExists)
                throw new Exception("Product not found.");
            var alreadyRated = await _context.Ratings.AnyAsync(r =>
                r.UserId == parsedUserId &&
                r.TargetType == "Product" &&
                r.TargetId == request.ProductId);
            if (alreadyRated)
                throw new Exception("You have already rated this product.");
            var rating = new Rating
            {
                UserId     = parsedUserId,
                TargetType = "Product",
                TargetId   = request.ProductId,
                StarsCount = request.Rating,
                ReviewText = request.Comment,
                CreatedAt  = DateTime.UtcNow
            };
            _context.Ratings.Add(rating);
            await _context.SaveChangesAsync();
            var user = await _context.Users
                .Include(u => u.Adopter)
                .FirstOrDefaultAsync(u => u.UserId == parsedUserId);
            return new ProductRatingResponseDto
            {
                RatingId    = rating.RatingId,
                ProductId   = request.ProductId,
                AdopterId   = parsedUserId.ToString(),
                AdopterName = user?.FullName ?? string.Empty,
                Rating      = rating.StarsCount,
                Comment     = rating.ReviewText,
                CreatedAt   = rating.CreatedAt
            };
        }
        public async Task<IEnumerable<ProductRatingResponseDto>> GetProductRatingsAsync(int productId)
        {
            var ratings = await _context.Ratings
                .Where(r => r.TargetType == "Product" && r.TargetId == productId)
                .Include(r => r.User)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
            return ratings.Select(r => new ProductRatingResponseDto
            {
                RatingId    = r.RatingId,
                ProductId   = productId,
                AdopterId   = r.UserId.ToString(),
                AdopterName = r.User?.FullName ?? string.Empty,
                Rating      = r.StarsCount,
                Comment     = r.ReviewText,
                CreatedAt   = r.CreatedAt
            });
        }
        public async Task<CenterProductReviewsResponseDto> GetCenterReviewsAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");
            var centerId = await _context.AdoptionCenters
                .Where(center => center.UserId == parsedUserId)
                .Select(center => (int?)center.CenterId)
                .FirstOrDefaultAsync();
            if (centerId == null)
                throw new Exception("Adoption center profile was not found.");
            var reviews = await (
                from rating in _context.Ratings.AsNoTracking()
                join product in _context.Products.AsNoTracking()
                    on rating.TargetId equals product.ProductId
                join user in _context.Users.AsNoTracking()
                    on rating.UserId equals user.UserId into users
                from reviewer in users.DefaultIfEmpty()
                where rating.TargetType == "Product"
                      && product.CenterId == centerId.Value
                orderby rating.CreatedAt descending
                select new CenterProductReviewDto
                {
                    RatingId = rating.RatingId,
                    ProductId = product.ProductId,
                    ProductName = product.Name,
                    AdopterName = reviewer != null ? reviewer.FullName : string.Empty,
                    Rating = rating.StarsCount,
                    Comment = rating.ReviewText,
                    CreatedAt = rating.CreatedAt
                })
                .ToListAsync();
            var total = reviews.Count;
            var breakdown = Enumerable.Range(1, 5)
                .Reverse()
                .Select(stars =>
                {
                    var count = reviews.Count(review => review.Rating == stars);
                    return new CenterRatingBreakdownDto
                    {
                        Stars = stars,
                        Count = count,
                        Percent = total == 0
                            ? 0
                            : (int)Math.Round(count * 100d / total, MidpointRounding.AwayFromZero)
                    };
                })
                .ToList();
            return new CenterProductReviewsResponseDto
            {
                AverageRating = total == 0
                    ? 0
                    : Math.Round(reviews.Average(review => review.Rating), 1),
                TotalReviews = total,
                Breakdown = breakdown,
                Reviews = reviews
            };
        }
    }
}
```

## File: Services/ProfileService.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public class ProfileService : IProfileService
    {
        private readonly ApplicationDbContext _context;
        public ProfileService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<UserProfileDto> GetUserProfileAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var user = await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Adopter)
                .Include(u => u.AdoptionCenter)
                .Include(u => u.Vet)
                .FirstOrDefaultAsync(u => u.UserId == parsedUserId);
            if (user == null)
                throw new Exception("المستخدم غير موجود.");
            var dto = new UserProfileDto
            {
                UserId = user.UserId,
                Username = user.UserName,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role?.RoleName ?? string.Empty,
               ProfileImageUrl = user.ImageUrl
            };
            if (user.Adopter != null)
            {
                dto.Address = user.Adopter.Address;
                dto.HousingType = user.Adopter.HousingType;
                dto.HasPetBefore = user.Adopter.HasPetBefore;
                dto.ExperienceLevel = user.Adopter.ExperienceLevel;
                dto.FreeHoursPerDay = user.Adopter.FreeHoursPerDay;
                dto.Balance = user.Adopter.Balance;
            }
            else if (user.AdoptionCenter != null)
            {
                dto.CenterName = user.AdoptionCenter.CenterName;
                dto.Address = user.AdoptionCenter.Address;
                dto.ContactInfo = user.AdoptionCenter.ContactInfo;
            }
            else if (user.Vet != null)
            {
                dto.ExperienceLevel = user.Vet.ExperienceYears.ToString();
            }
            return dto;
        }
        public async Task<bool> UpdateAdopterProfileAsync(string userId, UpdateAdopterProfileDto dto)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var user = await _context.Users
                .Include(u => u.Adopter)
                .FirstOrDefaultAsync(u => u.UserId == parsedUserId);
            if (user == null || user.Adopter == null)
                throw new Exception("المستخدم غير موجود أو لا يملك حساب متبني.");
            user.FullName = dto.FullName;
            user.PhoneNumber = dto.PhoneNumber;
            user.ImageUrl = dto.ImageUrl ?? user.ImageUrl;
            user.Adopter.Address = dto.Address;
            user.Adopter.HousingType = dto.HousingType;
            user.Adopter.ExperienceLevel = dto.ExperienceLevel;
            if (dto.FreeHoursPerDay.HasValue)
                user.Adopter.FreeHoursPerDay = dto.FreeHoursPerDay.Value;
            if (dto.HasPetBefore.HasValue)
                user.Adopter.HasPetBefore = dto.HasPetBefore.Value;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> UpdateCenterProfileAsync(string userId, UpdateCenterProfileDto dto)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var user = await _context.Users
                .Include(u => u.AdoptionCenter)
                .FirstOrDefaultAsync(u => u.UserId == parsedUserId);
            if (user == null || user.AdoptionCenter == null)
                throw new Exception("المستخدم غير موجود أو لا يملك حساب مركز.");
            user.PhoneNumber = dto.PhoneNumber;
            user.ImageUrl = dto.ImageUrl ?? user.ImageUrl;
            user.AdoptionCenter.CenterName = dto.CenterName;
            user.AdoptionCenter.Address = dto.Address;
            user.AdoptionCenter.ContactInfo = dto.ContactInfo;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> UpdateVetProfileAsync(string userId, UpdateVetProfileDto dto)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var user = await _context.Users
                .Include(u => u.Vet)
                .FirstOrDefaultAsync(u => u.UserId == parsedUserId);
            if (user == null || user.Vet == null)
                throw new Exception("المستخدم غير موجود أو لا يملك حساب طبيب بيطري.");
            user.FullName = dto.FullName;
            user.PhoneNumber = dto.PhoneNumber;
            user.Vet.FullName = dto.FullName;
            user.Vet.Email = dto.Email;
            user.Vet.PhoneNumber = dto.PhoneNumber;
            user.Vet.ClinicName = dto.ClinicName;
            user.Vet.ClinicAddress = dto.ClinicAddress;
            user.Vet.Specialization = dto.Specialization;
            user.Vet.ExperienceYears = dto.ExperienceYears;
            user.Vet.LicenseNumber = dto.LicenseNumber;
            user.Vet.Location_Lat = dto.Location_Lat;
            user.Vet.Location_Lng = dto.Location_Lng;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
```

## File: Services/RecommendationAiService.cs
```csharp
using PetHaven.DTOs;
using System.Net.Http.Json;
using System;
using System.Threading.Tasks;
namespace PetHaven.Services
{
    public class RecommendationAiService : IRecommendationAiService
    {
        private readonly HttpClient _httpClient;
        public RecommendationAiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<object> GetServicesAsync(AiRecommendationRequestDto requestData)
        {
            var response = await _httpClient.PostAsJsonAsync("http://localhost:8000/recommend", requestData);
            if (!response.IsSuccessStatusCode)
            {
                var errorDetails = await response.Content.ReadAsStringAsync();
                throw new Exception($"رفض سيرفر الـ AI الطلب. التفاصيل: {errorDetails}");
            }
            var aiResult = await response.Content.ReadFromJsonAsync<object>();
            return aiResult ?? new object();
        }
    }
}
```

## File: Services/ReviewsService.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
namespace PetHaven.Services
{
    public class ReviewsService : IReviewsService
    {
        private readonly ApplicationDbContext _context;
        public ReviewsService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ReviewsListResponseDto> GetClientReviewsAsync(
            int vetUserId, string? search, string? filter, int page, int pageSize)
        {
            var vet = await _context.Vets.FirstOrDefaultAsync(v => v.UserId == vetUserId);
            if (vet == null)
                throw new UnauthorizedAccessException("هوية الطبيب غير معروفة.");
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            var query = _context.Ratings
                .Where(r => r.TargetType == "Vet" && r.TargetId == vet.VetId)
                .Include(r => r.User)
                .AsQueryable();
            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim();
                query = query.Where(r =>
                    (r.User != null && r.User.FullName.Contains(search)) ||
                    (r.ReviewText != null && r.ReviewText.Contains(search)));
            }
            if (string.Equals(filter, "unanswered", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(r => string.IsNullOrEmpty(r.ReviewText));
            }
            var allQuery = _context.Ratings
                .Where(r => r.TargetType == "Vet" && r.TargetId == vet.VetId);
            var totalCount = await allQuery.CountAsync();
            var average = await allQuery.AnyAsync()
                ? await allQuery.AverageAsync(r => r.StarsCount)
                : 0.0;
            var unansweredCount = await allQuery.CountAsync(r => string.IsNullOrEmpty(r.ReviewText));
            var distribution = await allQuery
                .GroupBy(r => r.StarsCount)
                .Select(g => new { Star = g.Key, Count = g.Count() })
                .ToListAsync();
            var starDistribution = new Dictionary<int, int> { { 5, 0 }, { 4, 0 }, { 3, 0 }, { 2, 0 }, { 1, 0 } };
            foreach (var item in distribution)
                if (starDistribution.ContainsKey(item.Star))
                    starDistribution[item.Star] = item.Count;
            var starPercentages = starDistribution.ToDictionary(
                kv => kv.Key,
                kv => totalCount > 0 ? Math.Round(kv.Value * 100.0 / totalCount, 1) : 0.0);
            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
            var items = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new ClientReviewDto
                {
                    RatingId     = r.RatingId,
                    ReviewerName = r.User != null ? r.User.FullName : string.Empty,
                    StarsCount   = r.StarsCount,
                    ReviewText   = r.ReviewText,
                    CreatedAt    = r.CreatedAt
                })
                .ToListAsync();
            return new ReviewsListResponseDto
            {
                Stats = new ReviewsStatsDto
                {
                    AverageRating      = Math.Round(average, 1),
                    TotalCount         = totalCount,
                    UnansweredCount    = unansweredCount,
                    StarDistribution   = starDistribution,
                    StarPercentages    = starPercentages
                },
                Items      = items,
                Page       = page,
                PageSize   = pageSize,
                TotalItems = totalItems,
                TotalPages = totalPages
            };
        }
    }
}
```

## File: Services/StoreCatalogService.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;
namespace PetHaven.Services
{
    public class StoreCatalogService : IStoreCatalogService
    {
        private readonly ApplicationDbContext _context;
        public StoreCatalogService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<CategoryResponseDto>> GetAllCategoriesAsync()
        {
            return await _context.Categories
                .Select(c => new CategoryResponseDto
                {
                    CategoryId  = c.CategoryId,
                    Name        = c.CategoryName,
                    Description = c.Description
                })
                .ToListAsync();
        }
        public async Task<IEnumerable<ProductResponseDto>> GetAllAvailableProductsAsync()
        {
            return await _context.Products
                .Include(p => p.Center)
                .Include(p => p.Category)
                .Where(p => p.StockQuantity > 0)
                .Select(p => new ProductResponseDto
                {
                    ProductId         = p.ProductId,
                    CenterId          = p.CenterId,
                    CenterName        = p.Center != null ? p.Center.CenterName : string.Empty,
                    CategoryId        = p.CategoryId,
                    CategoryName      = p.Category != null ? p.Category.CategoryName : string.Empty,
                    Name              = p.Name,
                    Description       = p.Description,
                    ProductPrice      = p.ProductPrice,
                    DiscountRate      = p.DiscountRate,
                    PriceAfterDiscount = p.ProductPrice - (p.ProductPrice * p.DiscountRate),
                    StockQuantity     = p.StockQuantity,
                    ImageUrl          = p.ImageURL
                })
                .ToListAsync();
        }
        public async Task<IEnumerable<ProductResponseDto>> GetCenterProductsAsync(string userId)
        {
            var center = await ResolveCenterAsync(userId);
            return await _context.Products
                .Include(p => p.Center)
                .Include(p => p.Category)
                .Where(p => p.CenterId == center.CenterId)
                .Select(p => new ProductResponseDto
                {
                    ProductId         = p.ProductId,
                    CenterId          = p.CenterId,
                    CenterName        = p.Center != null ? p.Center.CenterName : string.Empty,
                    CategoryId        = p.CategoryId,
                    CategoryName      = p.Category != null ? p.Category.CategoryName : string.Empty,
                    Name              = p.Name,
                    Description       = p.Description,
                    ProductPrice      = p.ProductPrice,
                    DiscountRate      = p.DiscountRate,
                    PriceAfterDiscount = p.ProductPrice - (p.ProductPrice * p.DiscountRate),
                    StockQuantity     = p.StockQuantity,
                    ImageUrl          = p.ImageURL
                })
                .ToListAsync();
        }
        public async Task<ProductResponseDto> AddProductAsync(ProductRequestDto dto, string userId)
        {
            var center = await ResolveCenterAsync(userId);
            var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryId == dto.CategoryId);
            if (!categoryExists)
                throw new Exception("التصنيف المحدد غير موجود.");
            var product = new Product
            {
                CenterId      = center.CenterId,
                CategoryId    = dto.CategoryId,
                Name          = dto.Name,
                Description   = dto.Description,
                ProductPrice  = dto.ProductPrice,
                DiscountRate  = dto.DiscountRate,
                StockQuantity = dto.StockQuantity,
                ImageURL      = dto.ImageUrl
            };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            await _context.Entry(product).Reference(p => p.Center).LoadAsync();
            await _context.Entry(product).Reference(p => p.Category).LoadAsync();
            return MapToResponseDto(product);
        }
        public async Task<ProductResponseDto> UpdateProductAsync(int productId, ProductRequestDto dto, string userId)
        {
            var center = await ResolveCenterAsync(userId);
            var product = await _context.Products
                .Include(p => p.Center)
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.ProductId == productId);
            if (product == null)
                throw new Exception("المنتج غير موجود.");
            if (product.CenterId != center.CenterId)
                throw new UnauthorizedAccessException("ليس لديك صلاحية لتعديل هذا المنتج.");
            if (product.CategoryId != dto.CategoryId)
            {
                var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryId == dto.CategoryId);
                if (!categoryExists)
                    throw new Exception("التصنيف المحدد غير موجود.");
            }
            product.Name          = dto.Name;
            product.Description   = dto.Description;
            product.ProductPrice  = dto.ProductPrice;
            product.DiscountRate  = dto.DiscountRate;
            product.StockQuantity = dto.StockQuantity;
            product.ImageURL      = dto.ImageUrl;
            product.CategoryId    = dto.CategoryId;
            await _context.SaveChangesAsync();
            await _context.Entry(product).Reference(p => p.Category).LoadAsync();
            return MapToResponseDto(product);
        }
        public async Task DeleteProductAsync(int productId, string userId)
        {
            var center = await ResolveCenterAsync(userId);
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.ProductId == productId);
            if (product == null)
                throw new Exception("المنتج غير موجود.");
            if (product.CenterId != center.CenterId)
                throw new UnauthorizedAccessException("ليس لديك صلاحية لحذف هذا المنتج.");
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }
        private async Task<AdoptionCenter> ResolveCenterAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var center = await _context.AdoptionCenters
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);
            if (center == null)
                throw new Exception("لم يتم العثور على ملف المركز.");
            return center;
        }
        private static ProductResponseDto MapToResponseDto(Product product)
        {
            return new ProductResponseDto
            {
                ProductId         = product.ProductId,
                CenterId          = product.CenterId,
                CenterName        = product.Center?.CenterName ?? string.Empty,
                CategoryId        = product.CategoryId,
                CategoryName      = product.Category?.CategoryName ?? string.Empty,
                Name              = product.Name,
                Description       = product.Description,
                ProductPrice      = product.ProductPrice,
                DiscountRate      = product.DiscountRate,
                PriceAfterDiscount = product.ProductPrice - (product.ProductPrice * product.DiscountRate),
                StockQuantity     = product.StockQuantity,
                ImageUrl          = product.ImageURL
            };
        }
        public async Task<ProductDetailDto?> GetProductByIdAsync(int productId)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Center)
                .FirstOrDefaultAsync(p => p.ProductId == productId);
            if (product == null)
                return null;
            var ratings = await _context.Ratings
                .Include(r => r.User)
                .Where(r => r.TargetType == "Product" && r.TargetId == productId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
            var totalReviews = ratings.Count;
            var averageRating = totalReviews > 0 ? Math.Round(ratings.Average(r => r.StarsCount), 1) : 0;
            var finalPrice = product.ProductPrice - (product.ProductPrice * product.DiscountRate);
            return new ProductDetailDto
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                ImageUrl = product.ImageURL,
                StockQuantity = product.StockQuantity,
                OriginalPrice = product.ProductPrice,
                DiscountRate = product.DiscountRate,
                FinalPrice = Math.Round(finalPrice, 2),
                CategoryId = product.CategoryId,
                CategoryName = product.Category?.CategoryName ?? string.Empty,
                CenterId = product.CenterId,
                CenterName = product.Center?.CenterName ?? string.Empty,
                AverageRating = averageRating,
                TotalReviews = totalReviews,
                Reviews = ratings.Take(5).Select(r => new ProductReviewDto
                {
                    RatingId = r.RatingId,
                    UserName = r.User?.FullName ?? "مستخدم",
                    StarsCount = r.StarsCount,
                    ReviewText = r.ReviewText,
                    CreatedAt = r.CreatedAt
                }).ToList()
            };
        }
    }
}
```

## File: Services/VetDashboardService.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;
namespace PetHaven.Services
{
    public class VetDashboardService : IVetDashboardService
    {
        private readonly ApplicationDbContext _context;
        public VetDashboardService(ApplicationDbContext context)
        {
            _context = context;
        }
        private async Task<Vet> GetVetAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");
            var vet = await _context.Vets
                .FirstOrDefaultAsync(v => v.UserId == parsedUserId);
            if (vet == null)
                throw new Exception("لم يتم العثور على حساب الطبيب البيطري.");
            return vet;
        }
        public async Task<VetDashboardStatsDto> GetDashboardStatsAsync(string userId)
        {
            var vet = await GetVetAsync(userId);
            var today = DateTime.UtcNow.Date;
            var startOfMonth = new DateTime(today.Year, today.Month, 1);
            var totalPatients = await _context.Appointments
                .Where(a => a.VetId == vet.VetId)
                .Select(a => a.PetId)
                .Distinct()
                .CountAsync();
            var todayAppointments = await _context.Appointments
                .Where(a => a.VetId == vet.VetId && a.AppointmentDate.Date == today)
                .ToListAsync();
            var appointmentsTodayCount = todayAppointments.Count;
            var remainingTodayCount = todayAppointments.Count(a =>
                a.Status != "Completed" && a.Status != "Cancelled");
            var reviews = await _context.Ratings
                .CountAsync(r => r.TargetType == "Vet" && r.TargetId == vet.VetId);
            decimal revenueThisMonth = 0;
            return new VetDashboardStatsDto
            {
                TotalPatients = totalPatients,
                AppointmentsToday = appointmentsTodayCount,
                RemainingAppointmentsToday = remainingTodayCount,
                Reviews = reviews,
                RevenueThisMonth = revenueThisMonth
            };
        }
        public async Task<IEnumerable<ClinicActivityPointDto>> GetClinicActivityAsync(string userId, string period)
        {
            var vet = await GetVetAsync(userId);
            var today = DateTime.UtcNow.Date;
            var monthly = string.Equals(period, "monthly", StringComparison.OrdinalIgnoreCase);
            List<DateTime> days;
            if (monthly)
            {
                var startOfMonth = new DateTime(today.Year, today.Month, 1);
                days = Enumerable.Range(0, DateTime.DaysInMonth(today.Year, today.Month))
                    .Select(d => startOfMonth.AddDays(d))
                    .ToList();
            }
            else
            {
                var monday = today.AddDays(-(((int)today.DayOfWeek + 6) % 7));
                days = Enumerable.Range(0, 7).Select(d => monday.AddDays(d)).ToList();
            }
            var start = days.First();
            var end = days.Last().AddDays(1);
            var counts = await _context.Appointments
                .Where(a => a.VetId == vet.VetId
                            && a.AppointmentDate.Date >= start
                            && a.AppointmentDate.Date < end)
                .GroupBy(a => a.AppointmentDate.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Date);
            return days.Select(d => new ClinicActivityPointDto
            {
                Label = monthly ? d.ToString("MMM d") : d.ToString("ddd"),
                Count = counts.TryGetValue(d, out var c) ? c.Count : 0
            }).ToList();
        }
        public async Task<IEnumerable<AppointmentBreakdownDto>> GetAppointmentBreakdownAsync(string userId)
        {
            var vet = await GetVetAsync(userId);
            var reasons = await _context.Appointments
                .Where(a => a.VetId == vet.VetId && a.Reason != null)
                .Select(a => a.Reason!)
                .ToListAsync();
            var total = reasons.Count;
            var categories = new (string Category, Func<string, bool> Match)[]
            {
                ("Check-ups", r => r.Contains("check", StringComparison.OrdinalIgnoreCase)
                                    || r.Contains("فحص", StringComparison.OrdinalIgnoreCase)),
                ("Vaccinations", r => r.Contains("vaccin", StringComparison.OrdinalIgnoreCase)
                                    || r.Contains("تطعيم", StringComparison.OrdinalIgnoreCase)),
                ("Surgeries", r => r.Contains("surger", StringComparison.OrdinalIgnoreCase)
                                    || r.Contains("جراح", StringComparison.OrdinalIgnoreCase))
            };
            var result = categories.Select(cat =>
            {
                var count = reasons.Count(cat.Match);
                return new AppointmentBreakdownDto
                {
                    Category = cat.Category,
                    Count = count,
                    Percentage = total == 0 ? 0 : Math.Round(count * 100.0 / total, 1)
                };
            }).ToList();
            var otherCount = total - result.Sum(x => x.Count);
            result.Add(new AppointmentBreakdownDto
            {
                Category = "Other",
                Count = otherCount,
                Percentage = total == 0 ? 0 : Math.Round(otherCount * 100.0 / total, 1)
            });
            return result;
        }
        public async Task<IEnumerable<TopBreedDto>> GetTopBreedsAsync(string userId, int limit)
        {
            var vet = await GetVetAsync(userId);
            var total = await _context.Appointments
                .CountAsync(a => a.VetId == vet.VetId && a.Pet != null && a.Pet.Breed != null);
            var breeds = await _context.Appointments
                .Where(a => a.VetId == vet.VetId && a.Pet != null && a.Pet.Breed != null)
                .GroupBy(a => a.Pet!.Breed!)
                .Select(g => new { Breed = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(limit)
                .ToListAsync();
            return breeds.Select(b => new TopBreedDto
            {
                Breed = b.Breed,
                Count = b.Count,
                Percentage = total == 0 ? 0 : Math.Round(b.Count * 100.0 / total, 1)
            }).ToList();
        }
        public async Task<IEnumerable<RecentPatientDto>> GetRecentPatientsAsync(string userId, int count, string? search)
        {
            var vet = await GetVetAsync(userId);
            var query = _context.Appointments
                .Where(a => a.VetId == vet.VetId && a.Pet != null)
                .GroupBy(a => new
                {
                    a.PetId,
                    a.Pet!.PetName,
                    a.Pet.Species,
                    a.Pet.Breed,
                    a.Pet.ImageURL
                })
                .Select(g => new RecentPatientDto
                {
                    PetId = g.Key.PetId,
                    PetName = g.Key.PetName,
                    Species = g.Key.Species,
                    Breed = g.Key.Breed,
                    ImageUrl = g.Key.ImageURL,
                    LastVisitDate = g.Max(a => a.AppointmentDate),
                    VisitCount = g.Count()
                });
            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();
                query = query.Where(p => p.PetName.Contains(term)
                                         || (p.Breed != null && p.Breed.Contains(term)));
            }
            return await query
                .OrderByDescending(p => p.LastVisitDate)
                .Take(count)
                .ToListAsync();
        }
        public async Task<IEnumerable<AppointmentResponseDto>> GetTodayScheduleAsync(string userId)
        {
            var vet = await GetVetAsync(userId);
            var today = DateTime.UtcNow.Date;
            var appointments = await _context.Appointments
                .Where(a => a.VetId == vet.VetId && a.AppointmentDate.Date == today)
                .Include(a => a.Pet)
                .Include(a => a.Adopter)!.ThenInclude(ad => ad!.User)
                .OrderBy(a => a.AppointmentDate)
                .ToListAsync();
            return appointments.Select(a => new AppointmentResponseDto
            {
                AppointmentId = a.AppointmentId,
                PetId = a.PetId,
                PetName = a.Pet?.PetName ?? "غير معروف",
                Species = a.Pet?.Species,
                Breed = a.Pet?.Breed,
                PetImageUrl = a.Pet?.ImageURL,
                OwnerName = a.Adopter?.User?.FullName ?? "غير معروف",
                AppointmentDate = a.AppointmentDate,
                Status = a.Status,
                Reason = a.Reason,
                TimeDisplay = a.AppointmentDate.ToString("hh:mm tt")
            });
        }
    }
}
```

## File: Services/VetRatingService.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;
namespace PetHaven.Services
{
    public class VetRatingService : IVetRatingService
    {
        private readonly ApplicationDbContext _context;
        public VetRatingService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<VetRatingResponseDto> AddRatingAsync(string userId, VetRatingRequestDto request)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");
            if (request.Rating < 1 || request.Rating > 5)
                throw new Exception("التقييم يجب أن يكون بين 1 و 5.");
            var vetExists = await _context.Vets.AnyAsync(v => v.VetId == request.VetId);
            if (!vetExists)
                throw new Exception("الطبيب البيطري غير موجود.");
            var alreadyRated = await _context.Ratings.AnyAsync(r =>
                r.UserId == parsedUserId &&
                r.TargetType == "Vet" &&
                r.TargetId == request.VetId);
            if (alreadyRated)
                throw new Exception("لقد قمت بتقييم هذا الطبيب بالفعل.");
            var rating = new Rating
            {
                UserId = parsedUserId,
                TargetType = "Vet",
                TargetId = request.VetId,
                StarsCount = request.Rating,
                ReviewText = request.ReviewText,
                CreatedAt = DateTime.UtcNow
            };
            _context.Ratings.Add(rating);
            await _context.SaveChangesAsync();
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == parsedUserId);
            return new VetRatingResponseDto
            {
                RatingId = rating.RatingId,
                VetId = request.VetId,
                UserId = parsedUserId,
                UserName = user?.FullName ?? string.Empty,
                Rating = rating.StarsCount,
                ReviewText = rating.ReviewText,
                CreatedAt = rating.CreatedAt
            };
        }
        public async Task<double> GetVetAverageRatingAsync(int vetId)
        {
            var hasRatings = await _context.Ratings
                .AnyAsync(r => r.TargetType == "Vet" && r.TargetId == vetId);
            if (!hasRatings)
            {
                return 0.0;
            }
            return await _context.Ratings
                .Where(r => r.TargetType == "Vet" && r.TargetId == vetId)
                .AverageAsync(r => r.StarsCount);
        }
    }
}
```

## File: Services/VetService.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;
namespace PetHaven.Services
{
    public class VetService : IVetService
    {
        private readonly ApplicationDbContext _context;
        public VetService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<VetResponseDto>> GetAllVetsAsync()
        {
            var vets = await _context.Vets.ToListAsync();
            var vetIds = vets.Select(v => v.VetId).ToList();
            var ratingStats = await _context.Ratings
                .Where(r => r.TargetType == "Vet" && vetIds.Contains(r.TargetId))
                .GroupBy(r => r.TargetId)
                .Select(g => new { VetId = g.Key, AverageRating = g.Average(r => r.StarsCount), TotalRatings = g.Count() })
                .ToDictionaryAsync(x => x.VetId);
            return vets.Select(v => MapToDto(v, null,
                ratingStats.ContainsKey(v.VetId) ? ratingStats[v.VetId].AverageRating : null,
                ratingStats.ContainsKey(v.VetId) ? ratingStats[v.VetId].TotalRatings : 0));
        }
        public async Task<IEnumerable<VetResponseDto>> SearchVetsAsync(VetSearchDto searchDto)
        {
            var query = _context.Vets
                .Where(v => v.IsVerified)
                .AsQueryable();
            if (!string.IsNullOrEmpty(searchDto.Specialization))
            {
                query = query.Where(v => v.Specialization != null &&
                                         v.Specialization.Contains(searchDto.Specialization));
            }
            double? userLat = searchDto.UserLatitude;
            double? userLng = searchDto.UserLongitude;
            var projectedQuery = query.Select(v => new
            {
                Vet = v,
                Distance = _context.CalculateDistance(userLat, userLng, (double?)v.Location_Lat, (double?)v.Location_Lng),
                AverageRating = _context.Ratings
                    .Where(r => r.TargetType == "Vet" && r.TargetId == v.VetId)
                    .Select(r => (double?)r.StarsCount)
                    .Average(),
                TotalRatings = _context.Ratings
                    .Count(r => r.TargetType == "Vet" && r.TargetId == v.VetId)
            });
            if (searchDto.Radius.HasValue && searchDto.Radius.Value > 0 && userLat.HasValue && userLng.HasValue)
            {
                var maxDistance = (double)searchDto.Radius.Value;
                projectedQuery = projectedQuery.Where(p => p.Distance.HasValue && p.Distance.Value <= maxDistance);
            }
            projectedQuery = (searchDto.SortBy?.ToLower()) switch
            {
                "distance" => projectedQuery.OrderBy(p => p.Distance).ThenBy(p => p.Vet.FullName),
                "rating" => projectedQuery.OrderByDescending(p => p.AverageRating ?? 0).ThenBy(p => p.Vet.FullName),
                "experience" => projectedQuery.OrderByDescending(p => p.Vet.ExperienceYears ?? 0).ThenBy(p => p.Vet.FullName),
                _ => projectedQuery.OrderBy(p => p.Vet.FullName)
            };
            var results = await projectedQuery.ToListAsync();
            return results.Select(p => MapToDto(
                p.Vet,
                p.Distance,
                p.AverageRating,
                p.TotalRatings
            ));
        }
        public async Task<VetResponseDto?> GetVetByIdAsync(int vetId)
        {
            var vet = await _context.Vets
                .FirstOrDefaultAsync(v => v.VetId == vetId);
            if (vet == null) return null;
            var ratingStats = await _context.Ratings
                .Where(r => r.TargetType == "Vet" && r.TargetId == vetId)
                .GroupBy(r => r.TargetId)
                .Select(g => new { AverageRating = g.Average(r => r.StarsCount), TotalRatings = g.Count() })
                .FirstOrDefaultAsync();
            return MapToDto(vet, null,
                ratingStats?.AverageRating,
                ratingStats?.TotalRatings ?? 0);
        }
        private VetResponseDto MapToDto(Vet vet, double? distanceInKm, double? averageRating, int totalRatings)
        {
            return new VetResponseDto
            {
                VetId = vet.VetId,
                FullName = vet.FullName,
                Specialization = vet.Specialization,
                ClinicName = vet.ClinicName,
                ClinicAddress = vet.ClinicAddress,
                PhoneNumber = vet.PhoneNumber,
                Email = vet.Email,
                ExperienceYears = vet.ExperienceYears,
                LicenseNumber = vet.LicenseNumber,
                Location_Lat = vet.Location_Lat,
                Location_Lng = vet.Location_Lng,
                IsVerified = vet.IsVerified,
                AverageRating = averageRating,
                TotalRatings = totalRatings,
                DistanceInKm = distanceInKm
            };
        }
    }
}
```

## File: Services/WishlistService.cs
```csharp
using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;
namespace PetHaven.Services
{
    public class WishlistService : IWishlistService
    {
        private readonly ApplicationDbContext _context;
        public WishlistService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<WishlistResponseDto>> GetUserWishlistAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");
            var user = await _context.Users
                .Include(u => u.Wishlists!)
                    .ThenInclude(w => w.Product)
                .FirstOrDefaultAsync(u => u.UserId == parsedUserId);
            if (user == null)
                throw new Exception("User not found.");
            var wishlistItems = user.Wishlists?
                .Where(w => w.Product != null)
                .Select(w =>
                {
                    var currentPrice = w.Product!.ProductPrice - (w.Product.ProductPrice * w.Product.DiscountRate);
                    return new WishlistResponseDto
                    {
                        WishlistItemId = w.WishlistId,
                        ProductId      = w.ProductId,
                        ProductName    = w.Product.Name,
                        CurrentPrice   = Math.Round(currentPrice, 2),
                        ImageUrl       = w.Product.ImageURL
                    };
                })
                .ToList() ?? new List<WishlistResponseDto>();
            return wishlistItems;
        }
        public async Task AddToWishlistAsync(int productId, string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");
            var user = await _context.Users
                .Include(u => u.Wishlists)
                .FirstOrDefaultAsync(u => u.UserId == parsedUserId);
            if (user == null)
                throw new Exception("User not found.");
            var productExists = await _context.Products.AnyAsync(p => p.ProductId == productId);
            if (!productExists)
                throw new Exception("Product not found.");
            var alreadyInWishlist = user.Wishlists?
                .Any(w => w.ProductId == productId) ?? false;
            if (alreadyInWishlist)
                throw new Exception("Product is already in your wishlist.");
            var wishlistItem = new Wishlist
            {
                UserId    = parsedUserId,
                ProductId = productId,
                AddedDate = DateTime.UtcNow
            };
            _context.Wishlists.Add(wishlistItem);
            await _context.SaveChangesAsync();
        }
        public async Task RemoveFromWishlistAsync(int productId, string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("Invalid user identifier.");
            var wishlistItem = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.ProductId == productId && w.UserId == parsedUserId);
            if (wishlistItem == null)
                throw new Exception("Item not found in your wishlist.");
            _context.Wishlists.Remove(wishlistItem);
            await _context.SaveChangesAsync();
        }
    }
}
```

## File: .dockerignore
```
bin/
obj/
.vs/
.git/
.gitignore
Dockerfile
```

## File: .gitattributes
```
###############################################################################
# Set default behavior to automatically normalize line endings.
###############################################################################
* text=auto

###############################################################################
# Set default behavior for command prompt diff.
#
# This is need for earlier builds of msysgit that does not have it on by
# default for csharp files.
# Note: This is only used by command line
###############################################################################
#*.cs     diff=csharp

###############################################################################
# Set the merge driver for project and solution files
#
# Merging from the command prompt will add diff markers to the files if there
# are conflicts (Merging from VS is not affected by the settings below, in VS
# the diff markers are never inserted). Diff markers may cause the following 
# file extensions to fail to load in VS. An alternative would be to treat
# these files as binary and thus will always conflict and require user
# intervention with every merge. To do so, just uncomment the entries below
###############################################################################
#*.sln       merge=binary
#*.csproj    merge=binary
#*.vbproj    merge=binary
#*.vcxproj   merge=binary
#*.vcproj    merge=binary
#*.dbproj    merge=binary
#*.fsproj    merge=binary
#*.lsproj    merge=binary
#*.wixproj   merge=binary
#*.modelproj merge=binary
#*.sqlproj   merge=binary
#*.wwaproj   merge=binary

###############################################################################
# behavior for image files
#
# image files are treated as binary by default.
###############################################################################
#*.jpg   binary
#*.png   binary
#*.gif   binary

###############################################################################
# diff behavior for common document formats
# 
# Convert binary document formats to text before diffing them. This feature
# is only available from the command line. Turn it on by uncommenting the 
# entries below.
###############################################################################
#*.doc   diff=astextplain
#*.DOC   diff=astextplain
#*.docx  diff=astextplain
#*.DOCX  diff=astextplain
#*.dot   diff=astextplain
#*.DOT   diff=astextplain
#*.pdf   diff=astextplain
#*.PDF   diff=astextplain
#*.rtf   diff=astextplain
#*.RTF   diff=astextplain
```

## File: .gitignore
```
## Ignore Visual Studio temporary files, build results, and
## files generated by popular Visual Studio add-ons.
##
## Get latest from https://github.com/github/gitignore/blob/master/VisualStudio.gitignore

# User-specific files
*.rsuser
*.suo
*.user
*.userosscache
*.sln.docstates

# User-specific files (MonoDevelop/Xamarin Studio)
*.userprefs

# Mono auto generated files
mono_crash.*

# Build results
[Dd]ebug/
[Dd]ebugPublic/
[Rr]elease/
[Rr]eleases/
x64/
x86/
[Ww][Ii][Nn]32/
[Aa][Rr][Mm]/
[Aa][Rr][Mm]64/
bld/
[Bb]in/
[Oo]bj/
[Oo]ut/
[Ll]og/
[Ll]ogs/

# Visual Studio 2015/2017 cache/options directory
.vs/
# Uncomment if you have tasks that create the project's static files in wwwroot
#wwwroot/

# Visual Studio 2017 auto generated files
Generated\ Files/

# MSTest test Results
[Tt]est[Rr]esult*/
[Bb]uild[Ll]og.*

# NUnit
*.VisualState.xml
TestResult.xml
nunit-*.xml

# Build Results of an ATL Project
[Dd]ebugPS/
[Rr]eleasePS/
dlldata.c

# Benchmark Results
BenchmarkDotNet.Artifacts/

# .NET Core
project.lock.json
project.fragment.lock.json
artifacts/

# ASP.NET Scaffolding
ScaffoldingReadMe.txt

# StyleCop
StyleCopReport.xml

# Files built by Visual Studio
*_i.c
*_p.c
*_h.h
*.ilk
*.meta
*.obj
*.iobj
*.pch
*.pdb
*.ipdb
*.pgc
*.pgd
*.rsp
*.sbr
*.tlb
*.tli
*.tlh
*.tmp
*.tmp_proj
*_wpftmp.csproj
*.log
*.vspscc
*.vssscc
.builds
*.pidb
*.svclog
*.scc

# Chutzpah Test files
_Chutzpah*

# Visual C++ cache files
ipch/
*.aps
*.ncb
*.opendb
*.opensdf
*.sdf
*.cachefile
*.VC.db
*.VC.VC.opendb

# Visual Studio profiler
*.psess
*.vsp
*.vspx
*.sap

# Visual Studio Trace Files
*.e2e

# TFS 2012 Local Workspace
$tf/

# Guidance Automation Toolkit
*.gpState

# ReSharper is a .NET coding add-in
_ReSharper*/
*.[Rr]e[Ss]harper
*.DotSettings.user

# TeamCity is a build add-in
_TeamCity*

# DotCover is a Code Coverage Tool
*.dotCover

# AxoCover is a Code Coverage Tool
.axoCover/*
!.axoCover/settings.json

# Coverlet is a free, cross platform Code Coverage Tool
coverage*.json
coverage*.xml
coverage*.info

# Visual Studio code coverage results
*.coverage
*.coveragexml

# NCrunch
_NCrunch_*
.*crunch*.local.xml
nCrunchTemp_*

# MightyMoose
*.mm.*
AutoTest.Net/

# Web workbench (sass)
.sass-cache/

# Installshield output folder
[Ee]xpress/

# DocProject is a documentation generator add-in
DocProject/buildhelp/
DocProject/Help/*.HxT
DocProject/Help/*.HxC
DocProject/Help/*.hhc
DocProject/Help/*.hhk
DocProject/Help/*.hhp
DocProject/Help/Html2
DocProject/Help/html

# Click-Once directory
publish/

# Publish Web Output
*.[Pp]ublish.xml
*.azurePubxml
# Note: Comment the next line if you want to checkin your web deploy settings,
# but database connection strings (with potential passwords) will be unencrypted
*.pubxml
*.publishproj

# Microsoft Azure Web App publish settings. Comment the next line if you want to
# checkin your Azure Web App publish settings, but sensitive information contained
# in these scripts will be unencrypted
PublishScripts/

# NuGet Packages
*.nupkg
# NuGet Symbol Packages
*.snupkg
# The packages folder can be ignored because of Package Restore
**/[Pp]ackages/*
# except build/, which is used as an MSBuild target.
!**/[Pp]ackages/build/
# Uncomment if necessary however generally it will be regenerated when needed
#!**/[Pp]ackages/repositories.config
# NuGet v3's project.json files produces more ignorable files
*.nuget.props
*.nuget.targets

# Microsoft Azure Build Output
csx/
*.build.csdef

# Microsoft Azure Emulator
ecf/
rcf/

# Windows Store app package directories and files
AppPackages/
BundleArtifacts/
Package.StoreAssociation.xml
_pkginfo.txt
*.appx
*.appxbundle
*.appxupload

# Visual Studio cache files
# files ending in .cache can be ignored
*.[Cc]ache
# but keep track of directories ending in .cache
!?*.[Cc]ache/

# Others
ClientBin/
~$*
*~
*.dbmdl
*.dbproj.schemaview
*.jfm
*.pfx
*.publishsettings
orleans.codegen.cs

# Including strong name files can present a security risk
# (https://github.com/github/gitignore/pull/2483#issue-259490424)
#*.snk

# Since there are multiple workflows, uncomment next line to ignore bower_components
# (https://github.com/github/gitignore/pull/1529#issuecomment-104372622)
#bower_components/

# RIA/Silverlight projects
Generated_Code/

# Backup & report files from converting an old project file
# to a newer Visual Studio version. Backup files are not needed,
# because we have git ;-)
_UpgradeReport_Files/
Backup*/
UpgradeLog*.XML
UpgradeLog*.htm
ServiceFabricBackup/
*.rptproj.bak

# SQL Server files
*.mdf
*.ldf
*.ndf

# Business Intelligence projects
*.rdl.data
*.bim.layout
*.bim_*.settings
*.rptproj.rsuser
*- [Bb]ackup.rdl
*- [Bb]ackup ([0-9]).rdl
*- [Bb]ackup ([0-9][0-9]).rdl

# Microsoft Fakes
FakesAssemblies/

# GhostDoc plugin setting file
*.GhostDoc.xml

# Node.js Tools for Visual Studio
.ntvs_analysis.dat
node_modules/

# Visual Studio 6 build log
*.plg

# Visual Studio 6 workspace options file
*.opt

# Visual Studio 6 auto-generated workspace file (contains which files were open etc.)
*.vbw

# Visual Studio LightSwitch build output
**/*.HTMLClient/GeneratedArtifacts
**/*.DesktopClient/GeneratedArtifacts
**/*.DesktopClient/ModelManifest.xml
**/*.Server/GeneratedArtifacts
**/*.Server/ModelManifest.xml
_Pvt_Extensions

# Paket dependency manager
.paket/paket.exe
paket-files/

# FAKE - F# Make
.fake/

# CodeRush personal settings
.cr/personal

# Python Tools for Visual Studio (PTVS)
__pycache__/
*.pyc

# Cake - Uncomment if you are using it
# tools/**
# !tools/packages.config

# Tabs Studio
*.tss

# Telerik's JustMock configuration file
*.jmconfig

# BizTalk build output
*.btp.cs
*.btm.cs
*.odx.cs
*.xsd.cs

# OpenCover UI analysis results
OpenCover/

# Azure Stream Analytics local run output
ASALocalRun/

# MSBuild Binary and Structured Log
*.binlog

# NVidia Nsight GPU debugger configuration file
*.nvuser

# MFractors (Xamarin productivity tool) working folder
.mfractor/

# Local History for Visual Studio
.localhistory/

# BeatPulse healthcheck temp database
healthchecksdb

# Backup folder for Package Reference Convert tool in Visual Studio 2017
MigrationBackup/

# Ionide (cross platform F# VS Code tools) working folder
.ionide/

# Fody - auto-generated XML schema
FodyWeavers.xsd


#ملف الإعدادت يختلف من بيئة لأخرى
appsettings.Development.json

[Oo]bj/
```

## File: appsettings.json
```json
{
  "ConnectionStrings": {
    "MyConnection": "Server=localhost;Database=PetHavenDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Secret": "YourSuperSecretKeyHereAtLeast32CharactersLong!",
    "Issuer": "PetHaven",
    "Audience": "PetHavenUsers",
    "ExpiryInMinutes": 20
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

## File: backend.http
```
@backend_HostAddress = http://localhost:5171

GET {{backend_HostAddress}}/weatherforecast/
Accept: application/json

###
```

## File: Dockerfile
```dockerfile
# Stage 1 : Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

# نسخ ملف المشروع
COPY backend.csproj .

# استرجاع الحزم
RUN dotnet restore

# نسخ بقية الملفات
COPY . .

# نشر التطبيق
RUN dotnet publish -c Release -o /app/publish

# Stage 2 : Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "backend.dll"]
```

## File: PetHaven.csproj
```
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
     <GenerateDocumentationFile>true</GenerateDocumentationFile>
     <NoWarn>$(NoWarn);1591</NoWarn>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="BCrypt.Net-Next" Version="4.2.0" />
    <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.28" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.28" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="10.0.9">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.4.0" />
    <PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="8.19.1" />
  </ItemGroup>

</Project>
```

## File: PetHaven.http
```
@PetHaven_HostAddress = http://localhost:5248

GET {{PetHaven_HostAddress}}/weatherforecast/
Accept: application/json

###
```

## File: PetHaven.sln
```
Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 17
VisualStudioVersion = 17.9.34622.214
MinimumVisualStudioVersion = 10.0.40219.1
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "PetHaven", "PetHaven.csproj", "{EC43D9B4-843D-4CB4-93E0-404740290D30}"
EndProject
Global
	GlobalSection(SolutionConfigurationPlatforms) = preSolution
		Debug|Any CPU = Debug|Any CPU
		Release|Any CPU = Release|Any CPU
	EndGlobalSection
	GlobalSection(ProjectConfigurationPlatforms) = postSolution
		{EC43D9B4-843D-4CB4-93E0-404740290D30}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{EC43D9B4-843D-4CB4-93E0-404740290D30}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{EC43D9B4-843D-4CB4-93E0-404740290D30}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{EC43D9B4-843D-4CB4-93E0-404740290D30}.Release|Any CPU.Build.0 = Release|Any CPU
	EndGlobalSection
	GlobalSection(SolutionProperties) = preSolution
		HideSolutionNode = FALSE
	EndGlobalSection
	GlobalSection(ExtensibilityGlobals) = postSolution
		SolutionGuid = {350A4863-FE6C-45AB-9546-13276E6C1975}
	EndGlobalSection
EndGlobal
```

## File: Program.cs
```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using PetHaven.Data;
using PetHaven.Services;
using PetHaven.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Reflection;
using System.Text.Json.Serialization;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name        = "Authorization",
        In          = ParameterLocation.Header,
        Type        = SecuritySchemeType.ApiKey,
        Scheme      = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyConnection")));
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyConnection")));
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<JwtHelper>();
builder.Services.AddScoped<IPetService, PetService>();
builder.Services.AddScoped<IPetReportService, PetReportService>();
builder.Services.AddScoped<IBlacklistService, BlacklistService>();
builder.Services.AddScoped<IAdoptionService, AdoptionService>();
builder.Services.AddScoped<IStoreCatalogService, StoreCatalogService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IWishlistService, WishlistService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IProductRatingService, ProductRatingService>();
builder.Services.AddScoped<IVetRatingService, VetRatingService>();
builder.Services.AddScoped<IReviewsService, ReviewsService>();
builder.Services.AddScoped<IVetService, VetService>();
builder.Services.AddScoped<IAppointmentsService, AppointmentsService>();
builder.Services.AddTransient<DatabaseSeeder>();
builder.Services.AddHttpClient();
builder.Services.AddScoped<IRecommendationAiService, RecommendationAiService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IAdopterDashboardService, AdopterDashboardService>();
builder.Services.AddScoped<ICenterDashboardService, CenterDashboardService>();
builder.Services.AddScoped<IVetDashboardService, VetDashboardService>();
builder.Services.AddScoped<IPatientsService, PatientsService>();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"] ?? "YourSuperSecretKeyForPetHaven123456789")),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true
    };
});
var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await db.Database.MigrateAsync();
    var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
    await seeder.SeedAsync();
}
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
```
