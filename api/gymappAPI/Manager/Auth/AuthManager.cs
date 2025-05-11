using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using gymappAPI.Data;
using gymappAPI.DTOs;
using gymappAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace gymappAPI.Manager;

public class AuthManager : IAuthManager
{
    private IConfiguration _config;
    private readonly AppDbContext _context;
    private readonly IUserManager _userManager;
    
    public AuthManager(IConfiguration config, AppDbContext context, IUserManager userManager)
    {
        _config = config;
        _context = context;
        _userManager = userManager;
    }
    
    public async Task<TokenResponseDto?> LoginAsync(LoginCredentials request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
        if (user is null)
        {
            return null;
        }
        if (new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, request.Password)
                == PasswordVerificationResult.Failed)
        {
            return null;
        }

        return await CreateTokenResponse(user);
    }

    public async Task<User?> RegisterAsync(SignUpCredentials request)
    {
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
        {
            return null;
        }

        var user = new User();
        var hashedPassword = new PasswordHasher<User>()
                .HashPassword(user, request.Password);

        user.Username = request.Username;
        user.PasswordHash = hashedPassword;

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }
        
    public async Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request)
    {
        var user = await ValidateRefreshToken(request.RefreshToken);
        if (user is null)
            return null;

        return await CreateTokenResponse(user);
    }
    
    private async Task<TokenResponseDto> CreateTokenResponse(User? user)
    {
        return new TokenResponseDto
        {
            AccessToken = CreateToken(user),
            RefreshToken = await GenerateAndSaveRefreshTokenAsync(user)
        };
    }

    private async Task<User>? ValidateRefreshToken(string refreshToken)
    {
        
        var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
        if (user is null || user.RefreshToken != refreshToken
                || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            return null;
        }

        return user;
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
    {
        var refreshToken = GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _context.SaveChangesAsync();
        return refreshToken;
    }
        
    private string CreateToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new Claim[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
        };
        
        var token = new JwtSecurityToken(_config["JwtSettings:Issuer"],
                _config["JwtSettings:Audience"],
                claims,
                expires: DateTime.UtcNow.AddMinutes(1),
                signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}