namespace PetHaven.DTOs
{
    public class AdopterDashboardDto
    {
        // 📊 الإحصائيات الأساسية (الأرقام التي تظهر في البطاقات)
        public int PendingAdoptionsCount { get; set; }
        public int AdoptedPetsCount { get; set; }
        public int RecentOrdersCount { get; set; }

        // 🎯 معلومات لرسالة التذكير (Adoption Milestone)
        public int? DaysSinceLastAdoption { get; set; }
        public string? LastAdoptedPetName { get; set; }
        public string? WelcomeMessage { get; set; }
    }
}