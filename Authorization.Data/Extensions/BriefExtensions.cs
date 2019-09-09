using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Authorization.Data.Entities;

namespace Authorization.Data.Extensions
{
    public static class BriefExtensions
    {
        public static async Task<List<Brief>> GetBriefs(this AppDbContext db, bool isDeleted = false)
        {
            var briefs = await db.Briefs
                .Where(x => x.IsDeleted == isDeleted)
                .OrderBy(x => x.Name)
                .ToListAsync();

            return briefs;
        }

        public static async Task<List<Brief>> SearchBriefs(this AppDbContext db, string search, bool isDeleted = false)
        {
            var briefs = await db.Briefs
                .Where(x =>
                    x.IsDeleted == isDeleted &&
                    x.Name.ToLower().Contains(search.ToLower())
                )
                .OrderBy(x => x.Name)
                .ToListAsync();

            return briefs;
        }

        public static async Task<List<int>> GetUserBriefIds(this AppDbContext db, int userId)
        {
            var briefIds = await db.UserBriefs
                .Where(x =>
                    !x.Brief.IsDeleted &&
                    x.UserId == userId
                )
                .Select(x => x.BriefId)
                .ToListAsync();

            return briefIds;
        }

        public static async Task<List<User>> GetBriefUsers(this AppDbContext db, int briefId)
        {
            var users = await db.UserBriefs
                .Where(x =>
                    !x.Brief.IsDeleted &&
                    x.BriefId == briefId
                )
                .Select(x => x.User)
                .OrderBy(x => x.UserName)
                .ToListAsync();

            return users;
        }

        public static async Task<List<Brief>> GetUserBriefs(this AppDbContext db, int userId)
        {
            var briefs = await db.UserBriefs
                .Where(x =>
                    !x.Brief.IsDeleted &&
                    x.UserId == userId
                )
                .Select(x => x.Brief)
                .OrderBy(x => x.Name)
                .ToListAsync();

            return briefs;
        }

        public static async Task<List<User>> GetBriefExcludedUsers(this AppDbContext db, int briefId)
        {
            var userIds = await db.UserBriefs
                .Where(x => x.BriefId == briefId)
                .Select(x => x.UserId)
                .ToListAsync();

            var users = await db.Users
                .Where(x => !userIds.Contains(x.Id))
                .OrderBy(x => x.UserName)
                .ToListAsync();

            return users;
        }

        public static async Task<List<Brief>> GetUserExcludedBriefs(this AppDbContext db, int userId)
        {
            var briefIds = await db.UserBriefs
                .Where(x => x.UserId == userId)
                .Select(x => x.BriefId)
                .ToListAsync();

            var briefs = await db.Briefs
                .Where(x => !briefIds.Contains(x.Id))
                .OrderBy(x => x.Name)
                .ToListAsync();

            return briefs;
        }

        public static async Task AddBrief(this AppDbContext db, Brief brief)
        {
            if (await brief.Validate(db))
            {
                await db.Briefs.AddAsync(brief);
                await db.SaveChangesAsync();
            }
        }

        public static async Task UpdateBrief(this AppDbContext db, Brief brief)
        {
            if (await brief.Validate(db))
            {
                db.Briefs.Update(brief);
                await db.SaveChangesAsync();
            }
        }

        public static async Task ToggleBriefDeleted(this AppDbContext db, Brief brief)
        {
            db.Briefs.Attach(brief);
            brief.IsDeleted = !brief.IsDeleted;
            await db.SaveChangesAsync();
        }

        public static async Task RemoveBrief(this AppDbContext db, Brief brief)
        {
            db.Briefs.Remove(brief);
            await db.SaveChangesAsync();
        }

        public static async Task SaveUserBriefs(this AppDbContext db, int userId, List<UserBrief> userBriefs)
        {
            if (userBriefs.Validate())
            {
                var briefIds = await db.UserBriefs
                    .Where(x => x.UserId == userId)
                    .Select(x => x.BriefId)
                    .ToListAsync();

                var removeBriefs = await db.UserBriefs
                    .Where(x =>
                        x.UserId == userId &&
                        !userBriefs.Select(y => y.BriefId).Contains(x.BriefId)
                    )
                    .ToListAsync();

                var newBriefs = userBriefs
                    .Where(x => !briefIds.Contains(x.BriefId))
                    .ToList();

                db.UserBriefs.RemoveRange(removeBriefs);
                await db.UserBriefs.AddRangeAsync(newBriefs);
                await db.SaveChangesAsync();
            }
        }

        public static async Task<bool> Validate(this Brief brief, AppDbContext db)
        {
            if (string.IsNullOrEmpty(brief.Name))
            {
                throw new Exception("A brief must have a name");
            }

            var check = await db.Briefs
                .FirstOrDefaultAsync(x =>
                    x.Id != brief.Id &&
                    x.Name.ToLower() == brief.Name.ToLower()
                );

            if (check != null)
            {
                throw new Exception("The provided brief already exists");
            }

            return true;
        }

        public static bool Validate(this IEnumerable<UserBrief> briefs)
        {
            foreach (var brief in briefs)
            {
                brief.Validate();
            }

            return true;
        }

        public static bool Validate(this UserBrief brief)
        {
            if (brief.BriefId < 1)
            {
                throw new Exception("The provided user brief lacks a brief");
            }

            if (brief.UserId < 1)
            {
                throw new Exception("The provided user brief lacks a user");
            }

            return true;
        }
    }
}