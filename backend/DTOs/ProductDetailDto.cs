namespace PetHaven.DTOs
{
    public class ProductReviewDto
    {
        public int RatingId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int StarsCount { get; set; }
        public string? ReviewText { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ProductDetailDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public int StockQuantity { get; set; }

        public decimal OriginalPrice { get; set; }
        public decimal DiscountRate { get; set; }
        public decimal FinalPrice { get; set; }

        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;

        public int CenterId { get; set; }
        public string CenterName { get; set; } = string.Empty;

        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public List<ProductReviewDto> Reviews { get; set; } = new List<ProductReviewDto>();
    }
}