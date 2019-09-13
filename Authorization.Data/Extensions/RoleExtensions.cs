using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Authorization.Core;
using Authorization.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Authorization.Data.Extensions
{
    public static class RoleExtensions
    {
        public static async Task<List<Role>> GetRoles(this AppDbContext db)
        {
            var roles = await db.Roles
                .OrderBy(x => x.Name)
                .ToListAsync();

            return roles;
        }

        public static async Task<List<Role>> SearchRoles(this AppDbContext db, string search)
        {
            search = search.ToLower();

            var roles = await db.Roles
                .Where(x => 
                    x.Name.ToLower().Contains(search) ||
                    x.Description.ToLower().Contains(search)
                )
                .OrderBy(x => x.Name)
                .ToListAsync();

            return roles;
        }

        public static async Task<List<Role>> GetUserRoles(this AppDbContext db, int userId)
        {
            var roles = await db.UserRoles
                .Where(x => x.UserId == userId)
                .Select(x => x.Role)
                .OrderBy(x => x.Name)
                .ToListAsync();

            return roles;
        }

        public static async Task<List<Role>> GetExcludedRoles(this AppDbContext db, int userId)
        {
            var ids = await db.UserRoles
                .Where(x => x.UserId == userId)
                .Select(x => x.RoleId)
                .ToListAsync();

            var roles = await db.Roles
                .Where(x => !ids.Contains(x.Id))
                .OrderBy(x => x.Name)
                .ToListAsync();

            return roles;
        }

        public static async Task<Role> GetRole(this AppDbContext db, int roleId)
        {
            var role = await db.Roles.FindAsync(roleId);
            return role;
        }

        public static async Task SaveUserRoles(this AppDbContext db, int userId, List<UserRole> userRoles)
        {
            if (userRoles.Validate())
            {
                var roleIds = await db.UserRoles
                    .Where(x => x.UserId == userId)
                    .Select(x => x.RoleId)
                    .ToListAsync();

                var removeRoles = await db.UserRoles
                    .Where(x => 
                        x.UserId == userId &&
                        !userRoles.Select(y => y.RoleId).Contains(x.RoleId)
                    )
                    .ToListAsync();

                var removeOrgRoles = await db.OrgUserRoles
                    .Where(x => removeRoles.Select(y => y.Id).Contains(x.UserRoleId))
                    .ToListAsync();

                var newRoles = userRoles
                    .Where(x => !roleIds.Contains(x.RoleId))
                    .ToList();

                db.UserRoles.RemoveRange(removeRoles);
                db.OrgUserRoles.RemoveRange(removeOrgRoles);
                await db.UserRoles.AddRangeAsync(newRoles);
                await db.SaveChangesAsync();
            }
        }

        public static bool Validate(this IEnumerable<UserRole> roles)
        {
            foreach (var role in roles)
            {
                role.Validate();
            }

            return true;
        }

        public static bool Validate(this UserRole userRole)
        {
            if (userRole.UserId < 1)
            {
                throw new AppException("The provided user role lacks a user", ExceptionType.Validation);
            }

            if (userRole.RoleId < 1)
            {
                throw new AppException("The provided user role lacks a role", ExceptionType.Validation);
            }

            return true;
        }
    }
}