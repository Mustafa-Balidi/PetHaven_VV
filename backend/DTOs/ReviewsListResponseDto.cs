namespace PetHaven.DTOs
{
    public class ReviewsListResponseDto
    {
        public ReviewsStatsDto Stats { get; set; } = new();
        public IEnumerable<ClientReviewDto> Items { get; set; } = new List<ClientReviewDto>();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
    }
}
