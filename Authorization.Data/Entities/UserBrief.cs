using System;
using System.Collections.Generic;

namespace Authorization.Data.Entities
{
    public class UserBrief
    {
        public int Id { get; set; }
        public int BriefId { get; set; }
        public int UserId { get; set; }

        public Brief Brief { get; set; }
        public User User { get; set; }
    }
}