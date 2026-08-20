namespace PetHaven.DTOs
{
    public class CenterProductReviewsResponseDto
    {
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public List<CenterRatingBreakdownDto> Breakdown { get; set; } = new();
        public List<CenterProductReviewDto> Reviews { get; set; } = new();
    }

    public class CenterRatingBreakdownDto
    {
        public int Stars { get; set; }
        public int Count { get; set; }
        public int Percent { get; set; }
    }

    public class CenterProductReviewDto
    {
        public int RatingId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string AdopterName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
