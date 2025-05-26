using gymappAPI.Models;

namespace gymappAPI.Manager;

public interface IUserManager
{
    public Task<User?> GetUserByIdAsync(Guid id);
    
    public Task<User?> GetCurrentUserAsync();
    
    public Task<User[]> SearchUsersAsync(string searchString);
    
    public Task<User?> GetUserByUsernameAsync(string username);
}