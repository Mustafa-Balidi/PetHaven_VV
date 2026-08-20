namespace PetHaven.DTOs
{
    /// <summary>
    /// إدخال واحد ضمن السجل الطبي (Timeline) - يُشتق من الفحوصات (Diagnoses).
    /// </summary>
    public class MedicalHistoryEntryDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }

        /// <summary>نوع الإدخال: CONSULTATION / ROUTINE / TREATMENT</summary>
        public string Type { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? DoctorName { get; set; }
    }
}
