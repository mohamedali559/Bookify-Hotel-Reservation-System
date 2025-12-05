using Microsoft.AspNetCore.Mvc;
using Bookify_Hotel_Reservation_System_BLL.Interfaces;
using Bookify_Hotel_Reservation_System_PL.Models;

namespace Bookify_Hotel_Reservation_System_PL.Controllers
{
    public class RoomController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public RoomController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IActionResult Index(string? searchText, string? roomType, string? guests, string? price)
        {
            var rooms = _unitOfWork.Rooms.GetAllWithAmenitiesAndRoomType();

            ViewBag.RoomTypeName = rooms
                    .Where(r => r.RoomType != null)
                    .Select(r => r.RoomType.Name)
                    .Distinct()
                    .ToList();

            if (!string.IsNullOrEmpty(searchText))
            {
                rooms = rooms.Where(r =>
                    (r.RoomType != null && r.RoomType.Name.Contains(searchText, StringComparison.OrdinalIgnoreCase)) ||
                    (r.RoomType != null && r.RoomType.Description.Contains(searchText, StringComparison.OrdinalIgnoreCase))
                ).ToList();
            }

            if (!string.IsNullOrEmpty(roomType))
            {
                rooms = rooms.Where(r => r.RoomType != null && r.RoomType.Name == roomType).ToList();
            }

            if (!string.IsNullOrEmpty(guests) && int.TryParse(guests, out int guestCount))
            {
                rooms = rooms.Where(r => r.RoomType != null && r.RoomType.Guests >= guestCount).ToList();
            }

            if (!string.IsNullOrEmpty(price))
            {
                var prices = price.Split('-');
                if (prices.Length == 2 &&
                    decimal.TryParse(prices[0], out var minPrice) &&
                    decimal.TryParse(prices[1], out var maxPrice))
                {
                    rooms = rooms.Where(r => r.RoomType != null && r.RoomType.BasePrice >= minPrice && r.RoomType.BasePrice <= maxPrice).ToList();
                }
            }

            ViewData["SearchText"] = searchText;
            ViewData["RoomType"] = roomType;
            ViewData["Guests"] = guests;
            ViewData["Price"] = price;

            var roomDetailsViewModel = rooms.Select(item => new RoomDetailsViewModel
            {
                RoomId = item.Id,
                Floor = item.Floor,
                ImageUrl = item.ImageUrl,
                RoomTypeName = item.RoomType?.Name ?? string.Empty,
                RoomDescription = item.RoomType?.Description ?? string.Empty,
                Area = item.RoomType?.Area ?? 0,
                Guests = item.RoomType?.Guests ?? 0,
                BasePrice = item.RoomType?.BasePrice ?? 0,
                Amenities = item.RoomAmenities.Select(ra => ra.Amenity).ToList()
            }).ToList();

            return View(roomDetailsViewModel);
        }

        [HttpGet]
        public IActionResult GetAllRooms()
        {
            var rooms = GetRoomViewModels();
            return Json(rooms);
        }

        [HttpGet]
        public IActionResult Filter(string? search, string? type, int? guests, string? price)
        {
            var rooms = GetRoomViewModels();
            var filteredRooms = ApplyFilters(rooms, search, type, guests, price);
            return Json(filteredRooms);
        }

        public IActionResult Details(int id)
        {
            var room = _unitOfWork.Rooms.GetByIdWithAmenitiesAndRoomType(id);

            if (room == null)
                return NotFound();

            var roomDetailsViewModel = new RoomDetailsViewModel
            {
                RoomId = room.Id,
                Floor = room.Floor,
                ImageUrl = room.ImageUrl,
                RoomTypeName = room.RoomType?.Name ?? string.Empty,
                RoomDescription = room.RoomType?.Description ?? string.Empty,
                Area = room.RoomType?.Area ?? 0,
                Guests = room.RoomType?.Guests ?? 0,
                BasePrice = room.RoomType?.BasePrice ?? 0,
                Amenities = room.RoomAmenities.Select(ra => ra.Amenity).ToList()
            };

            return View(roomDetailsViewModel);
        }

        private List<RoomDetailsViewModel> GetRoomViewModels()
        {
            var rooms = _unitOfWork.Rooms.GetAllWithAmenitiesAndRoomType();

            return rooms.Select(item => new RoomDetailsViewModel
            {
                RoomId = item.Id,
                Floor = item.Floor,
                ImageUrl = item.ImageUrl,
                RoomTypeName = item.RoomType?.Name ?? string.Empty,
                RoomDescription = item.RoomType?.Description ?? string.Empty,
                Area = item.RoomType?.Area ?? 0,
                Guests = item.RoomType?.Guests ?? 0,
                BasePrice = item.RoomType?.BasePrice ?? 0
            }).ToList();
        }

        private List<RoomDetailsViewModel> ApplyFilters(
            List<RoomDetailsViewModel> rooms,
            string? search,
            string? type,
            int? guests,
            string? price)
        {
            var query = rooms.AsQueryable();

            query = ApplySearchFilter(query, search);
            query = ApplyTypeFilter(query, type);
            query = ApplyGuestsFilter(query, guests);
            query = ApplyPriceFilter(query, price);

            return query.ToList();
        }

        private IQueryable<RoomDetailsViewModel> ApplySearchFilter(
            IQueryable<RoomDetailsViewModel> query,
            string? search)
        {
            if (string.IsNullOrWhiteSpace(search))
                return query;

            return query.Where(r =>
                r.RoomTypeName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                r.RoomDescription.Contains(search, StringComparison.OrdinalIgnoreCase));
        }

        private IQueryable<RoomDetailsViewModel> ApplyTypeFilter(
            IQueryable<RoomDetailsViewModel> query,
            string? type)
        {
            if (string.IsNullOrWhiteSpace(type))
                return query;

            return query.Where(r => r.RoomTypeName.Equals(type, StringComparison.OrdinalIgnoreCase));
        }

        private IQueryable<RoomDetailsViewModel> ApplyGuestsFilter(
            IQueryable<RoomDetailsViewModel> query,
            int? guests)
        {
            if (!guests.HasValue)
                return query;

            return query.Where(r => r.Guests >= guests.Value);
        }

        private IQueryable<RoomDetailsViewModel> ApplyPriceFilter(
            IQueryable<RoomDetailsViewModel> query,
            string? price)
        {
            if (string.IsNullOrWhiteSpace(price) || !price.Contains('-'))
                return query;

            var parts = price.Split('-');
            if (parts.Length != 2)
                return query;

            if (decimal.TryParse(parts[0], out var min) && decimal.TryParse(parts[1], out var max))
            {
                return query.Where(r => r.BasePrice >= min && r.BasePrice <= max);
            }

            return query;
        }
    }
}
