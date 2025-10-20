using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClientHub.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddNameIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Clients_Name",
                table: "Clients",
                column: "Name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Clients_Name",
                table: "Clients");
        }
    }
}
