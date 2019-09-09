using System.Collections.Generic;

namespace Authorization.Data.Entities
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public List<UserRole> RoleUsers { get; set; }
    }
}