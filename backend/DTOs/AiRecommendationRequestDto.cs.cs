using System.Text.Json.Serialization;

namespace PetHaven.DTOs
{
    public class AiRecommendationRequestDto
    {
        [JsonPropertyName("housing_type")]
        public string HousingType { get; set; } = string.Empty;

        [JsonPropertyName("outdoor_space")]
        public string OutdoorSpace { get; set; } = string.Empty;

        [JsonPropertyName("family_type")]
        public string FamilyType { get; set; } = string.Empty;

        [JsonPropertyName("hours_available")]
        public string HoursAvailable { get; set; } = string.Empty;

        [JsonPropertyName("weekend_time")]
        public string WeekendTime { get; set; } = string.Empty;

        [JsonPropertyName("experience_level")]
        public string ExperienceLevel { get; set; } = string.Empty;

        [JsonPropertyName("training_ability")]
        public string TrainingAbility { get; set; } = string.Empty;

        [JsonPropertyName("activity_level")]
        public string ActivityLevel { get; set; } = string.Empty;

        [JsonPropertyName("noise_tolerance")]
        public string NoiseTolerance { get; set; } = string.Empty;

        [JsonPropertyName("budget_level")]
        public string BudgetLevel { get; set; } = string.Empty;

        [JsonPropertyName("maintenance_tolerance")]
        public string MaintenanceTolerance { get; set; } = string.Empty;

        [JsonPropertyName("size_preference")]
        public string SizePreference { get; set; } = string.Empty;

        [JsonPropertyName("grooming_tolerance")]
        public string GroomingTolerance { get; set; } = string.Empty;

        [JsonPropertyName("energy_preference")]
        public string EnergyPreference { get; set; } = string.Empty;

        [JsonPropertyName("affection_preference")]
        public string AffectionPreference { get; set; } = string.Empty;

        [JsonPropertyName("top_n")]
        public int TopN { get; set; } = 3;
    }
}