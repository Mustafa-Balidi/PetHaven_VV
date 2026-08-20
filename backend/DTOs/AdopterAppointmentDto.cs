namespace PetHaven.DTOs
{
    public class AdopterAppointmentDto
    {
        public int AppointmentId { get; set; }
        public int PetId { get; set; }
        public string PetName { get; set; } = string.Empty;
        public int VetId { get; set; }
        public string VetName { get; set; } = string.Empty;
        public DateTime AppointmentDate { get; set; }
        public string? Reason { get; set; }
        public string? Status { get; set; }
    }
}
