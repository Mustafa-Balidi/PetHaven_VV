namespace PetHaven.DTOs
{
    public class VetRatingResponseDto
    {
        public int RatingId { get; set; }
        public int VetId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? ReviewText { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
