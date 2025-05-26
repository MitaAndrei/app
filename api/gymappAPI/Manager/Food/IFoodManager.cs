using gymappAPI.DTOs;
using gymappAPI.Models;

namespace gymappAPI.Manager.Food;

public interface IFoodManager
{
    public Task CreateAsync(Models.Food food);
    
    public Task CreateLoggedFoodsAsync(LoggedFood[] loggedFoods);
    
    public Task<Models.Food[]> GetAllFoodAsync();

    public Task<Models.Food?> GetFoodByIdAsync(Guid foodId);
    
    public Task<LoggedFood[]> ConvertToLoggedFoodsAsync(FoodGramsPair[] foods, DateTime date);
    
    public Task<LoggedFood[]> GetAllInDateRangeAsync(Guid userId, DateTime start, DateTime end);
    
    public Task<LoggedFood[]> GetAllForDateAsync(DateTime date);
    public Task DeleteLoggedFoodAsync(Guid id);
    public Task EditLoggedFoodAsync(LoggedFood loggedFood);
}