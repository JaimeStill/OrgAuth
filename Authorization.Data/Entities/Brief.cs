using System;
using System.Collections.Generic;

namespace Authorization.Data.Entities
{
    public class Brief
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Background { get; set; }
        public string Foreground { get; set; }
        public bool IsDeleted { get; set; }
        
        public List<UserBrief> UserBriefs { get; set; }
        public List<Caveat> Caveats { get; set; }
    }
}