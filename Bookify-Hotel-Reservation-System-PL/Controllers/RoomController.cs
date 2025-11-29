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
        public IActionResult Index(string SearchText,string roomType,string guests,string Price)
        {
            var rooms = _roomRepository.GetAllWithAmenitiesAndRoomType();

            ViewBag.RoomTypeName = rooms
                    .Where(r => r.RoomType != null)
                    .Select(r => r.RoomType.Name)
                    .Distinct()
                    .ToList();

            // Filter by search text (RoomType name or description)
            if (!string.IsNullOrEmpty(SearchText))
            {
                rooms = rooms.Where(r =>
                    (r.RoomType != null && r.RoomType.Name.Contains(SearchText, StringComparison.OrdinalIgnoreCase)) ||
                    (r.RoomType != null && r.RoomType.Description.Contains(SearchText, StringComparison.OrdinalIgnoreCase))
                ).ToList();
            }

            // Filter by RoomType (string can be the name or you can pass ID)
            if (!string.IsNullOrEmpty(roomType))
            {
                rooms = rooms.Where(r => r.RoomType != null && r.RoomType.Name == roomType).ToList();
            }

            // Filter by Guests
            if (!string.IsNullOrEmpty(guests) && int.TryParse(guests, out int guestCount))
            {
                rooms = rooms.Where(r => r.RoomType != null && r.RoomType.Guests >= guestCount).ToList();
            }

            // Filter by Price
            if (!string.IsNullOrEmpty(Price))
            {
                // Assuming Price comes as "100-200"
                var prices = Price.Split('-');
                if (prices.Length == 2 &&
                    decimal.TryParse(prices[0], out var minPrice) &&
                    decimal.TryParse(prices[1], out var maxPrice))
                {
                    rooms = rooms.Where(r => r.RoomType != null && r.RoomType.BasePrice >= minPrice && r.RoomType.BasePrice <= maxPrice).ToList();
                }
            }
            ViewData["SearchText"] = SearchText;
            ViewData["RoomType"] = roomType;
            ViewData["Guests"] = guests;
            

            List<RoomDetailsViewModel> roomDetailsViewModel = new List<RoomDetailsViewModel>();
            
            foreach (var item in rooms)
            {
                roomDetailsViewModel.Add(new RoomDetailsViewModel
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
                });
            }     
            return View(roomDetailsViewModel);
        }

        public IActionResult Details(int id)
        {
            var room = _roomRepository.GetAllWithAmenitiesAndRoomType()
                .FirstOrDefault(r => r.Id == id);
            RoomDetailsViewModel roomDetailsViewModel = 
            new RoomDetailsViewModel
            {
                RoomId = room.Id,
                Floor = room.Floor,
                ImageUrl = room.ImageUrl,
                RoomTypeName = room.RoomType.Name,
                RoomDescription = room.RoomType.Description,
                Area = room.RoomType.Area,
                Guests = room.RoomType.Guests,
                BasePrice = room.RoomType.BasePrice,
                Amenities = room.RoomAmenities.Select(ra => ra.Amenity).ToList()
            };

            return View("Details", roomDetailsViewModel);

        }
    }
}
