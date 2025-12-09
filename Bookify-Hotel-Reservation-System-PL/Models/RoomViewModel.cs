using System.ComponentModel.DataAnnotations;

namespace Bookify_Hotel_Reservation_System_PL.Models
{
    public class RoomViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Room number is required")]
        [MaxLength(10, ErrorMessage = "Room number cannot exceed 10 characters")]
        [Display(Name = "Room Number")]
        public string RoomNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Floor is required")]
        [Display(Name = "Floor")]
        public int Floor { get; set; }

        [Required(ErrorMessage = "Room type is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Please select a valid room type")]
        [Display(Name = "Room Type")]
        public int RoomTypeId { get; set; }

        [Display(Name = "Availability")]
        public bool IsAvailable { get; set; } = true;

        [Required(ErrorMessage = "Image URL is required")]
        [Url(ErrorMessage = "Please enter a valid URL")]
        [Display(Name = "Image URL")]
        public string ImageUrl { get; set; } = string.Empty;
    }
}
