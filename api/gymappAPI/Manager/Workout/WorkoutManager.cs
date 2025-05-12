using gymappAPI.Data;
using gymappAPI.DTOs;
using gymappAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace gymappAPI.Manager.Workout;

public class WorkoutManager : IWorkoutManager
{
    private readonly AppDbContext _context;
    private readonly IUserManager _userManager;
    
    public WorkoutManager(AppDbContext context, IUserManager userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task CreateAsync(Models.Workout workout)
    {

        foreach (var label in workout.Labels)
        {
            _context.Labels.Add(label);
        }
        
        _context.Workouts.Add(workout);
        
        await _context.SaveChangesAsync();
    }
    
    public async Task<Guid> CreateFromDtoAsync(WorkoutDTO workoutDto)
    {
        ICollection<Label> labels = CreateLabels(workoutDto.MusclesTargeted);
        var user = await _userManager.GetCurrentUserAsync();
        Guid userId = user.Id;
        
        var workout = new Models.Workout
        {
            Id = Guid.NewGuid(),
            Description = workoutDto.Description,
            Duration = workoutDto.Duration,
            Date = workoutDto.Date,
            Labels = labels,
            UserId = userId,
            IsTemplate = workoutDto.IsTemplate
        };
        
        await CreateAsync(workout);
        return workout.Id;
    }

    private ICollection<Label> CreateLabels(string[] musclesTargeted)
    {
        
        ICollection<Label> labels = new List<Label>();
        
        foreach (var muscle in musclesTargeted)
        {
            string labelColor = muscle switch
            {
                "Chest" => LabelColor.Blue,
                "Arms" => LabelColor.Green,
                "Legs" => LabelColor.Red,
                "Back" => LabelColor.Orange,
                _ => string.Empty
            };
            
            labels.Add(new Label
            {
                Id = Guid.NewGuid(),
                Color = labelColor,
                Muscle = muscle
            });
        }
        
        return labels;
    }

    public async Task<Models.Workout[]> GetAllForUserAsync()
    {
        var user = await _userManager.GetCurrentUserAsync();
        var userId = user.Id;
        return await _context.Workouts.Include(x => x.Labels)
            .Where(w => w.UserId == userId).ToArrayAsync();
    }
    
    public async Task<Models.Workout[]> GetTemplatesAsync()
    {
        var user = await _userManager.GetCurrentUserAsync();
        var userId = user.Id;
        return await _context.Workouts.Include(x => x.Labels)
            .Where(w => w.UserId == userId && w.IsTemplate == true).ToArrayAsync();
    }
    
    public async Task<Models.Workout[]> GetAllInDateRangeAsync(Guid userId, DateTime start, DateTime end)
    {
        return await _context.Workouts.Include(x => x.Labels)
            .Where(w => 
                w.UserId == userId &&
                w.Date >= start &&
                w.Date <= end).ToArrayAsync();
    }

    public async Task<Models.Workout?> GetWorkoutByIdAsync(Guid id)
    {
        return await _context.Workouts.FirstOrDefaultAsync(w => w.Id == id);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var workout = await _context.Workouts
            .Include(w => w.Labels)
            .FirstOrDefaultAsync(w => w.Id == id);

        if (workout == null)
            return false;
        
        _context.Workouts.Remove(workout);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> EditAsync(Guid id, WorkoutDTO workoutDTO)
    {
        var existingWorkout = await _context.Workouts
            .Include(w => w.Labels) 
            .FirstOrDefaultAsync(w => w.Id == id);
        
        if (existingWorkout == null)
            return false;
        
        existingWorkout.Description = workoutDTO.Description;
        existingWorkout.Duration = workoutDTO.Duration;
        existingWorkout.Date = workoutDTO.Date;
        existingWorkout.IsTemplate = workoutDTO.IsTemplate;
        
        var created = CreateLabels(workoutDTO.MusclesTargeted);
        
        _context.Labels.RemoveRange(existingWorkout.Labels);
        
        existingWorkout.Labels = created;
        _context.Labels.AddRange(created);
        
        await _context.SaveChangesAsync();
        return true;
    }
}