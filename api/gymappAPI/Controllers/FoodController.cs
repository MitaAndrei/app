using gymappAPI.DTOs;
using gymappAPI.Manager;
using gymappAPI.Manager.Food;
using gymappAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace gymappAPI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class FoodController : ControllerBase
    {
        private readonly IFoodManager _foodManager;
        private readonly IUserManager _userManager;

        public FoodController(IFoodManager foodManager, IUserManager userManager)
        {
            _foodManager = foodManager;
            _userManager = userManager;
        }
        
        // GET: api/<FoodController>
        [HttpGet]
        public async Task<Food[]> Get()
        {
            return await _foodManager.GetAllFoodAsync();
        }

        // POST api/<FoodController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Food food)
        {
            food.Id = Guid.NewGuid();
            await _foodManager.CreateAsync(food);
            
            return CreatedAtAction(nameof(Post), new { id = food.Id }, food);
        }
        
        [HttpPost("createLoggedFoods")]
        public async Task<IActionResult> CreateLoggedFoods([FromQuery] DateTime date, [FromBody] FoodGramsPair[] foods)
        {
            var loggedFoods = await _foodManager.ConvertToLoggedFoodsAsync(foods, date);
            await _foodManager.CreateLoggedFoodsAsync(loggedFoods);
            return CreatedAtAction(nameof(CreateLoggedFoods), loggedFoods);
        }
        
        [HttpGet("getAllInDateRange")]
        public async Task<LoggedFood[]> GetAllInDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var currentUser = await _userManager.GetCurrentUserAsync();
            var id = currentUser.Id;
            return await _foodManager.GetAllInDateRangeAsync(id, startDate, endDate);
        }
        
        [HttpGet("getAllForDate")]
        public async Task<LoggedFood[]> GetAllForDate([FromQuery] DateTime date)
        {
            return await _foodManager.GetAllForDateAsync(date);
        }
        
        [HttpGet("logged/{userId}")]
        public async Task<LoggedFood[]> GetLFoodsForUser(Guid userId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            return await _foodManager.GetAllInDateRangeAsync(userId, startDate, endDate);
        }
        
        [HttpDelete("deleteLoggedFood/{id}")]
        public async Task<IActionResult> DeleteLoggedFood(Guid id)
        {
            await _foodManager.DeleteLoggedFoodAsync(id);
            return NoContent();
        }
        
        [HttpPut("editLoggedFood")]
        public async Task<IActionResult> EditLoggedFood([FromBody] LoggedFood loggedFood)
        {
            await _foodManager.EditLoggedFoodAsync(loggedFood);
            return NoContent();
        }
    }
}
