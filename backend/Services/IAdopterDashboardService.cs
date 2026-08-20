using PetHaven.DTOs;

namespace PetHaven.Services
{
    public interface IAdopterDashboardService
    {
        // 📊 الإحصائيات
        Task<AdopterDashboardDto> GetAdopterDashboardAsync(string userId);


        // 🐾 الحيوانات المتبناة
        Task<IEnumerable<PetResponseDto>> GetAdoptedPetsAsync(string userId);

    }
}