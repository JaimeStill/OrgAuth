using System;
using System.Collections.Generic;

namespace Authorization.Data.Entities
{
    public class OrgUser
    {
        public int Id { get; set; }
        public int OrgId { get; set; }
        public int UserId { get; set; }
        
        public Org Org { get; set; }
        public User User { get; set; }

        public List<OrgUserRole> OrgUserRoles { get; set; }
    }
}