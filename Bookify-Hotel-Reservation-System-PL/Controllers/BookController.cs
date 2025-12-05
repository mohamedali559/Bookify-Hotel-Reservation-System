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
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;

        public BookController(
            IUnitOfWork unitOfWork,
            UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
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

                if (model.CheckInDate < DateTime.Today)
                {
                    return Json(new { success = false, message = "Check-in date cannot be in the past" });
                }

                if (model.CheckOutDate <= model.CheckInDate)
                {
                    return Json(new { success = false, message = "Check-out date must be after check-in date" });
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                
                if (string.IsNullOrEmpty(userId))
                {
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

                var room = _unitOfWork.Rooms.GetByIdWithAmenitiesAndRoomType(model.RoomId);
                if (room == null)
                {
                    return Json(new { success = false, message = "Room not found" });
                }

                if (room.RoomType == null)
                {
                    return Json(new { success = false, message = "Room type information not available" });
                }

                var existingBookings = _unitOfWork.Bookings.GetAll()
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

                var nights = (model.CheckOutDate - model.CheckInDate).Days;
                var totalPrice = nights * room.RoomType.BasePrice;

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

                _unitOfWork.Bookings.Add(booking);
                _unitOfWork.Complete();

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

            var bookings = _unitOfWork.Bookings.GetAllWithRoomsAndUser()
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
            var booking = _unitOfWork.Bookings.Get(id);

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
            _unitOfWork.Bookings.Update(booking);
            _unitOfWork.Complete();

            return Json(new { success = true, message = "Booking cancelled successfully" });
        }
    }
}
