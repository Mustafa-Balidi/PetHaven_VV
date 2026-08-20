namespace PetHaven.DTOs
{
    public class RecentAdoptionDto
    {
      //  public int PetId { get; set; }              // للتنقل لصفحة التفاصيل
        public string PetName { get; set; } = string.Empty;
        public string? PetImageUrl { get; set; }
        public DateTime AdoptedDate { get; set; }
    }
}