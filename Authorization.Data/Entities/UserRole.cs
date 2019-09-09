using System.Collections.Generic;

namespace Authorization.Data.Entities
{
    public class UserRole
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public int UserId { get; set; }
        
        public Role Role { get; set; }
        public User User { get; set; }

        public List<OrgUserRole> OrgUserRoles { get; set; }
    }
}