using Microsoft.AspNetCore.Http;

namespace PetHaven.DTOs
{
    public class UpdateVetProfileDto
    {
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ClinicName { get; set; }
        public string? ClinicAddress { get; set; }
        public string? Specialization { get; set; }
        public int? ExperienceYears { get; set; }
        public string? LicenseNumber { get; set; }
        public string? CertificateUrl { get; set; }
        public IFormFile? CertificateFile { get; set; }
        public decimal? Location_Lat { get; set; }
        public decimal? Location_Lng { get; set; }
    }
}