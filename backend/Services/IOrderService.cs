using PetHaven.DTOs;

namespace PetHaven.Services
{
    public interface IOrderService
    {
        /// <summary>Converts the user's current cart into a new Order and clears the cart.</summary>
        Task<OrderResponseDto> CheckoutAsync(string userId);

        /// <summary>Returns all orders belonging to the specified adopter.</summary>
        Task<IEnumerable<OrderResponseDto>> GetAdopterOrdersAsync(string userId);

        /// <summary>Updates the Status field of an existing order.</summary>
        Task UpdateOrderStatusAsync(int orderId, string status);
    }
}
