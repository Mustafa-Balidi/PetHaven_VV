using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetHaven.Migrations
{
    /// <inheritdoc />
    public partial class AddVetCertificateUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CertificateUrl",
                table: "Vets",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CertificateUrl",
                table: "Vets");
        }
    }
}
