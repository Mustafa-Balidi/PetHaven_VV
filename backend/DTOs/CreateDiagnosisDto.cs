namespace PetHaven.DTOs
{
    /// <summary>
    /// DTO لإضافة فحص طبي جديد للسجل الطبي
    /// </summary>
    public class CreateDiagnosisDto
    {
        public string? Symptoms { get; set; }
        public string? Result { get; set; }
    }
}
