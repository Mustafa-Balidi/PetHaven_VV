using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;

namespace PetHaven.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly ApplicationDbContext _context;

        public PaymentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ProcessPaymentAsync(PaymentRequestDto dto, string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");

            // 1. جلب الطلب والتأكد من أنه يخص هذا المستخدم
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.OrderId == dto.OrderId && o.UserId == parsedUserId);

            if (order == null)
                throw new Exception("الطلب غير موجود أو لا تملك صلاحية الوصول إليه.");

            if (order.Status == "Paid")
                throw new Exception("تم دفع قيمة هذا الطلب مسبقاً.");

            // 2. جلب المتبني (Adopter) للتحقق من الرصيد
            var adopter = await _context.Adopters
                .FirstOrDefaultAsync(a => a.UserId == parsedUserId);

            if (adopter == null)
                throw new Exception("لم يتم العثور على حساب المتبني.");

            //  3. التحقق من كفاية الرصيد
            if (adopter.Balance < order.TotalPrice)
                throw new Exception($"الرصيد غير كافٍ. الرصيد الحالي: {adopter.Balance:C}، المطلوب: {order.TotalPrice:C}.");

            //  4. خصم المبلغ من الرصيد
            adopter.Balance -= order.TotalPrice;

            // 5. إنشاء سجل الدفع الجديد في قاعدة البيانات
            var payment = new Payment
            {
                OrderId = order.OrderId,
                Amount = order.TotalPrice,
                PaymentMethod = dto.PaymentMethod,
                PaymentStatus = "Completed",
                PaymentDate = DateTime.UtcNow
            };

            _context.Payments.Add(payment);

            // 6. تحديث حالة الطلب ليصبح مدفوعاً
            // ملاحظة: بمجرد أن تصبح الحالة "Paid" يدخل مبلغ منتجات كل مركز إلى
            // محفظته تلقائياً (انظر CenterWalletService) دون أي عمود إضافي في القاعدة.
            order.Status = "Paid";

            // 7. حفظ جميع التغييرات في معاملة واحدة (Transaction)
            await _context.SaveChangesAsync();

            return true;
        }
    }
}