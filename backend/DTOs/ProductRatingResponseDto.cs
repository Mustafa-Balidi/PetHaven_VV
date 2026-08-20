namespace PetHaven.DTOs
{
    public class ProductRatingResponseDto
    {
        public int RatingId { get; set; }
        public int ProductId { get; set; }
        public string AdopterId { get; set; } = string.Empty;
        public string AdopterName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
