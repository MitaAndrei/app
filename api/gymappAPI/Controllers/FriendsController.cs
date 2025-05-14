using gymappAPI.DTOs;
using gymappAPI.Manager;
using gymappAPI.Manager.Friends;
using gymappAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol.Plugins;

namespace gymappAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendsController : ControllerBase
    {
        private readonly IFriendsManager _friendsManager;
        private readonly IUserManager _userManager;


        public FriendsController(IFriendsManager friendsManager, IUserManager userManager)
        {
            _friendsManager = friendsManager;
            _userManager = userManager;
        }
        
        [HttpPost("request")]
        [Authorize]
        public async Task<IActionResult> SendFriendRequest([FromBody] FriendRequestDto friendRequestDto)
        {
            var result = await _friendsManager.SendRequestAsync(friendRequestDto.ReceiverId);
            if(!result) return BadRequest( new { message =  "Request already exists or invalid" });

            return Ok(new {message = "Request sent"});
        }
        
        [HttpPost("accept/{userId}")]
        [Authorize]
        public async Task<IActionResult> AcceptFriendRequest(Guid userId)
        {
            var result = await _friendsManager.AcceptRequestAsync(userId);
            if(!result) return BadRequest(new { message= "Request doesn't exist"});

            return Ok(new {message = "Request accepted"});
        }
        
        [HttpPost("reject/{userId}")]
        [Authorize]
        public async Task<IActionResult> RejectFriendRequest(Guid userId)
        {
            var result = await _friendsManager.RejectRequestAsync(userId);
            if(!result) return BadRequest(new {message = "Request doesn't exist"});

            return Ok(new {message = "Request rejected"});
        }
        
        [HttpDelete("unfriend/{userId}")]
        [Authorize]
        public async Task<IActionResult> Unfriend(Guid userId)
        {
            var result = await _friendsManager.UnfriendAsync(userId);
            if(!result) return BadRequest(new {message = "Not friends"});

            return Ok(new {message = "User unfriended"});
        }

        [HttpGet("status/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetFriendshipStatus(Guid userId)
        {
            var result = await _friendsManager.GetFriendshipStatusAsync(userId);
            
            return Ok(result);
        }
    }
}
