using gymappAPI.DTOs;
using gymappAPI.Models;

namespace gymappAPI.Manager.Food;

public interface IFoodManager
{
    public Task Create(Models.Food food);
    
    public Task CreateLoggedFoods(LoggedFood[] loggedFoods);
    
    public Task<Models.Food[]> GetAllFood();

    public Task<Models.Food?> GetFoodByIdAsync(Guid foodId);
    
    public Task<LoggedFood[]> ConvertToLoggedFoods(FoodGramsPair[] foods, DateTime date);
    
    public Task<LoggedFood[]> GetAllInDateRange(DateTime start, DateTime end);
    
    public Task<LoggedFood[]> GetAllForDate(DateTime date);
    public Task DeleteLoggedFood(Guid id);
    public Task EditLoggedFood(LoggedFood loggedFood);
}