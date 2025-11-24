using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookify_Hotel_Reservation_System__DAL.Models
{
    public class RoomAmenity
    {
        public int RoomID {get;set;}
        public Room Room { get; set; }

        public int AmenityID { get; set; }
        public Amenity Amenity { get; set; }
    }
}
