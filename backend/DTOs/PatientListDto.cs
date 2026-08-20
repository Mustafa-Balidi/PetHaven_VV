namespace PetHaven.DTOs
{
    /// <summary>
    /// بطاقة مريض واحدة في صفحة دليل المرضى.
    /// </summary>
    public class PatientListDto
    {
        public int PetId { get; set; }
        public string PetName { get; set; } = string.Empty;
        public string? Species { get; set; }
        public string? Breed { get; set; }
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string? ImageUrl { get; set; }
        public string? HealthStatus { get; set; }

        /// <summary>شارة الحالة: Healthy / Requires Follow-up / Upcoming Vaccine</summary>
        public string Status { get; set; } = "Healthy";
        public string OwnerName { get; set; } = string.Empty;
        public DateTime? LastVisitDate { get; set; }
        public int VisitCount { get; set; }
        public string? PatientIdDisplay { get; set; }
    }
}
