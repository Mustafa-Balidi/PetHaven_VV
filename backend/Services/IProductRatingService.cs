using PetHaven.DTOs;

namespace PetHaven.Services
{
    public interface IProductRatingService
    {
        Task<ProductRatingResponseDto> AddRatingAsync(string userId, ProductRatingRequestDto request);
        Task<IEnumerable<ProductRatingResponseDto>> GetProductRatingsAsync(int productId);
        Task<CenterProductReviewsResponseDto> GetCenterReviewsAsync(string userId);
    }
}
