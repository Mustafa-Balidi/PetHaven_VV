namespace PetHaven.DTOs
{
    public class UpdateCenterProfileDto
    {
        public string CenterName { get; set; } = string.Empty;
        public string? ContactInfo { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }

        public string? ImageUrl { get; set; }
    }
}