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

        // The page where the user choose the checkin & checkout dates
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            // new VM to add the name & email to the form
            var model = new BookingViewModel();
            
            if (User.Identity?.IsAuthenticated == true)
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await _userManager.FindByIdAsync(userId!);
                
                if (user != null)
                {
                    model.GuestName = user.FullName;
                    model.GuestEmail = user.Email!;
                }
            }
            
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        public async Task<IActionResult> Index(BookingViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            try
            {
                if (model.CheckInDate < DateTime.Today)
                {
                    ModelState.AddModelError(nameof(model.CheckInDate), "Check-in date cannot be in the past");
                    return View(model);
                }

                if (model.CheckOutDate <= model.CheckInDate)
                {
                    ModelState.AddModelError(nameof(model.CheckOutDate), "Check-out date must be after check-in date");
                    return View(model);
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                var room = _unitOfWork.Rooms.GetByIdWithAmenitiesAndRoomType(model.RoomId);
                if (room == null)
                {
                    ModelState.AddModelError(nameof(model.RoomId), "Room not found");
                    return View(model);
                }

                if (room.RoomType == null)
                {
                    ModelState.AddModelError(nameof(model.RoomId), "Room type information not available");
                    return View(model);
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
                    ModelState.AddModelError("", "Room is not available for the selected dates");
                    return View(model);
                }

                var nights = (model.CheckOutDate - model.CheckInDate).Days;
                var totalPrice = nights * room.RoomType.BasePrice;

                var booking = new Booking
                {
                    RoomId = model.RoomId,
                    UserId = userId!,
                    CheckInDate = model.CheckInDate,
                    CheckOutDate = model.CheckOutDate,
                    Price = totalPrice,
                    Status = BookingStatus.Pending,
                    CreatedAt = DateTime.Now
                };

                _unitOfWork.Bookings.Add(booking);
                _unitOfWork.Complete();

                return RedirectToAction("Index", "Payment", new { bookingId = booking.Id });
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", $"Error creating booking: {ex.Message}");
                return View(model);
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
        public IActionResult CancelBooking([FromBody] int id)
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

            if (booking.Status == BookingStatus.Completed || booking.Status == BookingStatus.Cancelled || booking.Status == BookingStatus.Confirmed )
            {
                return Json(new { success = false, message = "Cannot cancel this booking" });
            }

            booking.Status = BookingStatus.Cancelled;
            _unitOfWork.Bookings.Update(booking);
            _unitOfWork.Complete();

            return Json(new { success = true, message = "Booking cancelled successfully" });
        }


        // this function is called by ajax to make the booked dates in red color
        [HttpGet]
        public IActionResult GetBookedDates(int roomId)
        {
            try
            {
                var bookedDates = _unitOfWork.Bookings.GetAll()
                    .Where(b => b.RoomId == roomId &&
                               b.Status != BookingStatus.Cancelled)
                    .Select(b => new
                    {
                        checkIn = b.CheckInDate.ToString("yyyy-MM-dd"),
                        checkOut = b.CheckOutDate.ToString("yyyy-MM-dd")
                    })
                    .ToList();

                return Json(new { success = true, bookedDates });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
