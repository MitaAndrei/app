using gymappAPI.DTOs;
using gymappAPI.Manager;
using gymappAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace gymappAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IAuthManager _authManager;

        public AuthController(IAuthManager authManager)
        {
            _authManager = authManager;
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Register(SignUpCredentials request)
        {
            var user = await _authManager.RegisterAsync(request);
            
            if (user is null)
                return BadRequest("Username already exists.");

            return Ok();
        }
        
        [HttpPost("login")]
        public async Task<ActionResult<TokenResponseDto>> Login(LoginCredentials request)
        {
            var tokenResponse = await _authManager.LoginAsync(request);
            if (tokenResponse is null)
                return BadRequest("Invalid username or password.");

            return Ok(tokenResponse);
        }
        
        [HttpPost("refresh-token")]
        public async Task<ActionResult<TokenResponseDto>> RefreshToken(RefreshTokenRequestDto request)
        {
            var tokenResponse = await _authManager.RefreshTokensAsync(request);
            if (tokenResponse is null || tokenResponse.AccessToken is null || tokenResponse.RefreshToken is null)
                return Unauthorized("Invalid refresh token.");

            return Ok(tokenResponse);
        }
    }
    
}
