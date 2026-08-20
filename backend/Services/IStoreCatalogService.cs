using PetHaven.DTOs;

namespace PetHaven.Services
{
    public interface IStoreCatalogService
    {
        Task<IEnumerable<CategoryResponseDto>> GetAllCategoriesAsync();
        Task<IEnumerable<ProductResponseDto>> GetAllAvailableProductsAsync();
        Task<IEnumerable<ProductResponseDto>> GetCenterProductsAsync(string userId);
        Task<ProductResponseDto> AddProductAsync(ProductRequestDto dto, string userId);
        Task<ProductResponseDto> UpdateProductAsync(int productId, ProductRequestDto dto, string userId);
        Task DeleteProductAsync(int productId, string userId);
        Task<ProductDetailDto?> GetProductByIdAsync(int productId);
    }
}
