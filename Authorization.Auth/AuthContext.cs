using System.Collections.Generic;
using Authorization.Data.Entities;

namespace Authorization.Auth
{
    public class AuthContext
    {
        public Org Org { get; set; }
        public User User { get; set; }
        public List<Brief> Briefs { get; set; }
        public List<Role> Roles { get; set; }
    }
}