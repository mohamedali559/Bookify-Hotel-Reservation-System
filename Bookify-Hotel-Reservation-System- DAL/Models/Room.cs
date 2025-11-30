using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookify_Hotel_Reservation_System__DAL.Models
{
    public class Room
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(10)]
        public string? RoomNumber { get; set; }
        public int Floor { get; set; }

        public bool IsAvailable { get; set; }


        [Required]
        public string ImageUrl { get; set; }

        [Required]
        public int RoomTypeId { get; set; }
        public RoomType? RoomType { get; set; }

        public ICollection<Booking> Bookings { get; set; }
        public ICollection<RoomAmenity> RoomAmenities { get; set; }

    }

}
