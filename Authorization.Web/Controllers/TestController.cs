using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Authorization.Data;
using Authorization.Data.Entities;
using Authorization.Data.Extensions;
using Microsoft.EntityFrameworkCore;
using Authorization.Identity;
using Authorization.Auth;
using Authorization.Core;
using System;

namespace Authorization.Web.Controllers
{
    [Route("api/[controller]/{org}")]
    public class TestController : Controller
    {
        private AppDbContext db;
        private IUserProvider provider;

        public TestController(AppDbContext db, IUserProvider provider)
        {
            this.db = db;
            this.provider = provider;
        }

        [HttpGet("[action]")]
        public string WriteOrg([FromRoute]string org) => $"Current unit: {org}";

        [HttpGet("[action]")]
        public async Task<string> CheckOrg([FromRoute]string org)
        {
            var organization = await db.Orgs.FirstOrDefaultAsync(x => x.Name.ToLower() == org.ToLower());

            return organization == null ?
                "The provided org is invalid" :
                $"{organization.Name} is a valid org";
        }

        [HttpGet("[action]")]
        public async Task<Org> GetOrgAsAdmin([FromRoute]string org) =>
            await db.Authorize(provider, async db => await db.GetOrg(org));

        [HttpGet("[action]")]
        public async Task<Org> GetOrgAsAnyRole([FromRoute]string org) =>
            await db.Authorize(provider, org, async db => await db.GetOrg(org));

        [HttpGet("[action]")]
        public async Task<Org> GetOrgAsTech([FromRoute]string org) => 
            await db.Authorize(provider, org, async db => await db.GetOrg(org), "Tech");

        [HttpGet("[action]")]
        public async Task<Org> GetOrgAsTechOrUser([FromRoute]string org) =>
            await db.Authorize(provider, org, async db => await db.GetOrg(org), "Tech", "User");

        [HttpGet("[action]")]
        public void TestAuthException() => throw new AppException("Test authorization exception", ExceptionType.Authorization);

        [HttpGet("[action]")]
        public void TestValidationException() => throw new AppException("Test validation exception", ExceptionType.Validation);

        [HttpGet("[action]")]
        public void TestException() => throw new Exception("System critical exception");
    }
}