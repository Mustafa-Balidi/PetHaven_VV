using Microsoft.AspNetCore.Mvc;
using Moq;
using PetHaven.Controllers;
using PetHaven.DTOs;
using PetHaven.Services;
using Xunit;

namespace PetHaven.Tests
{
    public class VetControllerTests
    {
        private readonly Mock<IVetService> _mockVetService;
        private readonly VetController _controller;

        public VetControllerTests()
        {
            _mockVetService = new Mock<IVetService>();
            _controller = new VetController(_mockVetService.Object);
        }

        [Fact]
        public async Task GetAllVets_WhenVetsExist_ReturnsOkWithVets()
        {
            // Arrange
            var vets = new List<VetResponseDto>
            {
                new VetResponseDto
                {
                    VetId = 1,
                    FullName = "Dr. Ahmed",
                    Specialization = "Small Animal Medicine",
                    IsVerified = true
                },
                new VetResponseDto
                {
                    VetId = 2,
                    FullName = "Dr. Sara",
                    Specialization = "Surgery",
                    IsVerified = true
                }
            };

            _mockVetService
                .Setup(service => service.GetAllVetsAsync())
                .ReturnsAsync(vets);

            // Act
            var result = await _controller.GetAllVets();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task GetAllVets_WhenExceptionThrown_ReturnsBadRequest()
        {
            // Arrange
            _mockVetService
                .Setup(service => service.GetAllVetsAsync())
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.GetAllVets();

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.NotNull(badRequestResult.Value);
        }

        [Fact]
        public async Task SearchVets_WithValidSearchDto_ReturnsOkWithResults()
        {
            // Arrange
            var searchDto = new VetSearchDto
            {
                Specialization = "Small Animal Medicine",
                SortBy = "rating"
            };

            var vets = new List<VetResponseDto>
            {
                new VetResponseDto
                {
                    VetId = 1,
                    FullName = "Dr. Ahmed",
                    Specialization = "Small Animal Medicine",
                    IsVerified = true,
                    AverageRating = 4.5
                }
            };

            _mockVetService
                .Setup(service => service.SearchVetsAsync(searchDto))
                .ReturnsAsync(vets);

            // Act
            var result = await _controller.SearchVets(searchDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task SearchVets_WhenExceptionThrown_ReturnsBadRequest()
        {
            // Arrange
            var searchDto = new VetSearchDto();
            _mockVetService
                .Setup(service => service.SearchVetsAsync(searchDto))
                .ThrowsAsync(new Exception("Search failed"));

            // Act
            var result = await _controller.SearchVets(searchDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.NotNull(badRequestResult.Value);
        }

        [Fact]
        public async Task GetVetById_WithValidId_ReturnsOkWithVet()
        {
            // Arrange
            var vet = new VetResponseDto
            {
                VetId = 1,
                FullName = "Dr. Ahmed",
                Specialization = "Small Animal Medicine",
                IsVerified = true
            };

            _mockVetService
                .Setup(service => service.GetVetByIdAsync(1))
                .ReturnsAsync(vet);

            // Act
            var result = await _controller.GetVetById(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task GetVetById_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            _mockVetService
                .Setup(service => service.GetVetByIdAsync(999))
                .ReturnsAsync((VetResponseDto?)null);

            // Act
            var result = await _controller.GetVetById(999);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.NotNull(notFoundResult.Value);
        }

        [Fact]
        public async Task GetVetById_WhenExceptionThrown_ReturnsBadRequest()
        {
            // Arrange
            _mockVetService
                .Setup(service => service.GetVetByIdAsync(1))
                .ThrowsAsync(new Exception("Service error"));

            // Act
            var result = await _controller.GetVetById(1);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.NotNull(badRequestResult.Value);
        }

        [Fact]
        public async Task SearchVets_WithRadiusFilter_CallsServiceWithCorrectParameters()
        {
            // Arrange
            var searchDto = new VetSearchDto
            {
                UserLatitude = 33.600368,
                UserLongitude = 36.329190,
                Radius = 50,
                SortBy = "distance"
            };

            var vets = new List<VetResponseDto>();
            _mockVetService
                .Setup(service => service.SearchVetsAsync(searchDto))
                .ReturnsAsync(vets);

            // Act
            await _controller.SearchVets(searchDto);

            // Assert
            _mockVetService.Verify(service => service.SearchVetsAsync(searchDto), Times.Once);
        }

        [Fact]
        public async Task SearchVets_WithNoFilters_CallsServiceWithEmptyDto()
        {
            // Arrange
            var searchDto = new VetSearchDto();
            var vets = new List<VetResponseDto>();

            _mockVetService
                .Setup(service => service.SearchVetsAsync(searchDto))
                .ReturnsAsync(vets);

            // Act
            await _controller.SearchVets(searchDto);

            // Assert
            _mockVetService.Verify(service => service.SearchVetsAsync(It.IsAny<VetSearchDto>()), Times.Once);
        }

        [Fact]
        public async Task GetAllVets_WhenEmptyList_ReturnsOkWithEmptyData()
        {
            // Arrange
            var emptyVets = new List<VetResponseDto>();
            _mockVetService
                .Setup(service => service.GetAllVetsAsync())
                .ReturnsAsync(emptyVets);

            // Act
            var result = await _controller.GetAllVets();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }
    }
}
