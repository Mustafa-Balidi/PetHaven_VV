namespace PetHaven.DTOs
{
    /// <summary>
    /// نقطة واحدة في مخطط نشاط العيادة (عدد المواعيد لكل يوم/فترة).
    /// </summary>
    public class ClinicActivityPointDto
    {
        public string Label { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}
