namespace PetHaven.DTOs
{
    public class UpdateAdopterProfileDto
    {
        public string FullName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string? HousingType { get; set; }
        public string? ExperienceLevel { get; set; }
        public int? FreeHoursPerDay { get; set; }

        public bool? HasPetBefore { get; set; }

        public string? ImageUrl { get; set; }

    }
}