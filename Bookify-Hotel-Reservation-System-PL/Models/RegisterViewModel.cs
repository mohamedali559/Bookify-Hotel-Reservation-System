using System.ComponentModel.DataAnnotations;

namespace Bookify_Hotel_Reservation_System_PL.Models
{
    public class RegisterViewModel
    {
        [Required(ErrorMessage = "Full Name is required")]
        [MaxLength(80, ErrorMessage = "Full Name cannot exceed 80 characters")]
        [Display(Name = "Full Name")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [DataType(DataType.Password)]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Confirm Password is required")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Password and Confirm Password do not match")]
        [Display(Name = "Confirm Password")]
        public string ConfirmPassword { get; set; }

        [MaxLength(80, ErrorMessage = "Address cannot exceed 80 characters")]
        public string? Address { get; set; }

        [Phone(ErrorMessage = "Invalid phone number")]
        [Display(Name = "Phone Number")]
        public string? PhoneNumber { get; set; }
    }
}
