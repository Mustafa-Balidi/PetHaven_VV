using PetHaven.DTOs;
using System.Net.Http.Json;
using System;
using System.Threading.Tasks;

namespace PetHaven.Services
{
    public class RecommendationAiService : IRecommendationAiService
    {
        private readonly HttpClient _httpClient;

        public RecommendationAiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<object> GetServicesAsync(AiRecommendationRequestDto requestData)
        {
            var response = await _httpClient.PostAsJsonAsync("http://localhost:8000/recommend", requestData);

            // 👈 التعديل هنا: إذا رفض البايثون الطلب، سنقرأ رسالة الخطأ ونعرضها في Swagger
            if (!response.IsSuccessStatusCode)
            {
                var errorDetails = await response.Content.ReadAsStringAsync();
                throw new Exception($"رفض سيرفر الـ AI الطلب. التفاصيل: {errorDetails}");
            }

            var aiResult = await response.Content.ReadFromJsonAsync<object>();

            return aiResult ?? new object();
        }
    }
}