namespace PetHaven.DTOs
{
    /// <summary>
    /// إحصائيات مواعيد اليوم لبطاقات الملخص في لوحة التحكم.
    /// </summary>
    public class AppointmentSummaryDto
    {
        public int TotalToday { get; set; }
        public int ConfirmedCount { get; set; }
        public int PendingCount { get; set; }
        public int CancelledCount { get; set; }
        public int CompletedCount { get; set; }
    }
}
