using Microsoft.AspNetCore.Mvc;
using Bookify_Hotel_Reservation_System_BLL.Interfaces;
using Bookify_Hotel_Reservation_System_PL.Models;

namespace Bookify_Hotel_Reservation_System_PL.Controllers
{
    public class RoomController : Controller
    {
        private readonly IRoomRepository _roomRepository;

        public RoomController(IRoomRepository roomRepository)
        {
            _roomRepository = roomRepository;
        }

        // الصفحة الرئيسية مع الفلاتر
        public IActionResult Index()
        {
            return View(); // مفيش حاجة تتبعت من البداية
        }

        [HttpGet]
        public IActionResult GetAllRooms()
        {
            var rooms = GetRoomViewModels();
            return Json(rooms); // JS هتجيبها وترندرها
        }

        // Action للفلترة على السيرفر
        [HttpGet]
        public IActionResult Filter(string? search, string? type, int? guests, string? price)
        {
            var rooms = GetRoomViewModels();
            var filteredRooms = ApplyFilters(rooms, search, type, guests, price);
            return Json(filteredRooms); // ترجع JSON للـ JS
        }

        private List<RoomDetailsViewModel> GetRoomViewModels()
        {
            var rooms = _roomRepository.GetAllWithAmenitiesAndRoomType();

            return rooms.Select(item => new RoomDetailsViewModel
            {
                RoomId = item.Id,
                Floor = item.Floor,
                ImageUrl = item.ImageUrl,
                RoomTypeName = item.RoomType.Name,
                RoomDescription = item.RoomType.Description,
                Area = item.RoomType.Area,
                Guests = item.RoomType.Guests,
                BasePrice = item.RoomType.BasePrice
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

        // تفاصيل الغرفة (يمكن تستخدمها للصفحة الفردية)
        public IActionResult RoomDetails(int id)
        {
            var item = _roomRepository.GetByIdWithAmenitiesAndRoomType(id);

            if (item == null) return NotFound();

            var model = new RoomDetailsViewModel
            {
                RoomId = item.Id,
                Floor = item.Floor,
                ImageUrl = item.ImageUrl,
                RoomTypeName = item.RoomType.Name,
                RoomDescription = item.RoomType.Description,
                Area = item.RoomType.Area,
                Guests = item.RoomType.Guests,
                BasePrice = item.RoomType.BasePrice,
                Amenities = item.RoomAmenities.Select(ra => ra.Amenity).ToList()
            };

            return View(model);
        }
    }
}
