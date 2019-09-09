using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Authorization.Data;
using Authorization.Data.Entities;
using Authorization.Data.Extensions;

namespace Authorization.Web.Controllers
{
    [Route("api/[controller]")]
    public class OrgController : Controller
    {
        private AppDbContext db;

        public OrgController(AppDbContext db)
        {
            this.db = db;
        }

        [HttpGet("[action]")]
        public async Task<List<Org>> GetOrgs() => await db.GetOrgs();

        [HttpGet("[action]")]
        public async Task<List<Org>> GetDeletedOrgs() => await db.GetOrgs(true);

        [HttpGet("[action]/{search}")]
        public async Task<List<Org>> SearchOrgs([FromRoute]string search) => await db.SearchOrgs(search);

        [HttpGet("[action]/{search}")]
        public async Task<List<Org>> SearchDeletedOrgs([FromRoute]string search) => await db.SearchOrgs(search, true);

        [HttpGet("[action]/{name}")]
        public async Task<Org> GetOrg([FromRoute]string name) => await db.GetOrg(name);

        [HttpGet("[action]/{orgId}")]
        public async Task<List<User>> GetOrgUsers([FromRoute]int orgId) => await db.GetOrgUsers(orgId);

        [HttpGet("[action]/{orgId}")]
        public async Task<List<User>> GetExcludedUsers([FromRoute]int orgId) => await db.GetExcludedUsers(orgId);

        [HttpGet("[action]/{orgId}/{userId}")]
        public async Task<List<UserRole>> GetOrgUserRoles([FromRoute]int orgId, [FromRoute]int userId) => await db.GetOrgUserRoles(orgId, userId);

        [HttpGet("[action]/{orgId}/{userId}")]
        public async Task<List<UserRole>> GetExcludedOrgUserRoles([FromRoute]int orgId, [FromRoute]int userId) => await db.GetExcludedOrgUserRoles(orgId, userId);

        [HttpPost("[action]")]
        public async Task<bool> ValidateOrgName([FromBody]Org org) => await db.ValidateOrgName(org);

        [HttpPost("[action]")]
        public async Task AddOrg([FromBody]Org org) => await db.AddOrg(org);

        [HttpPost("[action]")]
        public async Task UpdateOrg([FromBody]Org org) => await db.UpdateOrg(org);

        [HttpPost("[action]")]
        public async Task ToggleOrgDeleted([FromBody]Org org) => await db.ToggleOrgDeleted(org);

        [HttpPost("[action]")]
        public async Task RemoveOrg([FromBody]Org org) => await db.RemoveOrg(org);

        [HttpPost("[action]/{orgId}")]
        public async Task SaveOrgUsers([FromRoute]int orgId, [FromBody]List<OrgUser> orgUsers) => await db.SaveOrgUsers(orgId, orgUsers);

        [HttpPost("[action]/{orgId}/{userId}")]
        public async Task SaveOrgUserRoles([FromRoute]int orgId, [FromRoute]int userId, [FromBody]List<UserRole> userRoles) =>
            await db.SaveOrgUserRoles(orgId, userId, userRoles);
    }
}