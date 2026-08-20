namespace PetHaven.DTOs
{
    /// <summary>
    /// إحصائيات بطاقات صفحة دليل المرضى (Patient Directory).
    /// </summary>
    public class VetPatientsStatsDto
    {
        public int TotalPatients { get; set; }
        public int ActiveCases { get; set; }
        public int RecentlyAdded30d { get; set; }
    }
}
