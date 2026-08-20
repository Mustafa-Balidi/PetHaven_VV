namespace PetHaven.DTOs
{
    public class ProductResponseDto
    {
        public int ProductId { get; set; }
        public int CenterId { get; set; }
        public string CenterName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal ProductPrice { get; set; }
        public decimal DiscountRate { get; set; }
        public decimal PriceAfterDiscount { get; set; }
        public int StockQuantity { get; set; }
        public string? ImageUrl { get; set; }
    }
}
