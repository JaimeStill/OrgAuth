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
    [Route("api/[controller]/{org}")]
    public class CaveatController : Controller
    {
        private AppDbContext db;
        private IUserProvider provider;

        public CaveatController(AppDbContext db, IUserProvider provider)
        {
            this.db = db;
            this.provider = provider;
        }

        [HttpGet("[action]{itemId}")]
        public async Task<ItemCaveat> GetItemCaveat([FromRoute]string org, [FromRoute]int itemId) =>
            await db.Authorize(provider, org, async db => await db.GetCaveat<ItemCaveat>(itemId));

        [HttpPost("[action]")]
        public async Task AddItemCaveat([FromRoute]string org, [FromBody]ItemCaveat caveat) =>
            await db.Authorize(provider, org, async db => await db.AddCaveat<ItemCaveat>(caveat.SetItemCaveatDetails()), "Tech");

        [HttpPost("[action]")]
        public async Task UpdateItemCaveat([FromRoute]string org, [FromBody]ItemCaveat caveat) =>
            await db.Authorize(provider, org, async db => await db.UpdateCaveat<ItemCaveat>(caveat), "Tech");

        [HttpPost("[action]")]
        public async Task RemoveItemCaveat([FromRoute]string org, [FromBody]ItemCaveat caveat) =>
            await db.Authorize(provider, org, async db => await db.RemoveCaveat(caveat), "Tech");
    }
}