using System;
using System.Threading.Tasks;
using Authorization.Data;
using Authorization.Identity;
using Microsoft.AspNetCore.SignalR;

namespace Authorization.Web.Hubs
{
    public class SocketHub : Hub
    {
        private AppDbContext db;

        public SocketHub(AppDbContext db)
        {
            this.db = db;
        }

        public async Task triggerAuth(string userSocketName)
        {
            Console.WriteLine("Invoking triggerAuth");
            Console.WriteLine($"Target User: {userSocketName}");

            var message = !(string.IsNullOrEmpty(Context.User?.Identity?.Name)) ?
                $"{Context.User.Identity.Name} modified your authorizations" :
                $"Your authorizations have been modified";

            await Clients.User(userSocketName).SendAsync("refreshAuth", message);
        }

    }
}