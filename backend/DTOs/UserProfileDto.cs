namespace PetHaven.DTOs
{
    public class UserProfileDto
    {
        // 🔹 الحقول الأساسية المشتركة لجميع المستخدمين
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty; // تأكد من الاسم هنا (Username أو UserName حسب ما اعتمدته)
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string Role { get; set; } = string.Empty;

        public string? ProfileImageUrl { get; set; }

        // 🔹 حقل مشترك بين المتبني والمركز
        public string? Address { get; set; }

        // 🔹 حقول خاصة بالمتبني (Adopter) فقط
        public string? HousingType { get; set; }
        public bool? HasPetBefore { get; set; }
        public string? ExperienceLevel { get; set; }
        public int? FreeHoursPerDay { get; set; }
        public decimal? Balance { get; set; }

        // 🔹 حقول خاصة بالمركز (Center) فقط
        public string? CenterName { get; set; }
        public string? ContactInfo { get; set; }

        // 🔹 حقول خاصة بالطبيب البيطري (Vet) فقط
        public string? ClinicName { get; set; }
        public string? ClinicAddress { get; set; }
        public string? Specialization { get; set; }
        public int? ExperienceYears { get; set; }
        public string? LicenseNumber { get; set; }
        public bool? IsVerified { get; set; }
    }
}
