using PetHaven.DTOs;

namespace PetHaven.Services
{
    /// <summary>
    /// محفظة مركز التبني: الرصيد المتحصّل من بيع منتجات المركز.
    /// الرصيد مشتق من الطلبات المدفوعة (Order.Status == "Paid") ولا يحتاج أي عمود جديد
    /// في قاعدة البيانات، لذلك يبقى متوافقاً مع أي طلب دُفع سابقاً.
    /// </summary>
    public interface ICenterWalletService
    {
        /// <summary>
        /// جلب ملخّص المحفظة (الرصيد + أحدث الحركات) للمركز صاحب هذا المستخدم.
        /// </summary>
        /// <param name="userId">معرّف المستخدم (من التوكن)</param>
        /// <param name="transactionsCount">عدد الحركات الأخيرة المطلوبة (افتراضي 10)</param>
        Task<CenterWalletDto> GetWalletAsync(string userId, int transactionsCount = 10);

        /// <summary>
        /// جلب حركات المحفظة مع ترقيم الصفحات.
        /// </summary>
        Task<CenterWalletTransactionsPageDto> GetTransactionsAsync(string userId, int page = 1, int pageSize = 10);
    }
}
