using Bookify_Hotel_Reservation_System__DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace Bookify_Hotel_Reservation_System_PL.Models
{
    public class RoomDetailsViewModel
    {
        public int RoomId { get; set; }
        public int Floor { get; set; }
        public string ImageUrl { get; set; }
        public string RoomTypeName { get; set; }
        public string RoomDescription { get; set; }
        public decimal Area { get; set; }
        public int Guests { get; set; }

        public decimal BasePrice { get; set; }

        public List<Amenity> Amenities { get; set; }
    }

}
