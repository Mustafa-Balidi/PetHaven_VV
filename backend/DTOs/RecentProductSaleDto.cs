namespace PetHaven.DTOs
{
    public class RecentProductSaleDto
    {
        public string ProductName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public DateTime SoldDate { get; set; }
        public string? ProductImageUrl { get; set; }  
    }
}