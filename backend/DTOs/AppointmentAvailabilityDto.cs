namespace PetHaven.DTOs
{
    /// <summary>
    /// Public availability information for a veterinarian on one date.
    /// Contains no adopter, pet, or occupied-appointment details.
    /// </summary>
    public class AppointmentAvailabilityDto
    {
        public int VetId { get; set; }
        public string Date { get; set; } = string.Empty;
        public int SlotDurationMinutes { get; set; }
        public IReadOnlyList<string> AvailableSlots { get; set; } = Array.Empty<string>();
    }
}
