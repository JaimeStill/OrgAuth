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
    public class ItemController : Controller
    {
        private AppDbContext db;
        private IUserProvider provider;

        public ItemController(AppDbContext db, IUserProvider provider)
        {
            this.db = db;
            this.provider = provider;
        }

        [HttpGet("[action]")]
        public async Task<List<Item>> GetItems([FromRoute]string org) =>
            await db.Authorize(provider, org, async db => await db.GetItems(org));

        [HttpGet("[action]")]
        public async Task<List<Item>> GetDeletedItems([FromRoute]string org) =>
            await db.Authorize(provider, org, async db => await db.GetItems(org, true));

        [HttpGet("[action]/{search}")]
        public async Task<List<Item>> SearchItems([FromRoute]string org, [FromRoute]string search) =>
            await db.Authorize(provider, org, async db => await db.SearchItems(org, search));

        [HttpGet("[action]/{search}")]
        public async Task<List<Item>> SearchDeletedItems([FromRoute]string org, [FromRoute]string search) =>
            await db.Authorize(provider, org, async db => await db.SearchItems(org, search, true));

        [HttpGet("[action]/{itemId}/{userId}")]
        public async Task<List<ItemCaveat>> GetItemCaveats(
            [FromRoute]string org,
            [FromRoute]int itemId,
            [FromRoute]int userId
        ) => await db.Authorize(provider, org, async db => await db.GetItemCaveats(itemId, userId));

        [HttpGet("[action]/{itemId}/{userId}/{search}")]
        public async Task<List<ItemCaveat>> SearchItemCaveats(
            [FromRoute]string org,
            [FromRoute]int itemId,
            [FromRoute]int userId,
            [FromRoute]string search
        ) => await db.Authorize(provider, org, async db => await db.SearchItemCaveats(itemId, userId, search));

        [HttpGet("[action]/{itemId}")]
        public async Task<Item> GetItem([FromRoute]string org, [FromRoute]int itemId) =>
            await db.Authorize(provider, org, async db => await db.GetItem(itemId));

        [HttpPost("[action]")]
        public async Task AddItem([FromRoute]string org, [FromBody]Item item) =>
            await db.Authorize(provider, org, async db => await db.AddItem(item), "Tech");

        [HttpPost("[action]")]
        public async Task UpdateItem([FromRoute]string org, [FromBody]Item item) =>
            await db.Authorize(provider, org, async db => await db.UpdateItem(item), "Tech");

        [HttpPost("[action]")]
        public async Task ToggleItemDeleted([FromRoute]string org, [FromBody]Item item) =>
            await db.Authorize(provider, org, async db => await db.ToggleItemDeleted(item), "Tech");

        [HttpPost("[action]")]
        public async Task RemoveItem([FromRoute]string org, [FromBody]Item item) =>
            await db.Authorize(provider, org, async db => await db.RemoveItem(item), "Tech");
    }
}