using gymappAPI.DTOs;

namespace gymappAPI.Manager.Friends;

public interface IFriendsManager
{
    Task<bool> SendRequestAsync(Guid receiverId);
    Task<bool> AcceptRequestAsync(Guid otherUserId);
    Task<bool> RejectRequestAsync(Guid otherUserId);
    Task<bool> UnfriendAsync(Guid otherUserId);
    Task<FriendshipStatus> GetFriendshipStatusAsync(Guid otherUserId);
    
}