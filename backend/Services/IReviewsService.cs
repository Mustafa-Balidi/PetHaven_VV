using PetHaven.DTOs;

namespace PetHaven.Services
{
    public interface IReviewsService
    {
        /// <summary>
        /// جلب تقييمات طبيب محدد (اعتماداً على UserId الخاص بالطبيب)
        /// مع بحث وفلاتر وتقسيم صفحات وإحصائيات.
        /// </summary>
        /// <param name="vetUserId">معرّف المستخدم الخاص بالطبيب</param>
        /// <param name="search">كلمة بحث في اسم المُقيّم أو النص</param>
        /// <param name="filter">all | unanswered</param>
        /// <param name="page">رقم الصفحة (يبدأ من 1)</param>
        /// <param name="pageSize">عدد العناصر في الصفحة</param>
        Task<ReviewsListResponseDto> GetClientReviewsAsync(int vetUserId, string? search, string? filter, int page, int pageSize);
    }
}
