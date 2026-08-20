namespace PetHaven.DTOs
{
    /// <summary>
    /// تفاصيل مريض كاملة في صفحة تفصيل المريض.
    /// </summary>
    public class PatientDetailDto
    {
        public int PetId { get; set; }
        public string PetName { get; set; } = string.Empty;
        public string? Species { get; set; }
        public string? Breed { get; set; }
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string? ImageUrl { get; set; }
        public string? HealthStatus { get; set; }
        public string Status { get; set; } = "Healthy";
        public string OwnerName { get; set; } = string.Empty;
        public string? PatientIdDisplay { get; set; }
        public DateTime? LastVisitDate { get; set; }
        public int VisitCount { get; set; }
        public IEnumerable<MedicalHistoryEntryDto> MedicalHistory { get; set; } = new List<MedicalHistoryEntryDto>();
        public IEnumerable<VaccinationDto> Vaccinations { get; set; } = new List<VaccinationDto>();
    }
}
