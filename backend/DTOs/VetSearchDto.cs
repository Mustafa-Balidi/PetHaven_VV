namespace PetHaven.DTOs
{
    public class VetSearchDto
    {
        // 33.600368070539005, 36.329190419824755
        /// <summary>
        /// خط عرض المستخدم -  التل،
        /// </summary>
        /// <example>33.600368</example>
        public double? UserLatitude { get; set; }

        /// <summary> خط طول المستخدم -  التل </summary>
        /// <example>36.329190</example>
        public double? UserLongitude { get; set; }

        /// <summary> نصف قطر البحث بالكيلومتر </summary>
        /// <example>50</example>
        public decimal? Radius { get; set; }

        /// <summary> طريقة الترتيب </summary>
        /// <example>Distance</example>
        public string? SortBy { get; set; }

        /// <summary>  التخصص </summary>
        /// <example>Small Animal Medicine</example>
        public string? Specialization { get; set; }
    }
}
