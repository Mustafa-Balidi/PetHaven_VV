public class CreateAppointmentDto
{
    /// <summary>
    /// معرف المربي في النظام
    /// </summary>
    /// <example>1</example>     
    public int PetId { get; set; }

    /// <summary>
    /// معرف الطبيب البيطري
    /// </summary>
    /// <example>1</example>
    public int VetId { get; set; }

    /// <summary>
    /// تاريخ الموعد
    /// </summary>
    /// <example>2026-07-10T10:00:00Z</example>
    public DateTime AppointmentDate { get; set; }

    /// <summary>
    /// سبب حجز الموعد
    /// </summary>
    /// <example>فحص دوري وتلقيم القطة</example>
    public string? Reason { get; set; }
}
