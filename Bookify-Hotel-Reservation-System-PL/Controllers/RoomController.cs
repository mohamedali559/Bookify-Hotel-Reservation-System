using Bookify_Hotel_Reservation_System_BLL.Interfaces;
using Bookify_Hotel_Reservation_System_PL.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Bookify_Hotel_Reservation_System_PL.Controllers
{
    /// <summary>
    /// Controller responsible for handling room-related operations
    /// including displaying room listings and individual room details
    /// </summary>
    public class RoomController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        /// <summary>
        /// Initializes a new instance of the RoomController
        /// </summary>
        /// <param name="unitOfWork">Unit of Work instance for data access operations</param>
        public RoomController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Displays the main rooms listing page with all available rooms
        /// </summary>
        /// <returns>View with list of room details</returns>
        public IActionResult Index(string? searchText, string? roomType, string? guests, string? price)
        {
            // Fetch all rooms with their related data (amenities and room type information)
            var rooms = _unitOfWork.Rooms.GetAllWithAmenitiesAndRoomType();

            // Transform entity models to view models for presentation
            var roomDetailsViewModels = rooms.Select(item => new RoomDetailsViewModel
            {
                RoomId = item.Id,
                Floor = item.Floor,
                ImageUrl = item.ImageUrl,
                // Use null-coalescing to provide default values if RoomType is null
                RoomTypeName = item.RoomType?.Name ?? string.Empty,
                RoomDescription = item.RoomType?.Description ?? string.Empty,
                Area = item.RoomType?.Area ?? 0,
                Guests = item.RoomType?.Guests ?? 0,
                BasePrice = item.RoomType?.BasePrice ?? 0,
                // Extract amenities from the many-to-many relationship
                Amenities = item.RoomAmenities.Select(ra => ra.Amenity).ToList()
            }).ToList();

            // Create the main view model with all necessary data
            var viewModel = new RoomIndexViewModel
            {
                Rooms = roomDetailsViewModels,
                RoomTypeNames = _unitOfWork.RoomTypes.GetAllRoomTypeNames().ToList(),
                MinPrice = rooms.Min(r => r.RoomType?.BasePrice ?? 0),
                MaxPrice = rooms.Max(r => r.RoomType?.BasePrice ?? 0),
                MaxGuests = rooms.Max(r => r.RoomType?.Guests ?? 1)
            };

            return View(viewModel);
        }

        /// <summary>
        /// Displays detailed information about a specific room
        /// </summary>
        /// <param name="id">The unique identifier of the room</param>
        /// <returns>View with room details or NotFound if room doesn't exist</returns>
        public IActionResult Details(int id)
        {
            // Fetch specific room with its related data (amenities and room type)
            var room = _unitOfWork.Rooms.GetByIdWithAmenitiesAndRoomType(id);

            // Return 404 Not Found if the room doesn't exist
            if (room == null)
                return NotFound();

            // Map entity to view model for presentation
            var roomDetailsViewModel = new RoomDetailsViewModel
            {
                RoomId = room.Id,
                Floor = room.Floor,
                ImageUrl = room.ImageUrl,
                // Safely access RoomType properties with null-coalescing operator
                RoomTypeName = room.RoomType?.Name ?? string.Empty,
                RoomDescription = room.RoomType?.Description ?? string.Empty,
                Area = room.RoomType?.Area ?? 0,
                Guests = room.RoomType?.Guests ?? 0,
                BasePrice = room.RoomType?.BasePrice ?? 0,
                // Get all amenities associated with this room
                Amenities = room.RoomAmenities.Select(ra => ra.Amenity).ToList()
            };

            return View(roomDetailsViewModel);
        }
    }
}
