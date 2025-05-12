using gymappAPI.DTOs;
using gymappAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;

namespace gymappAPI.Manager.Workout;

public interface IWorkoutManager
{
    public Task CreateAsync(Models.Workout workout);
    
    public Task<Models.Workout[]> GetAllForUserAsync();
    
    public Task<Models.Workout[]> GetTemplatesAsync();

    public Task<Models.Workout[]> GetAllInDateRangeAsync(Guid userId, DateTime start, DateTime end);
    
    public Task<Models.Workout?> GetWorkoutByIdAsync(Guid id);

    public Task<bool> DeleteAsync(Guid id);
    
    public Task<bool> EditAsync(Guid id, WorkoutDTO workoutDto);
    
    public Task<Guid> CreateFromDtoAsync(WorkoutDTO workoutDto);
}