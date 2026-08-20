using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PetHaven.Models;
using PetHaven.DTOs;

namespace PetHaven.Services
{
    public interface IAppointmentsService
    {

        // ═══════════════════════════════════════════════════════════════
        // لوحة تحكم العيادة البيطرية (Vet Dashboard)
        // ═══════════════════════════════════════════════════════════════
        Task<IEnumerable<AppointmentResponseDto>> GetVetScheduleAsync(int vetUserId, DateTime? date);
        Task<AppointmentSummaryDto> GetVetSummaryAsync(int vetUserId, DateTime? date);

        // ═══════════════════════════════════════════════════════════════
        // عمليات الطبيب (Vet operations)
        // ═══════════════════════════════════════════════════════════════
        Task<bool> UpdateAppointmentStatusAsync(int appointmentId, string status, int vetUserId);
        Task<bool> RescheduleAppointmentAsync(int appointmentId, DateTime newDate, int vetUserId);

        // ═══════════════════════════════════════════════════════════════
        // عمليات المربي (Adopter operations)
        // ═══════════════════════════════════════════════════════════════
        Task<IEnumerable<AdopterAppointmentDto>> GetAdopterAppointmentsAsync(int adopterUserId);
        Task<AdopterAppointmentDto?> GetAdopterAppointmentAsync(int appointmentId, int adopterUserId);
        Task<AppointmentAvailabilityDto> GetAvailableSlotsAsync(int vetId, DateTime date);
        Task<bool> RescheduleAdopterAppointmentAsync(int appointmentId, DateTime newDate, int adopterUserId);
        Task<Appointment> BookAppointmentAsync(CreateAppointmentDto dto, int currentUserId);
        Task<bool> CancelAppointmentAsync(int appointmentId, int adopterUserId);
    }
}
