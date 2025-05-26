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
    
    public async Task<User?> GetUserByIdAsync(Guid id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

        return user;
    }

    public async Task<User?> GetCurrentUserAsync()
    {
        var abc = _httpContextAccessor.HttpContext;
        var userId = Guid.Parse(abc?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            
        return await GetUserByIdAsync(userId);
    }

    public async Task<User[]> SearchUsersAsync(string searchString)
    {
        var tolower = searchString.ToLower();
        var users = _context.Users.Where(u => u.Username.ToLower().Contains(tolower));
        return await users.ToArrayAsync();
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        return user;
    }
}