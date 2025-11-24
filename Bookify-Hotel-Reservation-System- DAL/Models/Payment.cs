using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookify_Hotel_Reservation_System__DAL.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Range(0, 999999)]
        public decimal Amount{ get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime PaymentDate{ get; set; }

        [Required]
        [MaxLength(50)]
        public string PaymentMethod { get; set; }

        [MaxLength(200)]
        public string TransactionId { get; set; }

        [MaxLength(50)]
        public string Status { get; set; }

        public Booking Booking { get; set; }

    }
}
