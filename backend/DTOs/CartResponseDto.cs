namespace PetHaven.DTOs
{
    public class CartResponseDto
    {
        public int CartId { get; set; }
        public decimal CartTotal { get; set; }
        public List<CartItemResponseDto> Items { get; set; } = new List<CartItemResponseDto>();
    }
}
