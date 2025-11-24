using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookify_Hotel_Reservation_System__DAL.Models
{
    public class Review
    {
        public int Id { get; set; }

        [Required]
        [Range(1, 5)]
        public decimal Rate{ get; set; }

        [MaxLength(500)]
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }

        [Required]
        public string UserId { get; set; }
        public ApplicationUser User{ get; set; }
    }
}
