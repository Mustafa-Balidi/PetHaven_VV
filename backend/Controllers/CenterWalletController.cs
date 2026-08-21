using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetHaven.Services;
using System.Security.Claims;

namespace PetHaven.Controllers
{
    /// <summary>
    /// محفظة مركز التبني: الرصيد الذي يتلقاه المركز من بيع منتجاته للمتبنّين.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "AdoptionCenter")]
    public class CenterWalletController : ControllerBase
    {
        private readonly ICenterWalletService _walletService;

        public CenterWalletController(ICenterWalletService walletService)
        {
            _walletService = walletService;
        }

        /// <summary>
        /// ملخّص المحفظة: الرصيد الحالي + أحدث الحركات.
        /// </summary>
        /// <param name="transactionsCount">عدد الحركات الأخيرة (افتراضي 10)</param>
        [HttpGet]
        public async Task<IActionResult> GetWallet([FromQuery] int transactionsCount = 10)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var wallet = await _walletService.GetWalletAsync(userId, transactionsCount);
                return Ok(new { Success = true, Data = wallet });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        /// <summary>
        /// حركات المحفظة مع ترقيم الصفحات.
        /// </summary>
        [HttpGet("transactions")]
        public async Task<IActionResult> GetTransactions([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Success = false, Message = "لم يتم التعرف على المستخدم." });

                var result = await _walletService.GetTransactionsAsync(userId, page, pageSize);
                return Ok(new { Success = true, Data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
