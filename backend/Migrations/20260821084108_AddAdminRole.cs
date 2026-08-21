using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetHaven.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminRole : Migration
    {
        /// <inheritdoc />
       protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.InsertData(
        table: "Roles",
        columns: new[] { "RoleName" },
        values: new object[] { "Admin" });
}

protected override void Down(MigrationBuilder migrationBuilder)
{
    migrationBuilder.DeleteData(
        table: "Roles",
        keyColumn: "RoleName",
        keyValue: "Admin");
}
    }
}
