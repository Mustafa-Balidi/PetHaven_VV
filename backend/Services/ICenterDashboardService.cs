using PetHaven.DTOs;

namespace PetHaven.Services
{
    public interface ICenterDashboardService
    {
        /// <summary>
        /// جلب الإحصائيات الأربع للمركز
        /// </summary>
        /// <param name="userId">معرّف المستخدم (من التوكن)</param>
        /// <returns>كائن يحتوي على الأرقام الإحصائية</returns>
        Task<CenterDashboardStatsDto> GetDashboardStatsAsync(string userId);

        /// <summary>
        /// جلب أحدث الطلبات للمركز
        /// </summary>
        /// <param name="userId">معرّف المستخدم (من التوكن)</param>
        /// <param name="count">عدد الطلبات المطلوبة (افتراضي 5)</param>
        /// <returns>قائمة بالطلبات مرتبة من الأحدث للأقدم</returns>
        Task<IEnumerable<OrderResponseDto>> GetLatestOrdersAsync(string userId, int count = 5);


        // To Get Recently pets Adopted 
        Task<IEnumerable<RecentAdoptionDto>> GetRecentAdoptionsAsync(string userId);

        
        // To Get Recently Products Sold 
        Task<IEnumerable<RecentProductSaleDto>> GetRecentProductSalesAsync(string userId, int count = 3);

    }
}