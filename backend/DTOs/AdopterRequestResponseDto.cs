namespace PetHaven.DTOs
{
    public class AdopterRequestResponseDto
    {
        public int RequestId { get; set; }
        public int PetId { get; set; }
        public string PetName { get; set; } = string.Empty;
        public string? PetImage { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
        public int Score { get; set; }
        public string? CenterNotes { get; set; }
        public string? Species { get; set; }
        public string? Breed { get; set; }
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string? HealthStatus { get; set; }
        public string? Description { get; set; }
        public string? CenterName { get; set; }
    }
}
