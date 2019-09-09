using System;
using System.Collections.Generic;

namespace Authorization.Data.Entities
{
    public class Caveat
    {
        public int Id { get; set; }
        public int BriefId { get; set; }
        public string Details { get; set; }
        public string Category { get; set; }

        public Brief Brief { get; set; }
    }
}