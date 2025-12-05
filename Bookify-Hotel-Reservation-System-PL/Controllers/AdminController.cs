using Bookify_Hotel_Reservation_System_BLL.Interfaces;
using Bookify_Hotel_Reservation_System__DAL.Contexts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace Bookify_Hotel_Reservation_System_PL.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly BookifyDbContext _context;

        public AdminController(IUnitOfWork unitOfWork, BookifyDbContext context)
        {
            _unitOfWork = unitOfWork;
            _context = context;
        }

        // Dashboard
        public IActionResult Index()
        {
            // Get statistics for dashboard cards
            var totalBookings = _unitOfWork.Bookings.GetAll().Count();
            var totalRevenue = _unitOfWork.Bookings.GetAll().Sum(b => b.Price);
            var totalRooms = _unitOfWork.Rooms.GetAll().Count();
            var totalRoomTypes = _context.RoomTypes.Count();

            ViewBag.TotalBookings = totalBookings;
            ViewBag.TotalRevenue = totalRevenue;
            ViewBag.TotalRooms = totalRooms;
            ViewBag.TotalRoomTypes = totalRoomTypes;

            return View();
        }

        // Rooms Management
        public IActionResult Rooms()
        {
            var rooms = _unitOfWork.Rooms.GetAllWithAmenitiesAndRoomType();
            return View(rooms);
        }

        // Room Types Management
        public IActionResult RoomTypes()
        {
            var roomTypes = _context.RoomTypes.ToList();
            return View(roomTypes);
        }

        // Bookings Management
        public IActionResult Bookings()
        {
            var bookings = _unitOfWork.Bookings.GetAllWithRoomsAndUser();
            return View(bookings);
        }

        // API Endpoints for CRUD operations

        // Get all rooms as JSON
        [HttpGet]
        public IActionResult GetRooms()
        {
            var rooms = _unitOfWork.Rooms.GetAllWithAmenitiesAndRoomType()
                .Select(r => new
                {
                    id = r.Id,
                    roomNumber = r.RoomNumber,
                    floor = r.Floor,
                    roomType = r.RoomType?.Name ?? "N/A",
                    basePrice = r.RoomType?.BasePrice ?? 0,
                    isAvailable = r.IsAvailable,
                    imageUrl = r.ImageUrl
                });
            return Json(rooms);
        }

        // Get all room types as JSON
        [HttpGet]
        public IActionResult GetRoomTypes()
        {
            var roomTypes = _context.RoomTypes
                .Select(rt => new
                {
                    id = rt.Id,
                    name = rt.Name,
                    description = rt.Description,
                    area = rt.Area,
                    guests = rt.Guests,
                    basePrice = rt.BasePrice
                });
            return Json(roomTypes);
        }

        // Get all bookings as JSON
        [HttpGet]
        public IActionResult GetBookings()
        {
            var bookings = _unitOfWork.Bookings.GetAllWithRoomsAndUser()
                .Select(b => new
                {
                    id = b.Id,
                    customerName = b.User?.FullName ?? "N/A",
                    roomNumber = b.Room?.RoomNumber ?? "N/A",
                    checkIn = b.CheckInDate.ToString("yyyy-MM-dd"),
                    checkOut = b.CheckOutDate.ToString("yyyy-MM-dd"),
                    price = b.Price,
                    status = b.Status.ToString(),
                    createdAt = b.CreatedAt.ToString("yyyy-MM-dd HH:mm")
                });
            return Json(bookings);
        }

        // Cancel booking (Admin)
        [HttpPost]
        public IActionResult CancelBooking([FromBody] int id)
        {
            try
            {
                var booking = _unitOfWork.Bookings.Get(id);
                if (booking == null)
                {
                    return Json(new { success = false, message = "Booking not found" });
                }

                booking.Status = Bookify_Hotel_Reservation_System__DAL.Models.BookingStatus.Cancelled;
                _unitOfWork.Bookings.Update(booking);
                _unitOfWork.Complete();

                return Json(new { success = true, message = "Booking cancelled successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
