namespace PetHaven.DTOs
{
    /// <summary>
    /// محفظة مركز التبني: الرصيد المتحصّل من بيع منتجات المركز للمتبنّين.
    /// </summary>
    public class CenterWalletDto
    {
        public int CenterId { get; set; }

        public string CenterName { get; set; } = string.Empty;

        /// <summary>الرصيد الحالي = مجموع قيمة منتجات المركز في الطلبات المدفوعة.</summary>
        public decimal Balance { get; set; }

        /// <summary>مبالغ طلبات لم تُدفع بعد (غير محسوبة ضمن الرصيد).</summary>
        public decimal PendingBalance { get; set; }

        public decimal EarningsToday { get; set; }

        public decimal EarningsThisMonth { get; set; }

        /// <summary>عدد الطلبات المدفوعة التي احتوت منتجات لهذا المركز.</summary>
        public int PaidOrdersCount { get; set; }

        /// <summary>عدد القطع المباعة (مجموع الكميات).</summary>
        public int SoldItemsCount { get; set; }

        public DateTime? LastTransactionDate { get; set; }

        /// <summary>أحدث الحركات على المحفظة.</summary>
        public IEnumerable<CenterWalletTransactionDto> Transactions { get; set; }
            = new List<CenterWalletTransactionDto>();
    }
}
