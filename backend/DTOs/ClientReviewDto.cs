namespace PetHaven.DTOs
{
    public class ClientReviewDto
    {
        public int RatingId { get; set; }
        public string ReviewerName { get; set; } = string.Empty;
        public int StarsCount { get; set; }
        public string? ReviewText { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
