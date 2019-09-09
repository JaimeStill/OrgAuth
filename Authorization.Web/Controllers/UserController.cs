using System.Collections.Generic;
using System.Threading.Tasks;
using Authorization.Data;
using Authorization.Data.Entities;
using Authorization.Data.Extensions;
using Authorization.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Authorization.Web.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private AppDbContext db;
        private IUserProvider provider;

        public UserController(AppDbContext db, IUserProvider provider)
        {
            this.db = db;
            this.provider = provider;
        }

        [HttpGet("[action]")]
        public async Task<List<AdUser>> GetDomainUsers() => await provider.GetDomainUsers();

        [HttpGet("[action]/{search}")]
        public async Task<List<AdUser>> SearchDomainUsers([FromRoute]string search) => await provider.SearchDomainUsers(search);

        [HttpGet("[action]")]
        public async Task<List<User>> GetUsers() => await db.GetUsers();

        [HttpGet("[action]")]
        public async Task<List<User>> GetDeletedUsers() => await db.GetUsers(true);

        [HttpGet("[action]/{search}")]
        public async Task<List<User>> SearchUsers([FromRoute]string search) => await db.SearchUsers(search);

        [HttpGet("[action]/{search}")]
        public async Task<List<User>> SearchDeletedUsers([FromRoute]string search) => await db.SearchUsers(search, true);

        [HttpGet("[action]")]
        public async Task<List<Org>> GetCurrentUserOrgs() => await db.GetCurrentUserOrgs(this.provider.CurrentUser.Guid.Value);

        [HttpGet("[action]/{search}")]
        public async Task<List<Org>> SearchCurrentUserOrgs([FromRoute]string search) => await db.SearchCurrentUserOrgs(this.provider.CurrentUser.Guid.Value, search);

        [HttpGet("[action]/{userId}")]
        public async Task<User> GetUser([FromRoute]int userId) => await db.GetUser(userId);

        [HttpGet("[action]/{username}")]
        public async Task<User> GetUserByName([FromRoute]string username) => await db.GetUser(username);

        [HttpGet("[action]")]
        public async Task<User> SyncUser() => await provider.CurrentUser.SyncUser(db);

        [HttpPost("[action]")]
        public async Task<bool> ValidateUsername([FromBody]User user) => await db.ValidateUsername(user);

        [HttpPost("[action]")]
        public async Task AddUser([FromBody]AdUser user) => await db.AddUser(user);

        [HttpPost("[action]")]
        public async Task UpdateUser([FromBody]User user) => await db.UpdateUser(user);

        [HttpPost("[action]")]
        public async Task ToggleUserAdmin([FromBody]User user) => await db.ToggleUserAdmin(user);

        [HttpPost("[action]")]
        public async Task ToggleUserDeleted([FromBody]User user) => await db.ToggleUserDeleted(user);

        [HttpPost("[action]")]
        public async Task RemoveUser([FromBody]User user) => await db.RemoveUser(user);
    }
}