using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetHaven.Migrations
{
    /// <inheritdoc />
    public partial class add_vetIdToAppointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "VetId",
                table: "Appointments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_VetId",
                table: "Appointments",
                column: "VetId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Vets_VetId",
                table: "Appointments",
                column: "VetId",
                principalTable: "Vets",
                principalColumn: "VetId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Vets_VetId",
                table: "Appointments");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_VetId",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "VetId",
                table: "Appointments");
        }
    }
}
