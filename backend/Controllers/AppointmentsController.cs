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

        // ═══════════════════════════════════════════════════════════════
        // لوحة تحكم الطبيب البيطري (Clinic Appointments Dashboard)
        // ═══════════════════════════════════════════════════════════════

        // جلب جدول مواعيد الطبيب ليوم معيّن
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

        // إحصائيات مواعيد اليوم (بطاقات الملخص)
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

        // ═══════════════════════════════════════════════════════════════
        // عمليات الطبيب 
        // ═══════════════════════════════════════════════════════════════

        //  قبول أو رفض أو إكمال الموعد
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

        // إعادة جدولة موعد
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

        // ═══════════════════════════════════════════════════════════════
        // عمليات المربي
        // ═══════════════════════════════════════════════════════════════
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

        //حجز الموعد 
        [Authorize(Roles = "Adopter")]
        [HttpPost("book")]
        public async Task<IActionResult> BookAppointment([FromBody] CreateAppointmentDto dto)
        {
            // استخراج الـ UserId من التوكن بشكل آمن
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("لم يتم العثور على هوية المستخدم في التوكن الحالي.");
            }

            int currentUserId = int.Parse(userIdClaim);

            try
            {
                // تمرير العمل للخدمة
                var appointment = await _appointmentsService.BookAppointmentAsync(dto, currentUserId);
                return Ok(new { message = "تم إرسال طلب الحجز بنجاح وبأمان.", appointmentId = appointment.AppointmentId });
            }
            catch (ArgumentException ex) // أخطاء التواريخ أو المدخلات
            {
                return BadRequest(ex.Message);
            }
            catch (KeyNotFoundException ex) // خطأ إذا كان الطبيب غير موجود
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex) // خطأ إذا لم يكن Adopter
            {
                return StatusCode(403, ex.Message); // Forbidden
            }
            catch (Exception)
            {
                return StatusCode(500, "حدث خطأ داخلي غير متوقع أثناء معالجة الحجز.");
            }
        }


        // إلغاء موعد (من المربي صاحب الموعد)
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
