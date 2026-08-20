namespace PetHaven.DTOs
{
    public class ReviewsStatsDto
    {
        /// <summary>معدل التقييم العام (من 5)</summary>
        public double AverageRating { get; set; }

        /// <summary>إجمالي عدد التقييمات</summary>
        public int TotalCount { get; set; }

        /// <summary>عدد التقييمات التي لا تحتوي نصوص (بدون تعليق)</summary>
        public int UnansweredCount { get; set; }

        /// <summary>توزيع النجوم: عدد التقييمات لكل نجمة (المفتاح 1..5)</summary>
        public Dictionary<int, int> StarDistribution { get; set; } = new();

        /// <summary>نسب النجوم المئوية (المفتاح 1..5)</summary>
        public Dictionary<int, double> StarPercentages { get; set; } = new();
    }
}
