using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Authorization.Data.Entities;
using Authorization.Core;

namespace Authorization.Data.Extensions
{
    public static class ItemExtensions
    {
        public static async Task<List<Item>> GetItems(this AppDbContext db, string org, bool isDeleted = false)
        {
            var items = await db.Items
                .Where(x =>
                    x.Org.Name.ToLower() == org.ToLower() &&
                    x.IsDeleted == isDeleted
                )
                .OrderBy(x => x.Name)
                .ToListAsync();

            return items;
        }

        public static async Task<List<Item>> SearchItems(this AppDbContext db, string org, string search, bool isDeleted = false)
        {
            var items = await db.Items
                .Where(x =>
                    x.Org.Name.ToLower() == org.ToLower() &&
                    x.IsDeleted == isDeleted &&
                    x.Name.ToLower().Contains(search.ToLower())
                )
                .OrderBy(x => x.Name)
                .ToListAsync();

            return items;
        }

        public static async Task<List<ItemCaveat>> GetItemCaveats(this AppDbContext db, int itemId, int userId)
        {
            var briefIds = await db.GetUserBriefIds(userId);

            var itemCaveats = await db.ItemCaveats
                .Include(x => x.Item)
                .Include(x => x.Brief)
                .Where(x =>
                    briefIds.Contains(x.BriefId) &&
                    x.ItemId == itemId
                )
                .OrderBy(x => x.Name)
                .ToListAsync();

            return itemCaveats;
        }

        public static async Task<List<ItemCaveat>> SearchItemCaveats(this AppDbContext db, int itemId, int userId, string search)
        {
            var briefIds = await db.GetUserBriefIds(userId);

            var itemCaveats = await db.ItemCaveats
                .Include(x => x.Item)
                .Include(x => x.Brief)
                .Where(x =>
                    briefIds.Contains(x.BriefId) && 
                    x.ItemId == itemId &&
                    x.Name.ToLower().Contains(search.ToLower())
                )
                .OrderBy(x => x.Name)
                .ToListAsync();

            return itemCaveats;
        }

        public static async Task<Item> GetItem(this AppDbContext db, int itemId)
        {
            var item = await db.Items.FindAsync(itemId);
            return item;
        }

        public static async Task AddItem(this AppDbContext db, Item item)
        {
            if (await item.Validate(db))
            {
                await db.Items.AddAsync(item);
                await db.SaveChangesAsync();
            }
        }

        public static async Task UpdateItem(this AppDbContext db, Item item)
        {
            if (await item.Validate(db))
            {
                db.Items.Update(item);
                await db.SaveChangesAsync();
            }
        }

        public static async Task ToggleItemDeleted(this AppDbContext db, Item item)
        {
            db.Items.Attach(item);
            item.IsDeleted = !item.IsDeleted;
            await db.SaveChangesAsync();
        }

        public static async Task RemoveItem(this AppDbContext db, Item item)
        {
            db.Items.Remove(item);
            await db.SaveChangesAsync();
        }

        public static async Task<bool> Validate(this Item item, AppDbContext db)
        {
            if (string.IsNullOrEmpty(item.Name))
            {
                throw new AppException("An item must have a name", ExceptionType.Validation);
            }

            if (item.OrgId < 1)
            {
                throw new AppException("An item must be associated with an org", ExceptionType.Validation);
            }

            var check = await db.Items
                .FirstOrDefaultAsync(x =>
                    x.Id != item.Id &&
                    x.Name.ToLower() == item.Name.ToLower() &&
                    x.OrgId == item.OrgId
                );

            if (check != null)
            {
                throw new AppException("The provided item already exists", ExceptionType.Validation);
            }
            return true;
        }
    }
}