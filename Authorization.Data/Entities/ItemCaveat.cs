using System;
using System.Collections.Generic;

namespace Authorization.Data.Entities
{
    public class ItemCaveat : Caveat
    {
        public int ItemId { get; set; }
        public string Name { get; set; }

        public Item Item { get; set; }
    }
}