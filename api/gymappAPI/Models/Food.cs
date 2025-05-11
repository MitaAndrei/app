namespace gymappAPI.Models;

public class Food
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public double Calories { get; set; }
    public double Protein { get; set; }
    public double Fats { get; set; }
    public double Carbs { get; set; }
}