using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;

namespace PetHaven.Services
{
    public class VetService : IVetService
    {
        private readonly ApplicationDbContext _context;

        public VetService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // GET: Fetch all vets with ratings
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<IEnumerable<VetResponseDto>> GetAllVetsAsync()
        {
            var vets = await _context.Vets.ToListAsync();
            var vetIds = vets.Select(v => v.VetId).ToList();

            var ratingStats = await _context.Ratings
                .Where(r => r.TargetType == "Vet" && vetIds.Contains(r.TargetId))
                .GroupBy(r => r.TargetId)
                .Select(g => new { VetId = g.Key, AverageRating = g.Average(r => r.StarsCount), TotalRatings = g.Count() })
                .ToDictionaryAsync(x => x.VetId);

            return vets.Select(v => MapToDto(v, null,
                ratingStats.ContainsKey(v.VetId) ? ratingStats[v.VetId].AverageRating : null,
                ratingStats.ContainsKey(v.VetId) ? ratingStats[v.VetId].TotalRatings : 0));
        }

        // ═══════════════════════════════════════════════════════════════════════
        // GET: Search and filter vets with sorting
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<IEnumerable<VetResponseDto>> SearchVetsAsync(VetSearchDto searchDto)
        {
            // 1. بناء الاستعلام الأساسي للأطباء المؤهلين
            var query = _context.Vets
                .Where(v => v.IsVerified)
                .AsQueryable();

            // 2. الفلترة حسب التخصص
            if (!string.IsNullOrEmpty(searchDto.Specialization))
            {
                query = query.Where(v => v.Specialization != null &&
                                         v.Specialization.Contains(searchDto.Specialization));
            }

            // تجهيز قيم إحداثيات المستخدم لتمريرها للدالة
            double? userLat = searchDto.UserLatitude;
            double? userLng = searchDto.UserLongitude;

            // 3. دمج الحسابات (المسافة الاحترافية + التقييمات) في خطوة واحدة على مستوى الـ DB
            var projectedQuery = query.Select(v => new
            {
                Vet = v,
                // استدعاء دالة المسافة التي تم تعريفها في الـ DbContext مباشرة
                Distance = _context.CalculateDistance(userLat, userLng, (double?)v.Location_Lat, (double?)v.Location_Lng),

                AverageRating = _context.Ratings
                    .Where(r => r.TargetType == "Vet" && r.TargetId == v.VetId)
                    .Select(r => (double?)r.StarsCount)
                    .Average(),

                TotalRatings = _context.Ratings
                    .Count(r => r.TargetType == "Vet" && r.TargetId == v.VetId)
            });

            // 4. الفلترة حسب القطر الجغرافي (Radius) داخل قاعدة البيانات
            if (searchDto.Radius.HasValue && searchDto.Radius.Value > 0 && userLat.HasValue && userLng.HasValue)
            {
                var maxDistance = (double)searchDto.Radius.Value;
                projectedQuery = projectedQuery.Where(p => p.Distance.HasValue && p.Distance.Value <= maxDistance);
            }

            // 5. الترتيب (Sorting) على مستوى قاعدة البيانات
            projectedQuery = (searchDto.SortBy?.ToLower()) switch
            {
                "distance" => projectedQuery.OrderBy(p => p.Distance).ThenBy(p => p.Vet.FullName),
                "rating" => projectedQuery.OrderByDescending(p => p.AverageRating ?? 0).ThenBy(p => p.Vet.FullName),
                "experience" => projectedQuery.OrderByDescending(p => p.Vet.ExperienceYears ?? 0).ThenBy(p => p.Vet.FullName),
                _ => projectedQuery.OrderBy(p => p.Vet.FullName)
            };

            // 6. تنفيذ الاستعلام النهائي وجلب النتائج المفلترة فقط للذاكرة
            var results = await projectedQuery.ToListAsync();

            // 7. تحويل النتائج النهائية المحدودة إلى DTO
            return results.Select(p => MapToDto(
                p.Vet,
                p.Distance,
                p.AverageRating,
                p.TotalRatings
            ));
        }

        // ═══════════════════════════════════════════════════════════════════════
        // GET: Fetch a specific vet by ID
        // ═══════════════════════════════════════════════════════════════════════
        public async Task<VetResponseDto?> GetVetByIdAsync(int vetId)
        {
            var vet = await _context.Vets
                .FirstOrDefaultAsync(v => v.VetId == vetId);

            if (vet == null) return null;

            var ratingStats = await _context.Ratings
                .Where(r => r.TargetType == "Vet" && r.TargetId == vetId)
                .GroupBy(r => r.TargetId)
                .Select(g => new { AverageRating = g.Average(r => r.StarsCount), TotalRatings = g.Count() })
                .FirstOrDefaultAsync();

            return MapToDto(vet, null,
                ratingStats?.AverageRating,
                ratingStats?.TotalRatings ?? 0);
        }

        // ═══════════════════════════════════════════════════════════════════════
        // Helper: Map Vet entity to VetResponseDto
        // ═══════════════════════════════════════════════════════════════════════
        private VetResponseDto MapToDto(Vet vet, double? distanceInKm, double? averageRating, int totalRatings)
        {
            return new VetResponseDto
            {
                VetId = vet.VetId,
                FullName = vet.FullName,
                Specialization = vet.Specialization,
                ClinicName = vet.ClinicName,
                ClinicAddress = vet.ClinicAddress,
                PhoneNumber = vet.PhoneNumber,
                Email = vet.Email,
                ExperienceYears = vet.ExperienceYears,
                LicenseNumber = vet.LicenseNumber,
                CertificateUrl = vet.CertificateUrl,
                Location_Lat = vet.Location_Lat,
                Location_Lng = vet.Location_Lng,
                IsVerified = vet.IsVerified,
                AverageRating = averageRating,
                TotalRatings = totalRatings,
                DistanceInKm = distanceInKm
            };
        }
    }
}
