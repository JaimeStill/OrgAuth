using System;
using System.Collections.Generic;

namespace Authorization.Data.Entities
{
    public class Org
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsDeleted { get; set; }

        public List<Item> Items { get; set; }
        public List<OrgUser> OrgUsers { get; set; }
        public List<User> OrgDefaultUsers { get; set; }
    }
}