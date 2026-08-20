using Microsoft.EntityFrameworkCore;
using PetHaven.Data;
using PetHaven.DTOs;
using PetHaven.Models;
using PetHaven.Services;
using Xunit;

namespace PetHaven.Tests
{
    public class TestApplicationDbContext : ApplicationDbContext
    {
        public TestApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public override double? CalculateDistance(double? lat1, double? lng1, double? lat2, double? lng2)
        {
            // تنفيذ مبسط لحساب المسافة للاختبارات
            if (!lat1.HasValue || !lng1.HasValue || !lat2.HasValue || !lng2.HasValue)
                return null;

            // حساب المسافة الأوروبية البسيطة (للاختبار فقط)
            var latDiff = lat1.Value - lat2.Value;
            var lngDiff = lng1.Value - lng2.Value;
            return Math.Sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // تقريبي بالكيلومتر
        }
    }

    public class VetServiceTests
    {
        private TestApplicationDbContext GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new TestApplicationDbContext(options);
            return context;
        }

        [Fact]
        public async Task GetAllVetsAsync_ShouldReturnAllVets()
        {
            // Arrange
            using var context = GetInMemoryContext();
            
            var vet1 = new Vet
            {
                VetId = 1,
                UserId = 1,
                FullName = "Dr. Ahmed",
                Specialization = "Small Animal Medicine",
                ClinicName = "Pet Clinic",
                ClinicAddress = "Street 1",
                PhoneNumber = "123456789",
                Email = "ahmed@test.com",
                ExperienceYears = 5,
                LicenseNumber = "LIC001",
                Location_Lat = 33.5m,
                Location_Lng = 36.3m,
                IsVerified = true,
                CreatedAt = DateTime.Now
            };

            var vet2 = new Vet
            {
                VetId = 2,
                UserId = 2,
                FullName = "Dr. Sara",
                Specialization = "Surgery",
                ClinicName = "Animal Hospital",
                ClinicAddress = "Street 2",
                PhoneNumber = "987654321",
                Email = "sara@test.com",
                ExperienceYears = 10,
                LicenseNumber = "LIC002",
                Location_Lat = 33.6m,
                Location_Lng = 36.4m,
                IsVerified = true,
                CreatedAt = DateTime.Now
            };

            context.Vets.AddRange(vet1, vet2);
            await context.SaveChangesAsync();

            var service = new VetService(context);

            // Act
            var result = await service.GetAllVetsAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetAllVetsAsync_ShouldIncludeRatings()
        {
            // Arrange
            using var context = GetInMemoryContext();
            
            var vet = new Vet
            {
                VetId = 1,
                UserId = 1,
                FullName = "Dr. Ahmed",
                Specialization = "Small Animal Medicine",
                IsVerified = true,
                CreatedAt = DateTime.Now
            };

            var rating1 = new Rating
            {
                RatingId = 1,
                UserId = 1,
                TargetId = 1,
                TargetType = "Vet",
                StarsCount = 5,
                ReviewText = "Great vet",
                CreatedAt = DateTime.Now
            };

            var rating2 = new Rating
            {
                RatingId = 2,
                UserId = 2,
                TargetId = 1,
                TargetType = "Vet",
                StarsCount = 4,
                ReviewText = "Good service",
                CreatedAt = DateTime.Now
            };

            context.Vets.Add(vet);
            context.Ratings.AddRange(rating1, rating2);
            await context.SaveChangesAsync();

            var service = new VetService(context);

            // Act
            var result = await service.GetAllVetsAsync();
            var vetDto = result.First();

            // Assert
            Assert.NotNull(vetDto.AverageRating);
            Assert.Equal(4.5, vetDto.AverageRating);
            Assert.Equal(2, vetDto.TotalRatings);
        }

        [Fact]
        public async Task GetVetByIdAsync_WithValidId_ShouldReturnVet()
        {
            // Arrange
            using var context = GetInMemoryContext();
            
            var vet = new Vet
            {
                VetId = 1,
                UserId = 1,
                FullName = "Dr. Ahmed",
                Specialization = "Small Animal Medicine",
                ClinicName = "Pet Clinic",
                IsVerified = true,
                CreatedAt = DateTime.Now
            };

            context.Vets.Add(vet);
            await context.SaveChangesAsync();

            var service = new VetService(context);

            // Act
            var result = await service.GetVetByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Dr. Ahmed", result.FullName);
            Assert.Equal("Small Animal Medicine", result.Specialization);
        }

        [Fact]
        public async Task GetVetByIdAsync_WithInvalidId_ShouldReturnNull()
        {
            // Arrange
            using var context = GetInMemoryContext();
            var service = new VetService(context);

            // Act
            var result = await service.GetVetByIdAsync(999);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task SearchVetsAsync_WithSpecialization_ShouldFilterBySpecialization()
        {
            // Arrange
            using var context = GetInMemoryContext();
            
            var vet1 = new Vet
            {
                VetId = 1,
                UserId = 1,
                FullName = "Dr. Ahmed",
                Specialization = "Small Animal Medicine",
                IsVerified = true,
                CreatedAt = DateTime.Now
            };

            var vet2 = new Vet
            {
                VetId = 2,
                UserId = 2,
                FullName = "Dr. Sara",
                Specialization = "Surgery",
                IsVerified = true,
                CreatedAt = DateTime.Now
            };

            context.Vets.AddRange(vet1, vet2);
            await context.SaveChangesAsync();

            var service = new VetService(context);
            var searchDto = new VetSearchDto { Specialization = "Small Animal Medicine" };

            // Act
            var result = await service.SearchVetsAsync(searchDto);

            // Assert
            Assert.Single(result);
            Assert.Equal("Dr. Ahmed", result.First().FullName);
        }

        [Fact]
        public async Task SearchVetsAsync_WithUnverifiedVet_ShouldNotInclude()
        {
            // Arrange
            using var context = GetInMemoryContext();
            
            var verifiedVet = new Vet
            {
                VetId = 1,
                UserId = 1,
                FullName = "Dr. Ahmed",
                Specialization = "Small Animal Medicine",
                IsVerified = true,
                CreatedAt = DateTime.Now
            };

            var unverifiedVet = new Vet
            {
                VetId = 2,
                UserId = 2,
                FullName = "Dr. Sara",
                Specialization = "Surgery",
                IsVerified = false,
                CreatedAt = DateTime.Now
            };

            context.Vets.AddRange(verifiedVet, unverifiedVet);
            await context.SaveChangesAsync();

            var service = new VetService(context);
            var searchDto = new VetSearchDto();

            // Act
            var result = await service.SearchVetsAsync(searchDto);

            // Assert
            Assert.Single(result);
            Assert.Equal("Dr. Ahmed", result.First().FullName);
        }

        [Fact]
        public async Task SearchVetsAsync_SortByExperience_ShouldOrderByExperienceDescending()
        {
            // Arrange
            using var context = GetInMemoryContext();
            
            var vet1 = new Vet
            {
                VetId = 1,
                UserId = 1,
                FullName = "Dr. Ahmed",
                ExperienceYears = 5,
                IsVerified = true,
                CreatedAt = DateTime.Now
            };

            var vet2 = new Vet
            {
                VetId = 2,
                UserId = 2,
                FullName = "Dr. Sara",
                ExperienceYears = 10,
                IsVerified = true,
                CreatedAt = DateTime.Now
            };

            var vet3 = new Vet
            {
                VetId = 3,
                UserId = 3,
                FullName = "Dr. Omar",
                ExperienceYears = 3,
                IsVerified = true,
                CreatedAt = DateTime.Now
            };

            context.Vets.AddRange(vet1, vet2, vet3);
            await context.SaveChangesAsync();

            var service = new VetService(context);
            var searchDto = new VetSearchDto { SortBy = "experience" };

            // Act
            var result = await service.SearchVetsAsync(searchDto);

            // Assert
            Assert.Equal(3, result.Count());
            Assert.Equal("Dr. Sara", result.First().FullName);
            Assert.Equal("Dr. Omar", result.Last().FullName);
        }

        [Fact]
        public async Task SearchVetsAsync_SortByRating_ShouldOrderByRatingDescending()
        {
            // Arrange
            using var context = GetInMemoryContext();
            
            var vet1 = new Vet
            {
                VetId = 1,
                UserId = 1,
                FullName = "Dr. Ahmed",
                IsVerified = true,
                CreatedAt = DateTime.Now
            };

            var vet2 = new Vet
            {
                VetId = 2,
                UserId = 2,
                FullName = "Dr. Sara",
                IsVerified = true,
                CreatedAt = DateTime.Now
            };

            var rating1 = new Rating
            {
                RatingId = 1,
                UserId = 1,
                TargetId = 1,
                TargetType = "Vet",
                StarsCount = 5,
                CreatedAt = DateTime.Now
            };

            var rating2 = new Rating
            {
                RatingId = 2,
                UserId = 2,
                TargetId = 2,
                TargetType = "Vet",
                StarsCount = 3,
                CreatedAt = DateTime.Now
            };

            context.Vets.AddRange(vet1, vet2);
            context.Ratings.AddRange(rating1, rating2);
            await context.SaveChangesAsync();

            var service = new VetService(context);
            var searchDto = new VetSearchDto { SortBy = "rating" };

            // Act
            var result = await service.SearchVetsAsync(searchDto);

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Equal("Dr. Ahmed", result.First().FullName);
        }

        [Fact]
        public async Task SearchVetsAsync_WithNoFilters_ShouldReturnAllVerifiedVets()
        {
            // Arrange
            using var context = GetInMemoryContext();
            
            var vet1 = new Vet
            {
                VetId = 1,
                UserId = 1,
                FullName = "Dr. Ahmed",
                IsVerified = true,
                CreatedAt = DateTime.Now
            };

            var vet2 = new Vet
            {
                VetId = 2,
                UserId = 2,
                FullName = "Dr. Sara",
                IsVerified = true,
                CreatedAt = DateTime.Now
            };

            context.Vets.AddRange(vet1, vet2);
            await context.SaveChangesAsync();

            var service = new VetService(context);
            var searchDto = new VetSearchDto();

            // Act
            var result = await service.SearchVetsAsync(searchDto);

            // Assert
            Assert.Equal(2, result.Count());
        }
    }
}
