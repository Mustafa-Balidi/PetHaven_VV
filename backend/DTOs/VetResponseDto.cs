namespace PetHaven.DTOs
{
    public class VetResponseDto
    {
        public int VetId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Specialization { get; set; }
        public string? ClinicName { get; set; }
        public string? ClinicAddress { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public int? ExperienceYears { get; set; }
        public string? LicenseNumber { get; set; }
        public string? CertificateUrl { get; set; }
        public decimal? Location_Lat { get; set; }
        public decimal? Location_Lng { get; set; }
        public bool IsVerified { get; set; }
        public double? AverageRating { get; set; }
        public int TotalRatings { get; set; }
        public double? DistanceInKm { get; set; }
    }
}
