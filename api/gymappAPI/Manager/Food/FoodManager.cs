using gymappAPI.Data;
using gymappAPI.DTOs;
using gymappAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace gymappAPI.Manager.Food;

public class FoodManager : IFoodManager
{

    private readonly AppDbContext _context;
    private readonly IUserManager _userManager;
    
    
    public FoodManager(AppDbContext context, IUserManager userManager)
    {
        _context = context;
        _userManager = userManager;
    }
    public async Task CreateAsync(Models.Food food)
    {
        _context.Foods.Add(food);
        await _context.SaveChangesAsync();
    }

    public async Task CreateLoggedFoodsAsync(LoggedFood[] loggedFoods)
    {
        _context.LoggedFoods.AddRange(loggedFoods);
        await _context.SaveChangesAsync();
    }

    public async Task<LoggedFood[]> ConvertToLoggedFoodsAsync(FoodGramsPair[] foods, DateTime date)
    {
        var user = await _userManager.GetCurrentUserAsync();
        
        var result = new List<LoggedFood>();

        foreach (var f in foods)
        {
            var food = await GetFoodByIdAsync(f.Food.Id);
            result.Add(new LoggedFood
            {
                Id = Guid.NewGuid(),
                Date = date,
                Food = food,
                Grams = f.Grams,
                User = user
            });
        }

        return result.ToArray();
    }

    public async Task<LoggedFood[]> GetAllInDateRangeAsync(Guid userId, DateTime start, DateTime end)
    {
        var user = await _userManager.GetUserByIdAsync(userId);
        return await _context.LoggedFoods.Include(f => f.Food)
            .Where(f => 
                f.User == user &&
                f.Date >= start &&
                f.Date <= end).ToArrayAsync();
    }

    public async Task<LoggedFood[]> GetAllForDateAsync(DateTime date)
    {
        var user = await _userManager.GetCurrentUserAsync();
        return await _context.LoggedFoods.Include(f => f.Food)
            .Where(f => 
                f.User == user &&
                f.Date.DayOfYear == date.DayOfYear &&
                f.Date.Year == date.Year).ToArrayAsync();
    }

    public async Task DeleteLoggedFoodAsync(Guid id)
    {
        _context.LoggedFoods.Remove(await _context.LoggedFoods.FindAsync(id));
        await _context.SaveChangesAsync();
    }

    public async Task EditLoggedFoodAsync(LoggedFood loggedFood)
    {
        _context.LoggedFoods.Update(loggedFood);
        await _context.SaveChangesAsync();
    }

    public async Task<Models.Food?> GetFoodByIdAsync(Guid foodId)
    {
        return await _context.Foods.FindAsync(foodId);
    }

    public async Task<Models.Food[]> GetAllFoodAsync()
    {
        return await _context.Foods.ToArrayAsync();
    }
}