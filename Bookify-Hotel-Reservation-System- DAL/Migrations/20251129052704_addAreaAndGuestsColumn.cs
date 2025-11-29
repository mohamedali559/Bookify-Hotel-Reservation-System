using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bookify_Hotel_Reservation_System__DAL.Migrations
{
    /// <inheritdoc />
    public partial class addAreaAndGuestsColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Area",
                table: "RoomTypes",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "Guests",
                table: "RoomTypes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Area",
                table: "RoomTypes");

            migrationBuilder.DropColumn(
                name: "Guests",
                table: "RoomTypes");
        }
    }
}
