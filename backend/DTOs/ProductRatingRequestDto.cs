using System.ComponentModel.DataAnnotations;

namespace PetHaven.DTOs
{
    public class ProductRatingRequestDto
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int Rating { get; set; }

        public string? Comment { get; set; }
    }
}
