namespace PetHaven.DTOs
{
    /// <summary>
    /// سلالة ضمن قائمة السلالات الأكثر تردداً على العيادة.
    /// </summary>
    public class TopBreedDto
    {
        public string Breed { get; set; } = string.Empty;
        public int Count { get; set; }
        public double Percentage { get; set; }
    }
}
