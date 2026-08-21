namespace PetHaven.DTOs
{
    /// <summary>
    /// حركة واحدة في محفظة المركز (طلب واحد مدفوع يخص منتجات هذا المركز).
    /// </summary>
    public class CenterWalletTransactionDto
    {
        /// <summary>معرّف الحركة (order-{OrderId}) لاستخدامه كـ key في الواجهة.</summary>
        public string Id { get; set; } = string.Empty;

        public int OrderId { get; set; }

        /// <summary>وصف مختصر: أسماء المنتجات المباعة في هذا الطلب.</summary>
        public string Description { get; set; } = string.Empty;

        public DateTime Date { get; set; }

        /// <summary>المبلغ الذي دخل محفظة المركز من هذا الطلب.</summary>
        public decimal Amount { get; set; }

        /// <summary>credit = دخل للمحفظة، debit = خرج منها.</summary>
        public string Type { get; set; } = "credit";

        public int ItemsCount { get; set; }

        public string? BuyerName { get; set; }
    }
}
