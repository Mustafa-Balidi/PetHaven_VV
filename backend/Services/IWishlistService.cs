using PetHaven.DTOs;

namespace PetHaven.Services
{
    public interface IWishlistService
    {
        Task<IEnumerable<WishlistResponseDto>> GetUserWishlistAsync(string userId);
        Task AddToWishlistAsync(int productId, string userId);
        Task RemoveFromWishlistAsync(int productId, string userId);
    }
}
