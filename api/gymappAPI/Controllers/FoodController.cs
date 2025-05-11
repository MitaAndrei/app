using gymappAPI.DTOs;
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

        public FoodController(IFoodManager foodManager)
        {
            _foodManager = foodManager;
        }
        
        // GET: api/<FoodController>
        [HttpGet]
        public async Task<Food[]> Get()
        {
            return await _foodManager.GetAllFood();
        }

        // POST api/<FoodController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Food food)
        {
            food.Id = Guid.NewGuid();
            await _foodManager.Create(food);
            
            return CreatedAtAction(nameof(Post), new { id = food.Id }, food);
        }
        
        [HttpPost("createLoggedFoods")]
        public async Task<IActionResult> CreateLoggedFoods([FromQuery] DateTime date, [FromBody] FoodGramsPair[] foods)
        {
            var loggedFoods = await _foodManager.ConvertToLoggedFoods(foods, date);
            await _foodManager.CreateLoggedFoods(loggedFoods);
            return CreatedAtAction(nameof(CreateLoggedFoods), loggedFoods);
        }
        
        [HttpGet("getAllInDateRange")]
        public async Task<LoggedFood[]> GetAllInDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            return await _foodManager.GetAllInDateRange(startDate, endDate);
        }
        
        [HttpGet("getAllForDate")]
        public async Task<LoggedFood[]> GetAllInDateRange([FromQuery] DateTime date)
        {
            return await _foodManager.GetAllForDate(date);
        }
        
        [HttpDelete("deleteLoggedFood/{id}")]
        public async Task<IActionResult> DeleteLoggedFood(Guid id)
        {
            await _foodManager.DeleteLoggedFood(id);
            return NoContent();
        }
        
        [HttpPut("editLoggedFood")]
        public async Task<IActionResult> EditLoggedFood([FromBody] LoggedFood loggedFood)
        {
            await _foodManager.EditLoggedFood(loggedFood);
            return NoContent();
        }
    }
}
