namespace PetHaven.DTOs
{
    /// <summary>
    /// صفحة من حركات محفظة المركز مع ترقيم الصفحات.
    /// </summary>
    public class CenterWalletTransactionsPageDto
    {
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public IEnumerable<CenterWalletTransactionDto> Items { get; set; }
            = new List<CenterWalletTransactionDto>();
    }
}
