namespace gymappAPI.Models;

public class LoggedFood
{
    public Guid Id { get; set; }
    public Food Food { get; set; }
    public User User { get; set; }
    public DateTime Date { get; set; }
    public double Grams { get; set; }
}