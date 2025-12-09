using Bookify_Hotel_Reservation_System__DAL.Models;

namespace Bookify_Hotel_Reservation_System_PL.Models
{
    public class AdminRoomTypesViewModel
    {
        public IEnumerable<RoomType> RoomTypes { get; set; }
        public RoomTypeViewModel RoomTypeForm { get; set; }
    }
}
