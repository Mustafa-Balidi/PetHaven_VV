using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetHaven.Migrations
{
    /// <inheritdoc />
    public partial class AddVetVerificationStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LicenseIssueDate",
                table: "Vets",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RejectionReason",
                table: "Vets",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SubmittedAt",
                table: "Vets",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VerificationStatus",
                table: "Vets",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Pending");

            // مزامنة الحالة مع الأطباء الموجودين مسبقاً
            migrationBuilder.Sql(
                "UPDATE Vets SET VerificationStatus = CASE WHEN IsVerified = 1 THEN 'Approved' ELSE 'Pending' END;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LicenseIssueDate",
                table: "Vets");

            migrationBuilder.DropColumn(
                name: "RejectionReason",
                table: "Vets");

            migrationBuilder.DropColumn(
                name: "SubmittedAt",
                table: "Vets");

            migrationBuilder.DropColumn(
                name: "VerificationStatus",
                table: "Vets");
        }
    }
}
