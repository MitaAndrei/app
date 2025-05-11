using gymappAPI.Models;

namespace gymappAPI.Manager;

public interface IUserManager
{
    public Task<User?> GetUserByIdAsync(string id);
    
    public Task<User?> GetCurrentUserAsync();
}