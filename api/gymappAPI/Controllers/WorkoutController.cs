using gymappAPI.DTOs;
using gymappAPI.Manager;
using gymappAPI.Manager.Workout;
using gymappAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace gymappAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WorkoutController : ControllerBase
    {
        
        private readonly IWorkoutManager _workoutManager;
        private readonly IUserManager _userManager;


        public WorkoutController(IWorkoutManager workoutManager, IUserManager userManager)
        {
            _workoutManager = workoutManager;
            _userManager = userManager;
        }
        
        // GET: api/<WorkoutController>
        [HttpGet]
        public async Task<Workout[]> Get()
        {
            return await _workoutManager.GetAllForUserAsync();
        }

        // POST api/<WorkoutController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] WorkoutDTO _workout)
        {
            Guid id = await _workoutManager.CreateFromDtoAsync(_workout);
            return CreatedAtAction(nameof(Post), new { id }, _workout);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> EditWorkout(Guid id, [FromBody] WorkoutDTO _workout)
        {
            var success = await _workoutManager.EditAsync(id, _workout);
            if (!success) return NotFound();
            return NoContent();
        }

        // DELETE api/<WorkoutController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _workoutManager.DeleteAsync(id);
            if(!result) return NotFound();
            return NoContent();
        }
        
        [Authorize]
        [HttpGet("getAllInDateRange")]
        public async Task<Workout[]> GetAllInDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            return await _workoutManager.GetAllInDateRangeAsync(startDate, endDate);
        }
        
        // GET: api/<WorkoutController>
        [HttpGet("templates")]
        public async Task<Workout[]> GetTemplates()
        {
            return await _workoutManager.GetTemplatesAsync();
        }
    }
}
