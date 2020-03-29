using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Comments;
using Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
  public class ChatHub : Hub
  {
    private readonly IMediator _mediator;
    private readonly IUserAccessor _userAccessor;
    public ChatHub(IMediator mediator, IUserAccessor userAccessor)
    {
      this._userAccessor = userAccessor;
      this._mediator = mediator;
    }

    public async Task SendComment(Create.Command command)
    {
      var username = GetUsername();

      command.Username = username;

      var comment = await _mediator.Send(command);

      await Clients.Group(command.ActivityId.ToString()).SendAsync("ReceiveComment", comment);
    }

    public async Task AddToGroup(string groupName)
    {
      await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
      var username = GetUsername();
      await Clients.Group(groupName).SendAsync("Send", $"{username} has joined to the group");
    }
    public async Task RemoveFromGroup(string groupName)
    {
      await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
      var username = GetUsername();
      await Clients.Group(groupName).SendAsync("Send", $"{username} has left to the group");
    }

    public string GetUsername()
    {
      return Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
    }
  }
}