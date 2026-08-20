namespace PetHaven.DTOs
{
    public class PaymentRequestDto
    {
        public int OrderId { get; set; }

        // قد يرسل لك "Stripe" أو "ShamCash" لتسجيلها في قاعدة البيانات
        public string PaymentMethod { get; set; } = string.Empty;

        // إذا استخدموا Stripe، سيرسلون لك رقم العملية كإثبات
        public string? TransactionId { get; set; }
    }
}