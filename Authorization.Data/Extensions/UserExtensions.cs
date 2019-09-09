using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Authorization.Core.Extensions;
using Authorization.Data.Entities;
using Authorization.Identity;
using Microsoft.EntityFrameworkCore;

namespace Authorization.Data.Extensions
{
    public static class UserExtensions
    {
        public static async Task<List<User>> GetUsers(this AppDbContext db, bool isDeleted = false)
        {
            var users = await db.Users
                .Where(x => x.IsDeleted == isDeleted)
                .OrderBy(x => x.LastName)
                .ToListAsync();

            return users;
        }

        public static async Task<List<User>> SearchUsers(this AppDbContext db, string search, bool isDeleted = false)
        {
            search = search.ToLower();

            var users = await db.Users
                .Where(x =>
                    x.IsDeleted == isDeleted &&
                    (
                        x.Email.ToLower().Contains(search) ||
                        x.FirstName.ToLower().Contains(search) ||
                        x.LastName.ToLower().Contains(search) ||
                        x.UserName.ToLower().Contains(search)
                    )
                )
                .OrderBy(x => x.LastName)
                .ToListAsync();

            return users;
        }

        public static async Task<List<Org>> GetCurrentUserOrgs(this AppDbContext db, Guid guid)
        {
            var user = await db.Users.FirstOrDefaultAsync(x => x.Guid == guid);
            
            var orgs = await db.OrgUsers
                .Where(x => 
                    x.UserId == user.Id &&
                    !x.Org.IsDeleted
                )
                .Select(x => x.Org)
                .OrderBy(x => x.Name)
                .ToListAsync();

            return orgs;
        }

        public static async Task<List<Org>> SearchCurrentUserOrgs(this AppDbContext db, Guid guid, string search)
        {
            var user = await db.Users.FirstOrDefaultAsync(x => x.Guid == guid);

            var orgs = await db.OrgUsers
                .Where(x =>
                    x.UserId == user.Id &&
                    !x.Org.IsDeleted &&
                    x.Org.Name.ToLower().Contains(search.ToLower())
                )
                .Select(x => x.Org)
                .OrderBy(x => x.Name)
                .ToListAsync();

            return orgs;
        }

        public static async Task<User> GetUser(this AppDbContext db, int id)
        {
            var user = await db.Users.FindAsync(id);
            return user;
        }

        public static async Task<User> GetUser(this AppDbContext db, string username)
        {
            var user = await db.Users
                .FirstOrDefaultAsync(x => x.UserName == username);

            return user;
        }

        public static async Task<User> SyncUser(this AdUser adUser, AppDbContext db)
        {
            var user = await db.Users
                .FirstOrDefaultAsync(x => x.Guid == adUser.Guid);

            user = user == null ?
                await db.AddUser(adUser) :
                await db.UpdateUser(adUser);

            return user;
        }

        public static async Task<bool> ValidateUsername(this AppDbContext db, User user)
        {
            user.UserName = user.UserName.UrlEncode();

            var check = await db.Users
                .Where(x => x.Guid != user.Guid)
                .FirstOrDefaultAsync(x => x.UserName.ToLower() == user.UserName.ToLower());

            return check == null;
        }

        public static async Task<User> AddUser(this AppDbContext db, AdUser adUser)
        {
            User user = null;

            if (await adUser.Validate(db))
            {
                user = new User
                {
                    Email = adUser.UserPrincipalName,
                    FirstName = adUser.GivenName,
                    Guid = adUser.Guid.Value,
                    IsDeleted = false,
                    IsAdmin = false,
                    LastName = adUser.Surname,
                    Sidepanel = "thin",
                    SocketName = $@"{adUser.GetDomainPrefix()}\{adUser.SamAccountName}",
                    Theme = "light-blue",
                    UserName = adUser.SamAccountName.UrlEncode()
                };

                await user.GenerateUniqueUsername(db);
                await db.Users.AddAsync(user);
                await db.SaveChangesAsync();
            }

            return user;
        }

        public static async Task UpdateUser(this AppDbContext db, User user)
        {
            if (await db.ValidateUsername(user))
            {
                db.Users.Update(user);
                await db.SaveChangesAsync();
            }
            else
            {
                throw new Exception("The provided username is already in use");
            }
        }

        private static async Task<User> UpdateUser(this AppDbContext db, AdUser adUser)
        {
            var user = await db.Users
                .FirstOrDefaultAsync(x => x.Guid == adUser.Guid);

            user.Email = adUser.UserPrincipalName;
            user.FirstName = adUser.GivenName;
            user.LastName = adUser.Surname;
            user.SocketName = $@"{adUser.GetDomainPrefix()}\{adUser.SamAccountName}";

            await db.SaveChangesAsync();
            return user;
        }

        public static async Task ToggleUserAdmin(this AppDbContext db, User user)
        {
            db.Users.Attach(user);
            user.IsAdmin = !user.IsAdmin;
            await db.SaveChangesAsync();
        }

        public static async Task ToggleUserDeleted(this AppDbContext db, User user)
        {
            db.Users.Attach(user);
            user.IsDeleted = !user.IsDeleted;
            await db.SaveChangesAsync();
        }

        public static async Task RemoveUser(this AppDbContext db, User user)
        {
            db.Users.Remove(user);
            await db.SaveChangesAsync();
        }

        public static async Task<bool> Validate(this AdUser user, AppDbContext db)
        {
            var check = await db.Users
                .FirstOrDefaultAsync(x => x.Guid == user.Guid.Value);

            if (check != null)
            {
                throw new Exception("The provided user already has an account");
            }

            return true;
        }

        private static async Task GenerateUniqueUsername(this User user, AppDbContext db, int inc = 0)
        {
            var name = user.UserName;

            var check = await db.Users
                .Where(x => x.Guid != user.Guid)
                .FirstOrDefaultAsync(x => x.UserName == name);

            if (check != null)
            {
                ++inc;
                user.UserName = $"{name}_{inc}";
                await user.GenerateUniqueUsername(db, inc);
            }
        }
    }
}