using System.ComponentModel.DataAnnotations;

namespace Bookify_Hotel_Reservation_System_PL.Models
{
    public class ReviewViewModel
    {
        [Required(ErrorMessage = "Rating is required")]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public decimal Rate { get; set; }

        [Required(ErrorMessage = "Review description is required")]
        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        [MinLength(10, ErrorMessage = "Description must be at least 10 characters")]
        public string Description { get; set; }
    }
}
