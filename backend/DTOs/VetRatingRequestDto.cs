using System.ComponentModel.DataAnnotations;

namespace PetHaven.DTOs
{
    public class VetRatingRequestDto
    {
        /// <summary>
        /// معرف الطبيب البيطري
        /// </summary>
        /// <example>1</example>
        [Required]
        public int VetId { get; set; }

        [Required]
        [Range(1, 5, ErrorMessage = "التقييم يجب أن يكون بين 1 و 5.")]
        public int Rating { get; set; }

        /// <summary>
        /// التعليق
        /// </summary>
        /// <example>كان الطبيب فوق الوصف</example>
        public string? ReviewText { get; set; }
    }
}
