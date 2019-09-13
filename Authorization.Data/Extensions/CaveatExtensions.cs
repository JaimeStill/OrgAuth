using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Authorization.Data.Entities;
using System.Text;
using Authorization.Core;

namespace Authorization.Data.Extensions
{
    public static class CaveatExtensions
    {
        public static async Task<T> GetCaveat<T>(this AppDbContext db, int id) where T: Caveat
        {
            var caveat = await db.Set<T>()
                .FirstOrDefaultAsync(x => x.Id == id);

            return caveat;
        }

        public static async Task AddCaveat<T>(this AppDbContext db, T caveat) where T: Caveat
        {
            if (caveat.Validate())
            {
                await db.AddAsync(caveat);
                await db.SaveChangesAsync();
            }
        }

        public static async Task UpdateCaveat<T>(this AppDbContext db, T caveat) where T: Caveat
        {
            if (caveat.Validate())
            {
                db.Update(caveat);
                await db.SaveChangesAsync();
            }
        }

        public static async Task RemoveCaveat(this AppDbContext db, Caveat caveat)
        {
            db.Remove(caveat);
            await db.SaveChangesAsync();
        }

        public static bool Validate(this Caveat caveat)
        {
            if (caveat.BriefId < 1)
            {
                throw new AppException("A caveat must be linked to a briefing", ExceptionType.Validation);
            }
            return true;
        }

        public static ItemCaveat SetItemCaveatDetails(this ItemCaveat caveat)
        {
            if (string.IsNullOrEmpty(caveat.Details) && !(caveat.Item == null))
            {
                var details = new StringBuilder();
                details.AppendLine($"Item Name: {caveat.Item.Name}");
            }

            return caveat;
        }
    }
}