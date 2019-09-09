using Microsoft.EntityFrameworkCore.Migrations;

namespace Authorization.Data.Migrations
{
    public partial class userdefaultorg : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DefaultOrgId",
                table: "User",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_User_DefaultOrgId",
                table: "User",
                column: "DefaultOrgId");

            migrationBuilder.AddForeignKey(
                name: "FK_User_Org_DefaultOrgId",
                table: "User",
                column: "DefaultOrgId",
                principalTable: "Org",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_User_Org_DefaultOrgId",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_DefaultOrgId",
                table: "User");

            migrationBuilder.DropColumn(
                name: "DefaultOrgId",
                table: "User");
        }
    }
}
