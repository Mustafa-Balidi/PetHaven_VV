namespace PetHaven.DTOs
{
    public class ServiceRecommendationDto
    {
        public string ServiceName { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public decimal EstimatedPrice { get; set; }
    }
}