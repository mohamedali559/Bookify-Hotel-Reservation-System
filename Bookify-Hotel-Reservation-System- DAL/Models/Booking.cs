using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookify_Hotel_Reservation_System__DAL.Models
{
    public class Booking
    {
        public int Id { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime CheckInDate{ get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime CheckOutDate { get; set; }

        [Required]
        [Range(0, 999999)]
        public decimal Price{ get; set; }
        public BookingStatus Status { get; set; } = BookingStatus.Pending;
        public DateTime CreatedAt{ get; set; }


        // Relationships       
        [Required]
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        [Required]
        public int RoomId { get; set; }
        public Room Room { get; set; }
        
        public Payment Payment { get; set; }
    }
    public enum BookingStatus
    {
        Pending = 0,
        Confirmed,
        Cancelled,
        Completed
    }
}
