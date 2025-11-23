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

        [Key]
        public int Id { get; set; }

        [Required]
        public string RoomNumber { get; set; }

        [Required]
        public string RoomType { get; set; }

        public string Description { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        [Range(0, 99999)]
        public decimal PricePerNight { get; set; }

        public bool IsAvailable { get; set; } = true;

        [Range(1, 10)]
        public int Capacity { get; set; }

        public string? ImageUrl { get; set; }

        public bool IsBooked { get; set; } = false;

        // public ICollection<Reservation>? Reservations { get; set; }
    }
}
