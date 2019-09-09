using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Authorization.Auth;
using Authorization.Data;
using Authorization.Data.Extensions;
using Authorization.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Authorization.Web.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private AppDbContext db;
        private IUserProvider provider;

        public AuthController(AppDbContext db, IUserProvider provider)
        {
            this.db = db;
            this.provider = provider;
        }

        [HttpGet("[action]/{orgId}")]
        public async Task<AuthContext> GetAuthContext([FromRoute]int orgId) => await db.GetAuthContext(provider, orgId);

        [HttpGet("[action]")]
        public async Task<bool> ValidateAdmin() => await db.ValidateAdmin(this.provider.CurrentUser.Guid.Value);

        [HttpGet("[action]/{org}")]
        public async Task<bool> ValidateAnyRole([FromRoute]string org) => await db.ValidateAnyRole(org, this.provider.CurrentUser.Guid.Value);

        [HttpPost("[action]/{org}")]
        public async Task<bool> ValidateRole([FromRoute]string org, [FromBody]string[] roles) => await db.ValidateRole(org, this.provider.CurrentUser.Guid.Value, roles);
    }
}