namespace PetHaven.DTOs
{
    /// <summary>
    /// بطاقات الإحصائيات (KPI) في لوحة تحكم الطبيب البيطري.
    /// </summary>
    public class VetDashboardStatsDto
    {
        public int TotalPatients { get; set; }
        public int AppointmentsToday { get; set; }
        public int RemainingAppointmentsToday { get; set; }
        public int Reviews { get; set; }
        public decimal RevenueThisMonth { get; set; }
    }
}
