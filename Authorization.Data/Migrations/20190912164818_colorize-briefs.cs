using Microsoft.EntityFrameworkCore.Migrations;

namespace Authorization.Data.Migrations
{
    public partial class colorizebriefs : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Background",
                table: "Brief",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Foreground",
                table: "Brief",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Background",
                table: "Brief");

            migrationBuilder.DropColumn(
                name: "Foreground",
                table: "Brief");
        }
    }
}
