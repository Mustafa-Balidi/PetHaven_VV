using System.ComponentModel.DataAnnotations;

namespace PetHaven.DTOs
{
    public class VaccinationRequestDto
    {
        [Required]
        [MaxLength(200)]
        public string VaccineName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public DateTime VaccinationDate { get; set; }

        public DateTime? NextDueDate { get; set; }
    }
}
