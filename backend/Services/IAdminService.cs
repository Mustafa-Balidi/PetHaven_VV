using PetHaven.DTOs;

namespace PetHaven.Services
{
    public interface IAdminService
    {
        // إحصائيات النظام
        Task<AdminStatsDto> GetStatsAsync();

        // الأطباء غير الموافق عليهم
        Task<IEnumerable<VetPendingDto>> GetPendingVetsAsync();

        // الموافقة على طبيب
        Task<bool> VerifyVetAsync(int vetId);

        // رفض طبيب
        Task<bool> RejectVetAsync(int vetId);

        // حظر مستخدم
        Task<bool> BanUserAsync(int userId, string? reason);

        // فك الحظر عن مستخدم
        Task<bool> UnbanUserAsync(int userId);
    }
}