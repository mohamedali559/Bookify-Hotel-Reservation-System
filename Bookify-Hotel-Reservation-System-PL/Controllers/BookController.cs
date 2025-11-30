using Bookify_Hotel_Reservation_System__DAL.Models;
using Bookify_Hotel_Reservation_System_BLL.Interfaces;
using Bookify_Hotel_Reservation_System_PL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Bookify_Hotel_Reservation_System_PL.Controllers
{
    public class BookController : Controller
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IRoomRepository _roomRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public BookController(
            IBookingRepository bookingRepository,
            IRoomRepository roomRepository,
            UserManager<ApplicationUser> userManager)
        {
            _bookingRepository = bookingRepository;
            _roomRepository = roomRepository;
            _userManager = userManager;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] BookingViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    return Json(new { success = false, message = "Invalid booking data: " + string.Join(", ", errors) });
                }

                // Validate dates
                if (model.CheckInDate < DateTime.Today)
                {
                    return Json(new { success = false, message = "Check-in date cannot be in the past" });
                }

                if (model.CheckOutDate <= model.CheckInDate)
                {
                    return Json(new { success = false, message = "Check-out date must be after check-in date" });
                }

                // Get current user (if logged in)
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                
                // For testing: use a default user if not logged in
                if (string.IsNullOrEmpty(userId))
                {
                    // Try to get any user from database for testing
                    var defaultUser = await _userManager.Users.FirstOrDefaultAsync();
                    if (defaultUser != null)
                    {
                        userId = defaultUser.Id;
                    }
                    else
                    {
                        return Json(new { success = false, message = "No users found in database. Please register first." });
                    }
                }

                // Verify room exists and get room with RoomType
                var room = _roomRepository.GetByIdWithAmenitiesAndRoomType(model.RoomId);
                if (room == null)
                {
                    return Json(new { success = false, message = "Room not found" });
                }

                if (room.RoomType == null)
                {
                    return Json(new { success = false, message = "Room type information not available" });
                }

                // Check if room is available for the selected dates
                var existingBookings = _bookingRepository.GetAll()
                    .Where(b => b.RoomId == model.RoomId &&
                               b.Status != BookingStatus.Cancelled &&
                               ((b.CheckInDate <= model.CheckInDate && b.CheckOutDate > model.CheckInDate) ||
                                (b.CheckInDate < model.CheckOutDate && b.CheckOutDate >= model.CheckOutDate) ||
                                (b.CheckInDate >= model.CheckInDate && b.CheckOutDate <= model.CheckOutDate)))
                    .ToList();

                if (existingBookings.Any())
                {
                    return Json(new { success = false, message = "Room is not available for the selected dates" });
                }

                // Calculate nights and total price from RoomType.BasePrice
                var nights = (model.CheckOutDate - model.CheckInDate).Days;
                var totalPrice = nights * room.RoomType.BasePrice;

                // Create booking
                var booking = new Booking
                {
                    RoomId = model.RoomId,
                    UserId = userId,
                    CheckInDate = model.CheckInDate,
                    CheckOutDate = model.CheckOutDate,
                    Price = totalPrice,
                    Status = BookingStatus.Pending,
                    CreatedAt = DateTime.Now
                };

                _bookingRepository.Add(booking);
                _bookingRepository.Save();

                return Json(new
                {
                    success = true,
                    message = "Booking created successfully",
                    bookingId = booking.Id,
                    totalPrice = totalPrice,
                    nights = nights
                });
            }
            catch (Exception ex)
            {
                // Log the detailed error for debugging
                Console.WriteLine($"Booking Error: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                
                return Json(new { 
                    success = false, 
                    message = "Error creating booking: " + ex.Message,
                    details = ex.InnerException?.Message 
                });
            }
        }

        [HttpGet]
        [Authorize]
        public IActionResult MyBookings()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return RedirectToAction("Login", "Account");
            }

            var bookings = _bookingRepository.GetAllWithRoomsAndUser()
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.CreatedAt)
                .ToList();

            return View(bookings);
        }

        [HttpPost]
        [Authorize]
        public IActionResult CancelBooking(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var booking = _bookingRepository.Get(id);

            if (booking == null)
            {
                return Json(new { success = false, message = "Booking not found" });
            }

            if (booking.UserId != userId)
            {
                return Json(new { success = false, message = "Unauthorized" });
            }

            if (booking.Status == BookingStatus.Completed || booking.Status == BookingStatus.Cancelled)
            {
                return Json(new { success = false, message = "Cannot cancel this booking" });
            }

            booking.Status = BookingStatus.Cancelled;
            _bookingRepository.Update(booking);
            _bookingRepository.Save();

            return Json(new { success = true, message = "Booking cancelled successfully" });
        }
    }
}
