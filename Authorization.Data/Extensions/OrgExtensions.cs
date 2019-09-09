using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Authorization.Data.Entities;
using Authorization.Core.Extensions;
using Authorization.Core;

namespace Authorization.Data.Extensions
{
    public static class OrgExtensions
    {
        public static async Task<List<Org>> GetOrgs(this AppDbContext db, bool isDeleted = false)
        {
            var orgs = await db.Orgs
                .Where(x => x.IsDeleted == isDeleted)
                .OrderBy(x => x.Name)
                .ToListAsync();

            return orgs;
        }

        public static async Task<List<Org>> SearchOrgs(this AppDbContext db, string search, bool isDeleted = false)
        {
            var orgs = await db.Orgs
                .Where(x =>
                    x.IsDeleted == isDeleted &&
                    x.Name.ToLower().Contains(search.ToLower())
                )
                .OrderBy(x => x.Name)
                .ToListAsync();

            return orgs;
        }

        public static async Task<Org> GetOrg(this AppDbContext db, string name)
        {
            var org = await db.Orgs
                .FirstOrDefaultAsync(x => x.Name.ToLower() == name.ToLower());

            return org;
        }

        public static async Task<List<User>> GetOrgUsers(this AppDbContext db, int orgId)
        {
            var users = await db.OrgUsers
                .Where(x => x.OrgId == orgId)
                .Select(x => x.User)
                .OrderBy(x => x.UserName)
                .ToListAsync();

            return users;
        }

        public static async Task<List<User>> GetExcludedUsers(this AppDbContext db, int orgId)
        {
            var ids = await db.OrgUsers
                .Where(x => x.OrgId == orgId)
                .Select(x => x.UserId)
                .ToListAsync();

            var users = await db.Users
                .Where(x => !ids.Contains(x.Id))
                .OrderBy(x => x.UserName)
                .ToListAsync();

            return users;
        }

        public static async Task<List<UserRole>> GetOrgUserRoles(this AppDbContext db, int orgId, int userId)
        {
            var roles = await db.OrgUserRoles
                .Where(x =>
                    x.OrgUser.OrgId == orgId &&
                    x.OrgUser.UserId == userId
                )
                .Select(x => x.UserRole)
                    .Include(x => x.Role)
                .OrderBy(x => x.Role.Name)
                .ToListAsync();

            return roles;
        }

        public static async Task<List<UserRole>> GetExcludedOrgUserRoles(this AppDbContext db, int orgId, int userId)
        {
            var ids = await db.OrgUserRoles
                .Where(x =>
                    x.OrgUser.OrgId == orgId &&
                    x.OrgUser.UserId == userId
                )
                .Select(x => x.UserRoleId)
                .ToListAsync();

            var roles = await db.UserRoles
                .Include(x => x.Role)
                .Where(x => !ids.Contains(x.Id))
                .OrderBy(x => x.Role.Name)
                .ToListAsync();

            return roles;
        }

        public static async Task<bool> ValidateOrgName(this AppDbContext db, Org org)
        {
            org.Name = org.Name.UrlEncode();

            var check = await db.Orgs
                .FirstOrDefaultAsync(x =>
                    x.Id != org.Id &&
                    x.Name.ToLower() == org.Name.ToLower()
                );

            return check == null;
        }

        public static async Task AddOrg(this AppDbContext db, Org org)
        {
            if (await org.Validate(db))
            {
                await db.Orgs.AddAsync(org);
                await db.SaveChangesAsync();
            }
        }

        public static async Task UpdateOrg(this AppDbContext db, Org org)
        {
            if (await org.Validate(db))
            {
                db.Orgs.Update(org);
                await db.SaveChangesAsync();
            }
        }

        public static async Task ToggleOrgDeleted(this AppDbContext db, Org org)
        {
            db.Orgs.Attach(org);
            org.IsDeleted = !org.IsDeleted;
            await db.SaveChangesAsync();
        }

        public static async Task RemoveOrg(this AppDbContext db, Org org)
        {
            db.Orgs.Remove(org);
            await db.SaveChangesAsync();
        }

