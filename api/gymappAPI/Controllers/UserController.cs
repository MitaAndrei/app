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
        
        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest([]);
            
            var users = await _userManager.SearchUsersAsync(query);

            return Ok(users);
        }
        
        [HttpGet("GetUserByUsername")]
        public async Task<IActionResult> GetUserByUsername([FromQuery] string username)
        {
            if (string.IsNullOrWhiteSpace(username))
                return NotFound();
            
            var user = await _userManager.GetUserByUsernameAsync(username);
            
            if(user is null) return NotFound();

            return Ok(user);
        }
    }
    
}
