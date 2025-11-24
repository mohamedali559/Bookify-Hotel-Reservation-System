using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookify_Hotel_Reservation_System__DAL.Models
{
    public class Amenity
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(30)]
        public string Name{ get; set; }

        [MaxLength(300)]
        public string Description{ get; set; }
        public ICollection<RoomAmenity>RoomAmenities { get; set; }
    }
}
