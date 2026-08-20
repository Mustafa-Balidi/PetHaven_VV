namespace PetHaven.DTOs
{
    public class CenterDashboardStatsDto
    {
        public int AvailablePetsCount { get; set; }
        public int PendingRequestsCount { get; set; }
        public int SuccessfulAdoptionsThisMonth { get; set; }
        public decimal StoreSalesToday { get; set; }
    }
}