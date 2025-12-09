using Bookify_Hotel_Reservation_System__DAL.Models;

namespace Bookify_Hotel_Reservation_System_PL.Models
{
    public class AdminRoomsViewModel
    {
        public IEnumerable<Room> Rooms { get; set; }
        public IEnumerable<RoomType> RoomTypes { get; set; }
        public RoomViewModel RoomForm { get; set; }
    }
}
