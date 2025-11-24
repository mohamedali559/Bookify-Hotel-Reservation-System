using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookify_Hotel_Reservation_System__DAL.Models
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        [MaxLength(80)]
        public string FullName { get; set; }
        
        [MaxLength(80)]
        public string Address { get; set; }

        public ICollection<Booking> Bookings { get; set; }
        public ICollection<Review> Reviews { get; set; }
    }
}
