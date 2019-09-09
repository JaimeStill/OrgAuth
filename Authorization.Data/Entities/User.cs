using System;
using System.Collections.Generic;

namespace Authorization.Data.Entities
{
    public class User
    {
        public int Id { get; set; }
        public int? DefaultOrgId { get; set; }
        public Guid Guid { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string SocketName { get; set; }
        public string Theme { get; set; }
        public string Sidepanel { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsAdmin { get; set; }

        public Org DefaultOrg { get; set; }

        public List<OrgUser> UserOrgs { get; set; }
        public List<UserBrief> UserBriefs { get; set; }
        public List<UserRole> UserRoles { get; set; }
    }
}