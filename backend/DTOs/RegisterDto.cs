using System.ComponentModel.DataAnnotations;

namespace PetHaven.DTOs
{
    public class RegisterDto
    {
        [Required]
        [MaxLength(200)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string UserName { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? PhoneNumber { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(200)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Role { get; set; } = string.Empty;

        //// حقول الطبيب البيطري (Vet) — تُستخدم فقط عند التسجيل بدور Veterinarian
        //[MaxLength(100)]
        //public string? Specialization { get; set; }

        //[MaxLength(500)]
        //public string? ClinicName { get; set; }

        //[MaxLength(500)]
        //public string? ClinicAddress { get; set; }

        //public int? ExperienceYears { get; set; }

        //[MaxLength(50)]
        //public string? LicenseNumber { get; set; }

        //public decimal? Location_Lat { get; set; }
        //public decimal? Location_Lng { get; set; }
    }
}