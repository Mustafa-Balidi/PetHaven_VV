using PetHaven.DTOs;

namespace PetHaven.Services
{
    public interface ICartService
    {
        Task<CartResponseDto> GetUserCartAsync(string userId);
        Task AddToCartAsync(AddToCartRequestDto dto, string userId);
        Task UpdateCartItemQuantityAsync(int cartItemId, UpdateCartItemRequestDto dto, string userId);
        Task RemoveFromCartAsync(int cartItemId, string userId);
        Task ClearCartAsync(string userId);
    }
}
