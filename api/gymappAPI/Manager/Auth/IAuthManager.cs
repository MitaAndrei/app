using gymappAPI.DTOs;
using gymappAPI.Models;

namespace gymappAPI.Manager;

public interface IAuthManager
{ 
    Task<User?> RegisterAsync(SignUpCredentials request);
    Task<TokenResponseDto?> LoginAsync(LoginCredentials request);
    Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request);
    
}