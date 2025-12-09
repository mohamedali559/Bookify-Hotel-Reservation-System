using Bookify_Hotel_Reservation_System__DAL.Contexts;
using Bookify_Hotel_Reservation_System__DAL.Models;
using Bookify_Hotel_Reservation_System_BLL.Interfaces;
using Bookify_Hotel_Reservation_System_PL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace Bookify_Hotel_Reservation_System_PL.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly BookifyDbContext _context;
        private readonly UserManager<ApplicationUser> userManager;

        public AdminController(IUnitOfWork unitOfWork, BookifyDbContext context, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _context = context;
            this.userManager = userManager;

        }

        // Dashboard
        public IActionResult Index()
        {
            // Get statistics for dashboard cards
            var booking = _unitOfWork.Bookings.GetAll();
            var totalBookings = booking.Count();
            var totalRevenue = booking.Sum(b => b.Price);
            var totalRooms = booking.Count();
            var totalRoomTypes = _context.RoomTypes.Count();

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

        [HttpGet]
        public IActionResult CreateAdmin()
        {
            return View("CreateAdmin");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateAdmin(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View("CreateAdmin", model);
            }
            ApplicationUser user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FullName = model.FullName,
                Address = model.Address,
                PhoneNumber = model.PhoneNumber
            };

            // check if the Email is Already in use
            var existingEmail = await userManager.FindByEmailAsync(user.Email);
            if(existingEmail != null)
            {
                ModelState.AddModelError("Email", "Email is Already in use");
                return View("CreateAdmin", model);
            }

            var result = await userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                // assign admin role instead of User
                await userManager.AddToRoleAsync(user, "Admin");
                return RedirectToAction("Index");
            }
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error.Description);
            }


            return View("CreateAdmin", model);
        }
    }
}
