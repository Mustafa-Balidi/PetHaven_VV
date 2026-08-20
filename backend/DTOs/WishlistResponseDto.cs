namespace PetHaven.DTOs
{
    public class WishlistResponseDto
    {
        public int WishlistItemId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal CurrentPrice { get; set; }
        public string? ImageUrl { get; set; }
    }
}
