using PetHaven.DTOs;

namespace PetHaven.Services
{
    public interface IVetRatingService
    {
        Task<VetRatingResponseDto> AddRatingAsync(string userId, VetRatingRequestDto request);
        Task<double> GetVetAverageRatingAsync(int vetId);
    }
}
