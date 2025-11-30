using System.ComponentModel.DataAnnotations;

namespace Bookify_Hotel_Reservation_System_PL.Models
{
    public class BookingViewModel
    {
        [Required(ErrorMessage = "Room ID is required")]
        public int RoomId { get; set; }

        [Required(ErrorMessage = "Guest name is required")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public string GuestName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string GuestEmail { get; set; }

        [Required(ErrorMessage = "Number of guests is required")]
        [Range(1, 10, ErrorMessage = "Number of guests must be between 1 and 10")]
        public int NumberOfGuests { get; set; }

        [Required(ErrorMessage = "Check-in date is required")]
        [DataType(DataType.Date)]
        public DateTime CheckInDate { get; set; }

        [Required(ErrorMessage = "Check-out date is required")]
        [DataType(DataType.Date)]
        public DateTime CheckOutDate { get; set; }

        public decimal TotalPrice { get; set; }
        public int NumberOfNights { get; set; }

        // Room information (for display)
        public string? RoomTypeName { get; set; }
        public string? RoomDescription { get; set; }
        public string? ImageUrl { get; set; }
        public decimal? PricePerNight { get; set; }
    }
}
