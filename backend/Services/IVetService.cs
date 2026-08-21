using PetHaven.DTOs;

namespace PetHaven.Services
{
    public interface IVetService
    {
        Task<IEnumerable<VetResponseDto>> GetAllVetsAsync();
        Task<IEnumerable<VetResponseDto>> SearchVetsAsync(VetSearchDto searchDto);
        Task<VetResponseDto?> GetVetByIdAsync(int vetId);
        Task<VetVerificationStatusDto> SubmitVerificationAsync(string userId, SubmitVetVerificationDto dto);
        Task<VetVerificationStatusDto?> GetVerificationStatusAsync(string userId);
    }
}
