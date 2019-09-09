using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Authorization.Data;
using Authorization.Data.Entities;
using Authorization.Data.Extensions;
using Authorization.Identity;
using Authorization.Auth;

namespace Authorization.Web.Controllers
{
    [Route("api/[controller]")]
    public class BriefController : Controller
    {
        private AppDbContext db;
        private IUserProvider provider;

        public BriefController(AppDbContext db, IUserProvider provider)
        {
            this.db = db;
            this.provider = provider;
        }

        [HttpGet("[action]")]
        public async Task<List<Brief>> GetBriefs() => await db.GetBriefs();

        [HttpGet("[action]")]
        public async Task<List<Brief>> GetDeletedBriefs() => await db.GetBriefs(true);

        [HttpGet("[action]/{search}")]
        public async Task<List<Brief>> SearchBriefs([FromRoute]string search) => await db.SearchBriefs(search);

        [HttpGet("[action]/{search}")]
        public async Task<List<Brief>> SearchDeletedBriefs([FromRoute]string search) => await db.SearchBriefs(search, true);

        [HttpGet("[action]/{userId}")]
        public async Task<List<int>> GetUserBriefIds([FromRoute]int userId) => await db.GetUserBriefIds(userId);

        [HttpGet("[action]/{briefId}")]
        public async Task<List<User>> GetBriefUsers([FromRoute]int briefId) => await db.GetBriefUsers(briefId);

        [HttpGet("[action]/{userId}")]
        public async Task<List<Brief>> GetUserBriefs([FromRoute]int userId) => await db.GetUserBriefs(userId);

        [HttpGet("[action]/{briefId}")]
        public async Task<List<User>> GetBriefExcludedUsers([FromRoute]int briefId) => await db.GetBriefExcludedUsers(briefId);

        [HttpGet("[action]/{userId}")]
        public async Task<List<Brief>> GetUserExcludedBriefs([FromRoute]int userId) => await db.GetUserExcludedBriefs(userId);

        [HttpPost("[action]")]
        public async Task AddBrief([FromBody]Brief brief) =>
            await db.Authorize(provider, async db => await db.AddBrief(brief));

        [HttpPost("[action]")]
        public async Task UpdateBrief([FromBody]Brief brief) =>
            await db.Authorize(provider, async db => await db.UpdateBrief(brief));

        [HttpPost("[action]")]
        public async Task ToggleBriefDeleted([FromBody]Brief brief) =>
            await db.Authorize(provider, async db => await db.ToggleBriefDeleted(brief));

        [HttpPost("[action]")]
        public async Task RemoveBrief([FromBody]Brief brief) =>
            await db.Authorize(provider, async db => await db.RemoveBrief(brief));

        [HttpPost("[action]/{userId}")]
        public async Task SaveUserBriefs([FromRoute]int userId, [FromBody]List<UserBrief> userBriefs) =>
            await db.Authorize(provider, async db => await db.SaveUserBriefs(userId, userBriefs));
    }
}