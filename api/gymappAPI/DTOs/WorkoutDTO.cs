using gymappAPI.Models;

namespace gymappAPI.DTOs;

public class WorkoutDTO
{
    public string Description { get; set; }
    
    public int Duration { get; set; }

    public string[] MusclesTargeted { get; set; } = [];

    public bool IsTemplate { get; set; } = false;
    
    public DateTime Date { get; set; }
}