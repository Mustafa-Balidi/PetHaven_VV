namespace PetHaven.DTOs
{
    public class ProductRequestDto
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal ProductPrice { get; set; }
        public decimal DiscountRate { get; set; }
        public int StockQuantity { get; set; }
        public string? ImageUrl { get; set; }
    }
}
