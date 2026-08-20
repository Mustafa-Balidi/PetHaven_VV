using PetHaven.DTOs;

namespace PetHaven.Services
{
    public interface IRecommendationAiService
    {
        Task<object> GetServicesAsync(AiRecommendationRequestDto requestData);
    }
}