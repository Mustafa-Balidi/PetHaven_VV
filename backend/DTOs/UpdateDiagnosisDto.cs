namespace PetHaven.DTOs
{
    /// <summary>
    /// DTO لتعديل فحص طبي موجود في السجل الطبي
    /// </summary>
    public class UpdateDiagnosisDto
    {
        public string? Symptoms { get; set; }
        public string? Result { get; set; }
    }
}
