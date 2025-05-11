using System.Security.Claims;
using gymappAPI.Data;
using gymappAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace gymappAPI.Manager;

public class UserManager: IUserManager
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;


    public UserManager(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;

    }
    
    public async Task<User?> GetUserByIdAsync(string id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == Guid.Parse(id));

        return user;
    }

    public async Task<User?> GetCurrentUserAsync()
    {
        var abc = _httpContextAccessor.HttpContext;
        var userId = abc?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
        return await GetUserByIdAsync(userId);
    }
}