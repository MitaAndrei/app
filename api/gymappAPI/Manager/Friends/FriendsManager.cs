using gymappAPI.Data;
using gymappAPI.DTOs;
using gymappAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace gymappAPI.Manager.Friends;

public class FriendsManager : IFriendsManager
{
    private readonly AppDbContext _context;
    private readonly IUserManager _userManager;

    public FriendsManager(AppDbContext context, IUserManager userManager)
    {
        _context = context;
        _userManager = userManager;
    }
    
    public async Task<bool> SendRequestAsync(Guid receiverId)
    {
        var sender = await _userManager.GetCurrentUserAsync();
        var senderId = sender.Id;
        
        if (senderId == receiverId) return false; 
        
        bool exists = await _context.FriendRequests.AnyAsync(fr =>
            (fr.SenderId == senderId && fr.ReceiverId == receiverId) ||
            (fr.SenderId == receiverId && fr.ReceiverId == senderId));
        
        if (exists) return false;

        var request = new FriendRequest
        {
            SenderId = senderId,
            ReceiverId = receiverId,
            Accepted = false
        };
        
        _context.FriendRequests.Add(request);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AcceptRequestAsync(Guid otherUserId)
    {
        var currentUser = await _userManager.GetCurrentUserAsync();
        var currentUserId = currentUser.Id;
        
        if(currentUserId == otherUserId) return false;
        
        var request = await _context.FriendRequests.FirstOrDefaultAsync(fr =>
            fr.SenderId == otherUserId && fr.ReceiverId == currentUserId);

        if (request is null || request.Accepted) return false;
        
        request.Accepted = true;
        await _context.SaveChangesAsync();
        return true;

    }

    public async Task<bool> RejectRequestAsync(Guid otherUserId)
    {
        var currentUser = await _userManager.GetCurrentUserAsync();
        var currentUserId = currentUser.Id;
        
        if(currentUserId == otherUserId) return false;
        
        var request = await _context.FriendRequests.FirstOrDefaultAsync(fr =>
            fr.SenderId == otherUserId && fr.ReceiverId == currentUserId);

        if (request is null || request.Accepted) return false;

        _context.FriendRequests.Remove(request);
        await _context.SaveChangesAsync();
        return true;

    }

    public async Task<bool> UnfriendAsync(Guid otherUserId)
    {
        var currentUser = await _userManager.GetCurrentUserAsync();
        var currentUserId = currentUser.Id;
        
        if(currentUserId == otherUserId) return false;
        
        var request = await _context.FriendRequests
            .FirstOrDefaultAsync(fr =>
                (fr.SenderId == currentUserId && fr.ReceiverId == otherUserId) ||
                (fr.SenderId == otherUserId && fr.ReceiverId == currentUserId));
        

        if (request is null || !request.Accepted) return false;
        
        _context.FriendRequests.Remove(request);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<FriendshipStatus> GetFriendshipStatusAsync(Guid otherUserId)
    {
        var currentUser = await _userManager.GetCurrentUserAsync();
        var currentUserId = currentUser.Id;
        
        var request = await _context.FriendRequests
            .FirstOrDefaultAsync(fr =>
                (fr.SenderId == currentUserId && fr.ReceiverId == otherUserId) ||
                (fr.SenderId == otherUserId && fr.ReceiverId == currentUserId));

        if (request == null)
            return FriendshipStatus.None;

        if (request.Accepted)
            return FriendshipStatus.Friends;

        if (request.SenderId == currentUserId)
            return FriendshipStatus.PendingSent;

        return FriendshipStatus.PendingReceived;
    }
    
    public async Task<List<User>> GetFriendsAsync(Guid userId)
    {
        var acceptedRequests = await _context.FriendRequests
            .Where(fr => fr.ReceiverId == userId || fr.SenderId == userId && !fr.Accepted)
            .ToListAsync();

        return acceptedRequests.Select(fr =>
            fr.SenderId == userId ? fr.Receiver : fr.Sender).ToList();
    }
}