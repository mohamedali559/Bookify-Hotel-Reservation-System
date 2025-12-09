namespace Bookify_Hotel_Reservation_System_PL.Models
{
    /// <summary>
    /// ViewModel for the Room Index page containing rooms list and filter data
    /// </summary>
    public class RoomIndexViewModel
    {
        /// <summary>
        /// List of all available rooms
        /// </summary>
        public List<RoomDetailsViewModel> Rooms { get; set; } = new();

        /// <summary>
        /// List of distinct room type names for the filter dropdown
        /// </summary>
        public List<string> RoomTypeNames { get; set; } = new();

        /// <summary>
        /// Minimum price from all rooms (for price slider)
        /// </summary>
        public decimal MinPrice { get; set; }

        /// <summary>
        /// Maximum price from all rooms (for price slider)
        /// </summary>
        public decimal MaxPrice { get; set; }

        /// <summary>
        /// Maximum number of guests from all room types (for guests filter)
        /// </summary>
        public int MaxGuests { get; set; }
    }
}
