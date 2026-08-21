using Microsoft.AspNetCore.Http;

namespace PetHaven.DTOs
{
    public class VetVerificationStatusDto
    {
        public int VetId { get; set; }
        public string Status { get; set; } = "Pending"; // Pending / Approved / Rejected
        public string? LicenseNumber { get; set; }
        public DateTime? LicenseIssueDate { get; set; }
        public string? CertificateUrl { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public string? RejectionReason { get; set; }
    }

    public class SubmitVetVerificationDto
    {
        public string LicenseNumber { get; set; } = string.Empty;
        public DateTime? IssueDate { get; set; }
        public IFormFile? CertificateFile { get; set; }
    }
}
