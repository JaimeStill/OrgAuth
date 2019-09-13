using Microsoft.AspNetCore.SignalR;

namespace Authorization.Web.Infrastructure
{
    public class NameUserIdProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection) => connection.User?.Identity?.Name;
    }
}