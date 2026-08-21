namespace PetHaven.DTOs
{
    public class VetPendingDto
    {
        public int VetId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Specialization { get; set; }
        public string? ClinicName { get; set; }
        public string? ClinicAddress { get; set; }
        public string? LicenseNumber { get; set; }
        public int? ExperienceYears { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}