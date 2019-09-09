using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Authorization.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Authorization.Data.Extensions
{
    public static class DbInitializer
    {
        public static async Task Initialize(this AppDbContext db)
        {
            Console.WriteLine("Initializing database");
            await db.Database.MigrateAsync();
            Console.WriteLine("Database initialized");

            if (! await db.Roles.AnyAsync())
            {
                Console.WriteLine("Seeding roles...");

                var roles = new List<Role>
                {
                    new Role { Name = "Tech", Description = "A technical role" },
                    new Role { Name = "User", Description = "A user role" }
                };

                await db.Roles.AddRangeAsync(roles);
                await db.SaveChangesAsync();
            }

            if (! await db.Orgs.AnyAsync())
            {
                Console.WriteLine("Seeding orgs...");

                var orgs = new List<Org>
                {
                    new Org { Name = "Microsoft" },
                    new Org { Name = "Google" },
                    new Org { Name = "Apple" }
                };

                await db.Orgs.AddRangeAsync(orgs);
                await db.SaveChangesAsync();
            }

            if (! await db.Briefs.AnyAsync())
            {
                Console.WriteLine("Seeding briefs...");

                var briefs = new List<Brief>
                {
                    new Brief { Name = "Sensitive" },
                    new Brief { Name = "Critical" },
                    new Brief { Name = "Dangerous" }
                };

                await db.Briefs.AddRangeAsync(briefs);
                await db.SaveChangesAsync();
            }
        }
    }
}