using System.ComponentModel.DataAnnotations;

namespace Bookify_Hotel_Reservation_System_PL.Models
{
    public class PaymentViewModel
    {
        [Required(ErrorMessage = "Booking ID is required")]
        public int BookingId { get; set; }

        [Required(ErrorMessage = "Amount is required")]
        [Range(0.01, 999999, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Payment method is required")]
        [StringLength(50, ErrorMessage = "Payment method cannot exceed 50 characters")]
        public string PaymentMethod { get; set; }

        [StringLength(200, ErrorMessage = "Card number cannot exceed 200 characters")]
        public string? CardNumber { get; set; }

        [StringLength(100, ErrorMessage = "Cardholder name cannot exceed 100 characters")]
        public string? CardHolderName { get; set; }

        // For display purposes
        public string? RoomTypeName { get; set; }
        public string? GuestName { get; set; }
        public string? GuestEmail { get; set; }
        public DateTime? CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
        public int? NumberOfNights { get; set; }
    }
}
