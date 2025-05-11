using System.Security.Claims;
using gymappAPI.Manager;
using gymappAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.IdentityModel.JsonWebTokens;
using JwtRegisteredClaimNames = System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames;

namespace gymappAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        
        private readonly IUserManager _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserController(IUserManager userManager, IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
        }
        
        // GET: api/<UserController>
        [Authorize]
        [HttpGet]
        public async Task<User?> Get()
        {
            return await _userManager.GetCurrentUserAsync();
        }
        
    }
    
}
