using PetHaven.DTOs;

namespace PetHaven.Services
{
    public interface IPatientsService
    {
        Task<VetPatientsStatsDto> GetPatientsStatsAsync(string userId);
        Task<PatientListPageDto> GetPatientsAsync(string userId, string? search, string? species, string? status, int page, int pageSize);
        Task<PatientDetailDto> GetPatientDetailAsync(string userId, int petId);
        Task<IEnumerable<MedicalHistoryEntryDto>> GetMedicalHistoryAsync(string userId, int petId);
        Task<MedicalHistoryEntryDto> AddDiagnosisAsync(string userId, int petId, CreateDiagnosisDto dto);
        Task<MedicalHistoryEntryDto> UpdateDiagnosisAsync(string userId, int diagnosisId, UpdateDiagnosisDto dto);
        Task<bool> DeleteDiagnosisAsync(string userId, int diagnosisId);
        Task<IEnumerable<VaccinationDto>> GetPetVaccinationsAsync(string userId, int petId);
        Task<VaccinationDto> AddVaccinationAsync(string userId, int petId, VaccinationRequestDto dto);
        Task<VaccinationDto> UpdateVaccinationAsync(string userId, int vaccinationId, VaccinationRequestDto dto);
        Task<bool> DeleteVaccinationAsync(string userId, int vaccinationId);
    }
}
