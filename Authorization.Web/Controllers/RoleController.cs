using System.Collections.Generic;
using System.Threading.Tasks;
using Authorization.Data;
using Authorization.Data.Entities;
using Authorization.Data.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace Authorization.Web.Controllers
{
    [Route("api/[controller]")]
    public class RoleController : Controller
    {
        private AppDbContext db;

        public RoleController(AppDbContext db)
        {
            this.db = db;
        }

        [HttpGet("[action]")]
        public async Task<List<Role>> GetRoles() => await db.GetRoles();

        [HttpGet("[action]/{search}")]
        public async Task<List<Role>> SearchRoles([FromRoute]string search) => await db.SearchRoles(search);

        [HttpGet("[action]/{userId}")]
        public async Task<List<Role>> GetUserRoles([FromRoute]int userId) => await db.GetUserRoles(userId);

        [HttpGet("[action]/{userId}")]
        public async Task<List<Role>> GetExcludedRoles([FromRoute]int userId) => await db.GetExcludedRoles(userId);

        [HttpGet("[action]/{roleId}")]
        public async Task<Role> GetRole([FromRoute]int roleId) => await db.GetRole(roleId);

        [HttpPost("[action]/{userId}")]
        public async Task SaveUserRoles([FromRoute]int userId, [FromBody]List<UserRole> userRoles) => await db.SaveUserRoles(userId, userRoles);
    }
}