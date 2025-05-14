namespace gymappAPI.Models;

public class FriendRequest
{
    public Guid Id { get; set; }
    public Guid SenderId { get; set; }
    public Guid ReceiverId { get; set; }
    public bool Accepted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    
    public User Sender { get; set; }
    public User Receiver { get; set; }
}