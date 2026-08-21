namespace PetHaven.DTOs
{
    public class AdminStatsDto
    {
        public int TotalUsers { get; set; }
        public int Adopters { get; set; }
        public int Centers { get; set; }
        public int Vets { get; set; }
        public int Admins { get; set; }
        public int TotalPets { get; set; }
        public int BannedUsers { get; set; }
        //   public int TotalOrders { get; set; }
        //   public int PendingAdoptions { get; set; }
    }
}