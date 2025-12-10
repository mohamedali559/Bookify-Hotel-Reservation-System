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
        private readonly UserManager<ApplicationUser> userManager;

        public AdminController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            this.userManager = userManager;
        }

        // Dashboard
        public IActionResult Index()
        {
            // Get statistics for dashboard cards
            var booking = _unitOfWork.Bookings.GetAll();
            
            var viewModel = new DashboardViewModel
            {
                TotalBookings = booking.Count(),
                TotalRevenue = booking.Sum(b => b.Price),
                TotalRooms = booking.Count(),
                TotalRoomTypes = _unitOfWork.RoomTypes.GetAll().Count()
            };

            return View(viewModel);
        }

        // Rooms Management
        public IActionResult Rooms()
        {
            var viewModel = new AdminRoomsViewModel
            {
                Rooms = _unitOfWork.Rooms.GetAllWithAmenitiesAndRoomType(),
                RoomTypes = _unitOfWork.RoomTypes.GetAll(),
                RoomForm = new RoomViewModel()
            };
            return View(viewModel);
        }

        // Add Room - GET
        [HttpGet]
        public IActionResult AddRoom()
        {
            var viewModel = new RoomFormViewModel
            {
                RoomTypes = _unitOfWork.RoomTypes.GetAll(),
                RoomForm = new RoomViewModel()
            };
            return View(viewModel);
        }

        // Add Room - POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult AddRoom(RoomFormViewModel viewModel)
        {
            // Ensure RoomForm is not null
            if (viewModel?.RoomForm == null)
            {
                ModelState.AddModelError("", "Invalid form data. Please try again.");
                viewModel = new RoomFormViewModel
                {
                    RoomTypes = _unitOfWork.RoomTypes.GetAll(),
                    RoomForm = new RoomViewModel()
                };
                TempData["Error"] = "Invalid form submission. Please fill all required fields.";
                return View(viewModel);
            }

            if (!ModelState.IsValid)
            {
                // Always reload RoomTypes before returning view
                viewModel.RoomTypes = _unitOfWork.RoomTypes.GetAll();
                
                // Get all validation errors for debugging
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                
                TempData["Error"] = $"Please correct the errors: {string.Join(", ", errors)}";
                return View(viewModel);
            }

            var room = new Room
            {
                RoomNumber = viewModel.RoomForm.RoomNumber,
                Floor = viewModel.RoomForm.Floor,
                RoomTypeId = viewModel.RoomForm.RoomTypeId,
                IsAvailable = viewModel.RoomForm.IsAvailable,
                ImageUrl = viewModel.RoomForm.ImageUrl
            };

            _unitOfWork.Rooms.Add(room);
            _unitOfWork.Complete();

            TempData["Success"] = "Room added successfully!";
            return RedirectToAction(nameof(Rooms));
        }

        // Edit Room - GET
        [HttpGet]
        public IActionResult EditRoom(int id)
        {
            var room = _unitOfWork.Rooms.Get(id);
            if (room == null)
            {
                TempData["Error"] = "Room not found.";
                return RedirectToAction(nameof(Rooms));
            }

            var model = new RoomViewModel
            {
                Id = room.Id,
                RoomNumber = room.RoomNumber,
                Floor = room.Floor,
                RoomTypeId = room.RoomTypeId,
                IsAvailable = room.IsAvailable,
                ImageUrl = room.ImageUrl
            };

            var viewModel = new RoomFormViewModel
            {
                RoomTypes = _unitOfWork.RoomTypes.GetAll(),
                RoomForm = model
            };

            return View(viewModel);
        }

        // Edit Room - POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult EditRoom(RoomFormViewModel viewModel)
        {
            // Ensure RoomForm is not null
            if (viewModel?.RoomForm == null)
            {
                TempData["Error"] = "Invalid form data. Please try again.";
                return RedirectToAction(nameof(Rooms));
            }

            if (!ModelState.IsValid)
            {
                // Always reload RoomTypes before returning view
                viewModel.RoomTypes = _unitOfWork.RoomTypes.GetAll();
                
                // Get all validation errors for debugging
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                
                TempData["Error"] = $"Please correct the errors: {string.Join(", ", errors)}";
                return View(viewModel);
            }

            var room = _unitOfWork.Rooms.Get(viewModel.RoomForm.Id);
            if (room == null)
            {
                TempData["Error"] = "Room not found.";
                return RedirectToAction(nameof(Rooms));
            }

            room.RoomNumber = viewModel.RoomForm.RoomNumber;
            room.Floor = viewModel.RoomForm.Floor;
            room.RoomTypeId = viewModel.RoomForm.RoomTypeId;
            room.IsAvailable = viewModel.RoomForm.IsAvailable;
            room.ImageUrl = viewModel.RoomForm.ImageUrl;

            _unitOfWork.Rooms.Update(room);
            _unitOfWork.Complete();

            TempData["Success"] = "Room updated successfully!";
            return RedirectToAction(nameof(Rooms));
        }

        // Delete Room - POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteRoom(int id)
        {
            var room = _unitOfWork.Rooms.Get(id);
            if (room == null)
            {
                TempData["Error"] = "Room not found.";
                return RedirectToAction(nameof(Rooms));
            }

            _unitOfWork.Rooms.Delete(id);
            _unitOfWork.Complete();

            TempData["Success"] = "Room deleted successfully!";
            return RedirectToAction(nameof(Rooms));
        }

        // Room Types Management
        public IActionResult RoomTypes()
        {
            var viewModel = new AdminRoomTypesViewModel
            {
                RoomTypes = _unitOfWork.RoomTypes.GetAll(),
                RoomTypeForm = new RoomTypeViewModel()
            };
            return View(viewModel);
        }

        // Add Room Type - GET
        [HttpGet]
        public IActionResult AddRoomType()
        {
            var viewModel = new RoomTypeFormViewModel
            {
                RoomTypeForm = new RoomTypeViewModel()
            };
            return View(viewModel);
        }

        // Add Room Type - POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult AddRoomType(RoomTypeFormViewModel viewModel)
        {
            // Ensure RoomTypeForm is not null
            if (viewModel?.RoomTypeForm == null)
            {
                ModelState.AddModelError("", "Invalid form data. Please try again.");
                viewModel = new RoomTypeFormViewModel
                {
                    RoomTypeForm = new RoomTypeViewModel()
                };
                TempData["Error"] = "Invalid form submission. Please fill all required fields.";
                return View(viewModel);
            }

            if (!ModelState.IsValid)
            {
                // Get all validation errors for debugging
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                
                TempData["Error"] = $"Please correct the errors: {string.Join(", ", errors)}";
                return View(viewModel);
            }

            var roomType = new RoomType
            {
                Name = viewModel.RoomTypeForm.Name,
                Description = viewModel.RoomTypeForm.Description,
                Area = viewModel.RoomTypeForm.Area,
                Guests = viewModel.RoomTypeForm.Guests,
                BasePrice = viewModel.RoomTypeForm.BasePrice
            };

            _unitOfWork.RoomTypes.Add(roomType);
            _unitOfWork.Complete();

            TempData["Success"] = "Room Type added successfully!";
            return RedirectToAction(nameof(RoomTypes));
        }

        // Edit Room Type - GET
        [HttpGet]
        public IActionResult EditRoomType(int id)
        {
            var roomType = _unitOfWork.RoomTypes.Get(id);
            if (roomType == null)
            {
                TempData["Error"] = "Room Type not found.";
                return RedirectToAction(nameof(RoomTypes));
            }

            var model = new RoomTypeViewModel
            {
                Id = roomType.Id,
                Name = roomType.Name,
                Description = roomType.Description,
                Area = roomType.Area,
                Guests = roomType.Guests,
                BasePrice = roomType.BasePrice
            };

            var viewModel = new RoomTypeFormViewModel
            {
                RoomTypeForm = model
            };

            return View(viewModel);
        }

        // Edit Room Type - POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult EditRoomType(RoomTypeFormViewModel viewModel)
        {
            // Ensure RoomTypeForm is not null
            if (viewModel?.RoomTypeForm == null)
            {
                TempData["Error"] = "Invalid form data. Please try again.";
                return RedirectToAction(nameof(RoomTypes));
            }

            if (!ModelState.IsValid)
            {
                // Get all validation errors for debugging
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                
                TempData["Error"] = $"Please correct the errors: {string.Join(", ", errors)}";
                return View(viewModel);
            }

            var roomType = _unitOfWork.RoomTypes.Get(viewModel.RoomTypeForm.Id);
            if (roomType == null)
            {
                TempData["Error"] = "Room Type not found.";
                return RedirectToAction(nameof(RoomTypes));
            }

            roomType.Name = viewModel.RoomTypeForm.Name;
            roomType.Description = viewModel.RoomTypeForm.Description;
            roomType.Area = viewModel.RoomTypeForm.Area;
            roomType.Guests = viewModel.RoomTypeForm.Guests;
            roomType.BasePrice = viewModel.RoomTypeForm.BasePrice;

            _unitOfWork.RoomTypes.Update(roomType);
            _unitOfWork.Complete();

            TempData["Success"] = "Room Type updated successfully!";
            return RedirectToAction(nameof(RoomTypes));
        }

        // Delete Room Type - POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteRoomType(int id)
        {
            var roomType = _unitOfWork.RoomTypes.Get(id);
            if (roomType == null)
            {
                TempData["Error"] = "Room Type not found.";
                return RedirectToAction(nameof(RoomTypes));
            }

            _unitOfWork.RoomTypes.Delete(id);
            _unitOfWork.Complete();

            TempData["Success"] = "Room Type deleted successfully!";
            return RedirectToAction(nameof(RoomTypes));
        }

        // Bookings Management
        public IActionResult Bookings()
        {
            var bookings = _unitOfWork.Bookings.GetAllWithRoomsAndUser();
            return View(bookings);
        }

        // Cancel booking (Admin)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult CancelBooking(int id)
        {
            var booking = _unitOfWork.Bookings.Get(id);
            if (booking == null)
            {
                TempData["Error"] = "Booking not found.";
                return RedirectToAction(nameof(Bookings));
            }

            booking.Status = Bookify_Hotel_Reservation_System__DAL.Models.BookingStatus.Cancelled;
            _unitOfWork.Bookings.Update(booking);
            _unitOfWork.Complete();

            TempData["Success"] = "Booking cancelled successfully!";
            return RedirectToAction(nameof(Bookings));
        }

        // Reviews Management
        public IActionResult Reviews()
        {
            var reviews = _unitOfWork.Reviews.GetAllWithUsers();
            return View(reviews);
        }

        // Delete Review - POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteReview(int id)
        {
            var review = _unitOfWork.Reviews.Get(id);
            if (review == null)
            {
                TempData["Error"] = "Review not found.";
                return RedirectToAction(nameof(Reviews));
            }

            _unitOfWork.Reviews.Delete(id);
            _unitOfWork.Complete();

            TempData["Success"] = "Review deleted successfully!";
            return RedirectToAction(nameof(Reviews));
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
