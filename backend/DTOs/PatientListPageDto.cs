namespace PetHaven.DTOs
{
    /// <summary>
    /// نتيجة صفحة دليل المرضى مع ترقيم الصفحات.
    /// </summary>
    public class PatientListPageDto
    {
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public IEnumerable<PatientListDto> Items { get; set; } = new List<PatientListDto>();
    }
}
