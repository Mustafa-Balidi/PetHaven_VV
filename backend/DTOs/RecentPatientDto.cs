namespace PetHaven.DTOs
{
    /// <summary>
    /// مريض من قائمة المرضى الأخيرين في لوحة تحكم الطبيب.
    /// </summary>
    public class RecentPatientDto
    {
        public int PetId { get; set; }
        public string PetName { get; set; } = string.Empty;
        public string? Species { get; set; }
        public string? Breed { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime? LastVisitDate { get; set; }
        public int VisitCount { get; set; }
    }
}
