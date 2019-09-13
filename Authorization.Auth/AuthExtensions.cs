using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Authorization.Data;
using Authorization.Identity;
using Authorization.Core;

namespace Authorization.Auth
{
    public static class AuthorizationExtensions
    {
        public static async Task<AuthContext> GetAuthContext(this AppDbContext db, IUserProvider provider, int orgId)
        {
            var org = await db.Orgs.FindAsync(orgId);

            var user = await db.Users
                .FirstOrDefaultAsync(x => x.Guid == provider.CurrentUser.Guid.Value);

            var briefs = await db.UserBriefs
                .Where(x =>
                    !x.Brief.IsDeleted &&
                    x.UserId == user.Id
                )
                .Select(x => x.Brief)
                .OrderBy(x => x.Name)
                .ToListAsync();

            var roles = await db.OrgUserRoles
                .Where(x =>
                    x.OrgUser.UserId == user.Id &&
                    x.OrgUser.OrgId == org.Id
                )
                .Select(x => x.UserRole.Role)
                .OrderBy(x => x.Name)
                .ToListAsync();

            return new AuthContext
            {
                Org = org,
                User = user,
                Briefs = briefs,
                Roles = roles
            };
        }

        public static async Task<AuthContext> GetDefaultContext(this AppDbContext db, IUserProvider provider)
        {
            var user = await db.Users
              .FirstOrDefaultAsync(x => x.Guid == provider.CurrentUser.Guid.Value);

            if (!user.DefaultOrgId.HasValue)
            {
                throw new AppException($"{user.UserName} does not have a default org context", ExceptionType.Validation);
            }

            var org = await db.Orgs.FindAsync(user.DefaultOrgId.Value);

            var briefs = await db.UserBriefs
              .Where(x =>
                !x.Brief.IsDeleted &&
                x.UserId == user.Id
              )
              .Select(x => x.Brief)
              .OrderBy(x => x.Name)
              .ToListAsync();

            var roles = await db.OrgUserRoles
              .Where(x =>
                x.OrgUser.UserId == user.Id &&
                x.OrgUser.OrgId == org.Id
              )
              .Select(x => x.UserRole.Role)
              .OrderBy(x => x.Name)
              .ToListAsync();

            return new AuthContext
            {
                Org = org,
                User = user,
                Briefs = briefs,
                Roles = roles
            };
        }

        public static async Task<T> Authorize<T>(this AppDbContext db, IUserProvider provider, Func<AppDbContext, Task<T>> exec)
        {
            if (await db.ValidateAdmin(provider.CurrentUser.Guid.Value))
            {
                return await exec(db);
            }
            else
            {
                throw new AppException($"{provider.CurrentUser.SamAccountName} is not an administrator", ExceptionType.Authorization);
            }
        }

        public static async Task Authorize(this AppDbContext db, IUserProvider provider, Func<AppDbContext, Task> exec)
        {
            if (await db.ValidateAdmin(provider.CurrentUser.Guid.Value))
            {
                await exec(db);
            }
            else
            {
                throw new AppException($"{provider.CurrentUser.SamAccountName} is not an administrator", ExceptionType.Authorization);
            }
        }

        public static async Task<T> Authorize<T>(this AppDbContext db, IUserProvider provider, string org, Func<AppDbContext, Task<T>> exec)
        {
            if (await db.ValidateAnyRole(org, provider.CurrentUser.Guid.Value))
            {
                return await exec(db);
            }
            else
            {
                throw new AppException($"{provider.CurrentUser.SamAccountName} is not authorized to access this resource", ExceptionType.Authorization);
            }
        }

        public static async Task Authorize(this AppDbContext db, IUserProvider provider, string org, Func<AppDbContext, Task> exec)
        {
            if (await db.ValidateAnyRole(org, provider.CurrentUser.Guid.Value))
            {
                await exec(db);
            }
            else
            {
                throw new AppException($"{provider.CurrentUser.SamAccountName} is not authorized to access this resource", ExceptionType.Authorization);
            }
        }

        public static async Task<T> Authorize<T>(this AppDbContext db, IUserProvider provider, string org, Func<AppDbContext, Task<T>> exec, params string[] roles)
        {
            if (roles.Count() < 1)
                throw new AppException("A role must be provided for Org authorization", ExceptionType.Validation);

            if (await db.ValidateRole(org, provider.CurrentUser.Guid.Value, roles))
            {
                return await exec(db);
            }
            else
            {
                throw new AppException($"{provider.CurrentUser.SamAccountName} is not authorized to access this resource", ExceptionType.Authorization);
            }
        }

        public static async Task Authorize(this AppDbContext db, IUserProvider provider, string org, Func<AppDbContext, Task> exec, params string[] roles)
        {
            if (roles.Count() < 1)
                throw new AppException("A role must be provided for Org authorization", ExceptionType.Validation);

            if (await db.ValidateRole(org, provider.CurrentUser.Guid.Value, roles))
            {
                await exec(db);
            }
            else
            {
                throw new AppException($"{provider.CurrentUser.SamAccountName} is not authorized to access this resource", ExceptionType.Authorization);
            }
        }

        public static async Task<bool> ValidateAdmin(this AppDbContext db, Guid guid)
        {
            var user = await db.Users.FirstOrDefaultAsync(x => x.Guid == guid);

            return user == null ?
                false :
                user.IsAdmin;
        }

        public static async Task<bool> ValidateAnyRole(this AppDbContext db, string org, Guid guid)
        {
            var check = await db.OrgUserRoles.FirstOrDefaultAsync(x =>
                x.OrgUser.Org.Name.ToLower() == org.ToLower() &&
                x.OrgUser.User.Guid == guid
            );

            return check != null;
        }

        public static async Task<bool> ValidateRole(this AppDbContext db, string org, Guid guid, string[] roles)
        {
            var check = await db.OrgUserRoles.FirstOrDefaultAsync(x =>
                x.OrgUser.Org.Name.ToLower() == org.ToLower() &&
                x.OrgUser.User.Guid == guid &&
                roles.Contains(x.UserRole.Role.Name)
            );

            return check != null;
        }
    }
}