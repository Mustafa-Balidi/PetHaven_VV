using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;

namespace PetHaven.Services
{
    public class CenterDashboardService : ICenterDashboardService
    {
        private readonly ApplicationDbContext _context;

        public CenterDashboardService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ─── 1. الإحصائيات (أرقام فقط) ──────────────────────────────────────
        public async Task<CenterDashboardStatsDto> GetDashboardStatsAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");

            var center = await _context.AdoptionCenters
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);

            if (center == null)
                throw new Exception("لم يتم العثور على حساب المركز.");

            var today = DateTime.UtcNow.Date;
            var startOfMonth = new DateTime(today.Year, today.Month, 1);

            var availablePetsCount = await _context.Pets
                .CountAsync(p => p.CenterId == center.CenterId);

            var pendingRequestsCount = await _context.AdoptionRequests
                .Include(r => r.Pet)
                .CountAsync(r => r.Pet.CenterId == center.CenterId && r.Status == "Pending");

            var successfulAdoptionsThisMonth = await _context.AdoptionRequests
                .Include(r => r.Pet)
                .CountAsync(r => r.Pet.CenterId == center.CenterId
                                 && r.Status == "Approved"
                                 && r.CreatedAt >= startOfMonth);

            var storeSalesToday = await _context.Orders
                .Where(o => o.UserId == parsedUserId && o.OrderDate.Date == today && o.Status == "Paid")
                .SumAsync(o => o.TotalPrice);

            return new CenterDashboardStatsDto
            {
                AvailablePetsCount = availablePetsCount,
                PendingRequestsCount = pendingRequestsCount,
                SuccessfulAdoptionsThisMonth = successfulAdoptionsThisMonth,
                StoreSalesToday = storeSalesToday
            };
        }

        // ─── 2. الطلبات الأخيرة ──────────────────────────────────────────────
        public async Task<IEnumerable<OrderResponseDto>> GetLatestOrdersAsync(string userId, int count = 5)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");

            return await _context.Orders
                .Where(o => o.UserId == parsedUserId)
                .Include(o => o.OrderItems!)
                    .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.OrderDate)
                .Take(count)
                .Select(o => new OrderResponseDto
                {
                    OrderId = o.OrderId,
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalPrice,
                    Status = o.Status ?? string.Empty,
                    Items = o.OrderItems != null
                        ? o.OrderItems.Select(oi => new OrderItemDto
                        {
                            ProductId = oi.ProductId,
                            ProductName = oi.Product != null ? oi.Product.Name : string.Empty,
                            Quantity = oi.Quantity,
                            UnitPrice = oi.UnitPrice
                        }).ToList()
                        : new List<OrderItemDto>()
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<RecentAdoptionDto>> GetRecentAdoptionsAsync(string userId)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");

            var center = await _context.AdoptionCenters
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);

            if (center == null)
                throw new Exception("لم يتم العثور على حساب المركز.");

            return await _context.AdoptionRequests
                .Include(r => r.Pet)
                .Where(r => r.Pet.CenterId == center.CenterId && r.Status == "Approved")
                .OrderByDescending(r => r.CreatedAt)
                .Take(3)
                .Select(r => new RecentAdoptionDto
                {
                    PetName = r.Pet.PetName,
                    PetImageUrl = r.Pet.ImageURL,
                    AdoptedDate = r.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<RecentProductSaleDto>> GetRecentProductSalesAsync(string userId, int count = 3)
        {
            if (!int.TryParse(userId, out int parsedUserId))
                throw new Exception("معرّف المستخدم غير صالح.");

            // 1. جلب المركز
            var center = await _context.AdoptionCenters
                .FirstOrDefaultAsync(c => c.UserId == parsedUserId);

            if (center == null)
                throw new Exception("لم يتم العثور على حساب المركز.");

            // 2. جلب أحدث المنتجات المباعة من هذا المركز
            return await _context.OrderItems
                .Include(oi => oi.Order)
                .Include(oi => oi.Product)
                .Where(oi => oi.Product.CenterId == center.CenterId  // ✅ منتجات هذا المركز فقط
                             && oi.Order.Status == "Paid")           // ✅ مدفوعة فقط
                .OrderByDescending(oi => oi.Order.OrderDate)
                .Take(count)
                .Select(oi => new RecentProductSaleDto
                {
                    ProductName = oi.Product != null ? oi.Product.Name : "غير معروف",
                    Price = oi.UnitPrice,
                    SoldDate = oi.Order.OrderDate,
                    ProductImageUrl = oi.Product != null ? oi.Product.ImageURL : null
                })
                .ToListAsync();


        }

    }
}