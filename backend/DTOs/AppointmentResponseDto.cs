namespace PetHaven.DTOs
{
    /// <summary>
    /// يعرض بيانات موعد واحد في لوحة تحكم العيادة البيطرية.
    /// </summary>
    public class AppointmentResponseDto
    {
        public int AppointmentId { get; set; }
        public int PetId { get; set; }
        public string PetName { get; set; } = string.Empty;
        public string? Species { get; set; }
        public string? Breed { get; set; }
        public string? PetImageUrl { get; set; }
        public string OwnerName { get; set; } = string.Empty;
        public DateTime AppointmentDate { get; set; }
        public string? Status { get; set; }
        public string? Reason { get; set; }

        /// <summary>تنسيق وقت الموعد (مثال 09:00 AM)</summary>
        public string TimeDisplay { get; set; } = string.Empty;
    }
}
