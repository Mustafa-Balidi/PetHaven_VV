using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;

namespace PetHaven.Services
{
    public class CenterWalletService : ICenterWalletService
    {
        private const string PaidStatus = "Paid";

        private readonly ApplicationDbContext _context;

        public CenterWalletService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // GET: ملخّص المحفظة (الرصيد + أحدث الحركات)
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<CenterWalletDto> GetWalletAsync(string userId, int transactionsCount = 10)
        {
            var center = await GetCenterAsync(userId);

            if (transactionsCount < 1) transactionsCount = 1;
            if (transactionsCount > 50) transactionsCount = 50;

            var paidItems = PaidItemsQuery(center.CenterId);

            var today = DateTime.UtcNow.Date;
            var startOfMonth = new DateTime(today.Year, today.Month, 1);

            var balance = await paidItems.SumAsync(oi => oi.UnitPrice * oi.Quantity);

            var pendingBalance = await _context.OrderItems
                .Where(oi => oi.Product!.CenterId == center.CenterId
                             && oi.Order!.Status != PaidStatus)
                .SumAsync(oi => oi.UnitPrice * oi.Quantity);

            var earningsToday = await paidItems
                .Where(oi => oi.Order!.OrderDate.Date == today)
                .SumAsync(oi => oi.UnitPrice * oi.Quantity);

            var earningsThisMonth = await paidItems
                .Where(oi => oi.Order!.OrderDate >= startOfMonth)
                .SumAsync(oi => oi.UnitPrice * oi.Quantity);

            var soldItemsCount = await paidItems.SumAsync(oi => oi.Quantity);

            var paidOrdersCount = await paidItems
                .Select(oi => oi.OrderId)
                .Distinct()
                .CountAsync();

            var transactions = await BuildTransactionsAsync(center.CenterId, skip: 0, take: transactionsCount);

            return new CenterWalletDto
            {
                CenterId            = center.CenterId,
                CenterName          = center.CenterName,
                Balance             = balance,
                PendingBalance      = pendingBalance,
                EarningsToday       = earningsToday,
                EarningsThisMonth   = earningsThisMonth,
                PaidOrdersCount     = paidOrdersCount,
                SoldItemsCount      = soldItemsCount,
                LastTransactionDate = transactions.FirstOrDefault()?.Date,
                Transactions        = transactions
            };
        }

        // ═══════════════════════════════════════════════════════════════════════
        // GET: حركات المحفظة مع ترقيم الصفحات
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<CenterWalletTransactionsPageDto> GetTransactionsAsync(string userId, int page = 1, int pageSize = 10)
        {
            var center = await GetCenterAsync(userId);

            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 1;
            if (pageSize > 100) pageSize = 100;

            var totalCount = await PaidItemsQuery(center.CenterId)
                .Select(oi => oi.OrderId)
                .Distinct()
                .CountAsync();

            var items = await BuildTransactionsAsync(center.CenterId, (page - 1) * pageSize, pageSize);

            return new CenterWalletTransactionsPageDto
            {
                TotalCount = totalCount,
                Page       = page,
                PageSize   = pageSize,
                Items      = items
            };
        }

        // ─── مساعدات خاصة ────────────────────────────────────────────────────

        /// <summary>عناصر الطلبات المدفوعة التي تخص منتجات هذا المركز فقط.</summary>
        private IQueryable<OrderItem> PaidItemsQuery(int centerId) =>
            _context.OrderItems
                .Where(oi => oi.Product!.CenterId == centerId
                             && oi.Order!.Status == PaidStatus);

        private async Task<AdoptionCenter> GetCenterAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");

            var center = await _context.AdoptionCenters
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);

            if (center == null)
                throw new Exception("لم يتم العثور على حساب المركز.");

            return center;
        }

        /// <summary>
        /// بناء الحركات: كل طلب مدفوع يُحسب كحركة واحدة، ومبلغها = مجموع منتجات
        /// هذا المركز داخل الطلب (الطلب قد يحتوي منتجات لمراكز أخرى).
        /// </summary>
        private async Task<List<CenterWalletTransactionDto>> BuildTransactionsAsync(int centerId, int skip, int take)
        {
            // 1. تحديد الطلبات المطلوبة أولاً (حتى لا نجلب كل السجلات)
            var pagedOrders = await PaidItemsQuery(centerId)
                .Select(oi => new { oi.OrderId, oi.Order!.OrderDate })
                .Distinct()
                .OrderByDescending(x => x.OrderDate)
                .ThenByDescending(x => x.OrderId)
                .Skip(skip)
                .Take(take)
                .ToListAsync();

            if (pagedOrders.Count == 0)
                return new List<CenterWalletTransactionDto>();

            var orderIds = pagedOrders.Select(x => x.OrderId).ToList();

            // 2. جلب تفاصيل عناصر هذه الطلبات فقط
            var rows = await PaidItemsQuery(centerId)
                .Where(oi => orderIds.Contains(oi.OrderId))
                .Select(oi => new
                {
                    oi.OrderId,
                    oi.Quantity,
                    oi.UnitPrice,
                    OrderDate   = oi.Order!.OrderDate,
                    ProductName = oi.Product!.Name,
                    BuyerName   = oi.Order!.User != null ? oi.Order.User.FullName : null
                })
                .ToListAsync();

            // 3. تجميع العناصر في حركة واحدة لكل طلب
            return rows
                .GroupBy(r => r.OrderId)
                .Select(g => new CenterWalletTransactionDto
                {
                    Id          = $"order-{g.Key}",
                    OrderId     = g.Key,
                    Description = BuildDescription(g.Select(x => x.ProductName).ToList()),
                    Date        = g.First().OrderDate,
                    Amount      = g.Sum(x => x.UnitPrice * x.Quantity),
                    Type        = "credit",
                    ItemsCount  = g.Sum(x => x.Quantity),
                    BuyerName   = g.First().BuyerName
                })
                .OrderByDescending(t => t.Date)
                .ThenByDescending(t => t.OrderId)
                .ToList();
        }

        private static string BuildDescription(List<string> productNames)
        {
            if (productNames.Count == 0) return string.Empty;
            if (productNames.Count == 1) return productNames[0];

            return $"{productNames[0]} +{productNames.Count - 1}";
        }
    }
}
