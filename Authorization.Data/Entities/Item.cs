using System;
using System.Collections.Generic;

namespace Authorization.Data.Entities
{
    public class Item
    {
        public int Id { get; set; }
        public int OrgId { get; set; }
        public string Name { get; set; }
        public bool IsDeleted { get; set; }

        public Org Org { get; set; }

        public List<ItemCaveat> ItemCaveats { get; set; }
    }
}