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