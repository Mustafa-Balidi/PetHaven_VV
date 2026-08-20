using System;

namespace PetHaven.DTOs
{
    /// <summary>
    /// طلب إعادة جدولة موعد.
    /// </summary>
    public class RescheduleAppointmentDto
    {
        /// <summary>
        /// التاريخ الجديد للموعد.
        /// </summary>
        /// <example>2026-07-15T14:30:00Z</example>
        public DateTime NewDate { get; set; }
    }
}
