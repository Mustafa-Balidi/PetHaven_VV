using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PetHaven.Models
{
    public class Vaccination
    {
        [Key]
        public int VaccinationId { get; set; }

        [Required]
        public int PetId { get; set; }

        [Required]
        [MaxLength(200)]
        public string VaccineName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public DateTime VaccinationDate { get; set; }

        public DateTime? NextDueDate { get; set; }

        // العلاقات
        [ForeignKey("PetId")]
        public virtual Pet? Pet { get; set; }
    }
}
