namespace PetHaven.DTOs
{
    /// <summary>
    /// تطعيمة ضمن سجل المناعة للحيوان.
    /// </summary>
    public class VaccinationDto
    {
        public int VaccinationId { get; set; }
        public int PetId { get; set; }
        public string VaccineName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime VaccinationDate { get; set; }
        public DateTime? NextDueDate { get; set; }

        /// <summary>الحالة المستنتجة: Up to date / Due soon / Overdue</summary>
        public string Status { get; set; } = string.Empty;
    }
}
