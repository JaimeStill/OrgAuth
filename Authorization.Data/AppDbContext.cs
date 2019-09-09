using Authorization.Data.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Authorization.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Brief> Briefs { get; set; }
        public DbSet<Caveat> Caveats { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<ItemCaveat> ItemCaveats { get; set; }
        public DbSet<Org> Orgs { get; set; }
        public DbSet<OrgUser> OrgUsers { get; set; }
        public DbSet<OrgUserRole> OrgUserRoles { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserBrief> UserBriefs { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Model
                .GetEntityTypes()
                .ToList()
                .ForEach(x =>
                {
                    modelBuilder
                        .Entity(x.Name)
                        .ToTable(x.Name.Split('.').Last());
                });

            modelBuilder.Entity<Caveat>()
                .HasDiscriminator(x => x.Category);

            modelBuilder.Entity<Role>()
                .HasMany(x => x.RoleUsers)
                .WithOne(x => x.Role)
                .HasForeignKey(x => x.RoleId)
                .IsRequired();

            modelBuilder.Entity<User>()
                .HasMany(x => x.UserOrgs)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .IsRequired();

            modelBuilder.Entity<OrgUserRole>()
                .HasOne(x => x.UserRole)
                .WithMany(x => x.OrgUserRoles)
                .HasForeignKey(x => x.UserRoleId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OrgUserRole>()
                .HasOne(x => x.OrgUser)
                .WithMany(x => x.OrgUserRoles)
                .HasForeignKey(x => x.OrgUserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasOne(x => x.DefaultOrg)
                .WithMany(x => x.OrgDefaultUsers)
                .HasForeignKey(x => x.DefaultOrgId)
                .IsRequired(false);
        }
    }
}
