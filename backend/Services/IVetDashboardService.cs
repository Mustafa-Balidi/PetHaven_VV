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
