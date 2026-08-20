using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetHaven.DTOs;
using PetHaven.Services;
using System.Security.Claims;

namespace PetHaven.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoreCatalogController : ControllerBase
    {
        private readonly IStoreCatalogService _storeCatalogService;

        public StoreCatalogController(IStoreCatalogService storeCatalogService)
        {
            _storeCatalogService = storeCatalogService;
        }

        // =============================================
        // GET: api/StoreCatalog/Categories
        // =============================================
        [HttpGet("Categories")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllCategories()
        {
            try
            {
                var categories = await _storeCatalogService.GetAllCategoriesAsync();
                return Ok(new { Success = true, Data = categories });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // GET: api/StoreCatalog/Products
        // =============================================
        [HttpGet("Products")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllAvailableProducts()
        {
            try
            {
                var products = await _storeCatalogService.GetAllAvailableProductsAsync();
                return Ok(new { Success = true, Data = products });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // GET: api/StoreCatalog/CenterProducts
        // =============================================
        [HttpGet("CenterProducts")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> GetCenterProducts()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var products = await _storeCatalogService.GetCenterProductsAsync(userId);
                return Ok(new { Success = true, Data = products });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // POST: api/StoreCatalog/AddProduct
        // =============================================
        [HttpPost("AddProduct")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> AddProduct([FromBody] ProductRequestDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var product = await _storeCatalogService.AddProductAsync(dto, userId);
                return Ok(new { Success = true, Message = "تمت إضافة المنتج بنجاح.", Data = product });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // PUT: api/StoreCatalog/UpdateProduct/{id}
        // =============================================
        [HttpPut("UpdateProduct/{id}")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductRequestDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var product = await _storeCatalogService.UpdateProductAsync(id, dto, userId);
                return Ok(new { Success = true, Message = "تم تحديث المنتج بنجاح.", Data = product });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        // =============================================
        // DELETE: api/StoreCatalog/DeleteProduct/{id}
        // =============================================
        [HttpDelete("DeleteProduct/{id}")]
        [Authorize(Roles = "AdoptionCenter")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                await _storeCatalogService.DeleteProductAsync(id, userId);
                return Ok(new { Success = true, Message = "تم حذف المنتج بنجاح." });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
        // =============================================
        // GET: api/StoreCatalog/Products/{id}
        // =============================================
        [HttpGet("Products/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductById(int id)
        {
            try
            {
                var product = await _storeCatalogService.GetProductByIdAsync(id);

                if (product == null)
                    return NotFound(new { Success = false, Message = "المنتج غير موجود." });

                return Ok(new { Success = true, Data = product });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

    }
}
