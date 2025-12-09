using System.ComponentModel.DataAnnotations;

namespace Bookify_Hotel_Reservation_System_PL.Models
{
    public class RoomTypeViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [MaxLength(50, ErrorMessage = "Name cannot exceed 50 characters")]
        [Display(Name = "Room Type Name")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(300, ErrorMessage = "Description cannot exceed 300 characters")]
        [Display(Name = "Description")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Area is required")]
        [Range(0, 999999, ErrorMessage = "Area must be positive")]
        [Display(Name = "Area (sq ft)")]
        public decimal Area { get; set; }

        [Required(ErrorMessage = "Number of guests is required")]
        [Range(1, 20, ErrorMessage = "Guests must be between 1 and 20")]
        [Display(Name = "Maximum Guests")]
        public int Guests { get; set; }

        [Required(ErrorMessage = "Base price is required")]
        [Range(0, 999999, ErrorMessage = "Price must be positive")]
        [Display(Name = "Base Price")]
        public decimal BasePrice { get; set; }
    }
}