        public static async Task SaveOrgUsers(this AppDbContext db, int orgId, List<OrgUser> orgUsers)
        {
            if (orgUsers.Validate())
            {
                var userIds = await db.OrgUsers
                    .Where(x => x.OrgId == orgId)
                    .Select(x => x.UserId)
                    .ToListAsync();

                var removeUsers = await db.OrgUsers
                    .Where(x =>
                        x.OrgId == orgId &&
                        !orgUsers.Select(y => y.UserId).Contains(x.UserId)
                    )
                    .ToListAsync();

                var removeOrgRoles = await db.OrgUserRoles
                    .Where(x => removeUsers.Select(y => y.Id).Contains(x.OrgUserId))
                    .ToListAsync();

                var newUsers = orgUsers
                    .Where(x => !userIds.Contains(x.UserId))
                    .ToList();

                db.OrgUsers.RemoveRange(removeUsers);
                db.OrgUserRoles.RemoveRange(removeOrgRoles);
                await db.OrgUsers.AddRangeAsync(newUsers);
                await db.SaveChangesAsync();
            }
        }

        public static async Task SaveOrgUserRoles(this AppDbContext db, int orgId, int userId, List<UserRole> userRoles)
        {
            var orgUserRoles = await db.GenerateOrgUserRoles(orgId, userId, userRoles);

            if (orgUserRoles.Validate())
            {
                var userRoleIds = await db.OrgUserRoles
                    .Where(x =>
                        x.OrgUser.OrgId == orgId && 
                        x.OrgUser.UserId == userId
                    )
                    .Select(x => x.UserRoleId)
                    .ToListAsync();

                var removeUserRoles = await db.OrgUserRoles
                    .Where(x =>
                        x.OrgUser.OrgId == orgId &&
                        x.OrgUser.UserId == userId &&
                        !orgUserRoles.Select(y => y.UserRoleId).Contains(x.UserRoleId)
                    )
                    .ToListAsync();

                var newUserRoles = orgUserRoles
                    .Where(x => !userRoleIds.Contains(x.UserRoleId))
                    .ToList();

                db.OrgUserRoles.RemoveRange(removeUserRoles);
                await db.OrgUserRoles.AddRangeAsync(newUserRoles);
                await db.SaveChangesAsync();
            }
        }

        static async Task<List<OrgUserRole>> GenerateOrgUserRoles(this AppDbContext db, int orgId, int userId, List<UserRole> userRoles)
        {
            var orgUser = await db.OrgUsers
                .FirstOrDefaultAsync(x =>
                    x.OrgId == orgId &&
                    x.UserId == userId
                );

            return userRoles.Select(x => new OrgUserRole
            {
                OrgUserId = orgUser.Id,
                UserRoleId = x.Id
            }).ToList();
        }

        public static async Task<bool> Validate(this Org org, AppDbContext db)
        {
            if (string.IsNullOrEmpty(org.Name))
            {
                throw new Exception("An org must have a name");
            }
            
            if (!await db.ValidateOrgName(org))
            {
                throw new AppException("The provided org already exists", ExceptionType.Validation);
            }

            return true;
        }

        public static bool Validate(this IEnumerable<OrgUser> orgUsers)
        {
            foreach (var orgUser in orgUsers)
            {
                orgUser.Validate();
            }

            return true;
        }

        public static bool Validate(this OrgUser orgUser)
        {
            if (orgUser.UserId < 1)
            {
                throw new Exception("The provided org user lacks a user");
            }

            if (orgUser.OrgId < 1)
            {
                throw new Exception("The provided org user lacks an org");
            }

            return true;
        }

        public static bool Validate(this IEnumerable<OrgUserRole> orgUserRoles)
        {
            foreach (var orgUserRole in orgUserRoles)
            {
                orgUserRole.Validate();
            }

            return true;
        }

        public static bool Validate(this OrgUserRole orgUserRole)
        {
            if (orgUserRole.OrgUserId < 1)
            {
                throw new Exception("The provided org user role lacks an org user");
            }

            if (orgUserRole.UserRoleId < 1)
            {
                throw new Exception("The provided org user role lacks a user role");
            }

            return true;
        }
    }
}