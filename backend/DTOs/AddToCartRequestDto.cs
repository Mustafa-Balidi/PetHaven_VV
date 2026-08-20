using System.ComponentModel.DataAnnotations;

namespace PetHaven.DTOs
{
    public class AddToCartRequestDto
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }
    }
}
