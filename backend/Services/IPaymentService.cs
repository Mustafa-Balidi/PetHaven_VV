using PetHaven.DTOs;

namespace PetHaven.Services
{
    public interface IPaymentService
    {
        Task<bool> ProcessPaymentAsync(PaymentRequestDto dto, string userId);
    }
}