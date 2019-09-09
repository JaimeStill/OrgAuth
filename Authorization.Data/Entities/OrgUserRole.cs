using System;
using System.Collections.Generic;

namespace Authorization.Data.Entities
{
    public class OrgUserRole
    {
        public int Id { get; set; }
        public int OrgUserId { get; set; }
        public int UserRoleId { get; set; }

        public OrgUser OrgUser { get; set; }
        public UserRole UserRole { get; set; }
    }
}