namespace PetHaven.DTOs
{
    /// <summary>
    /// فئة من فئات المواعيد في مخطط التوزيع (Check-up / Vaccination / Surgeries / Other).
    /// </summary>
    public class AppointmentBreakdownDto
    {
        public string Category { get; set; } = string.Empty;
        public int Count { get; set; }
        public double Percentage { get; set; }
    }
}
