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
        public IActionResult Index()
        {
            var rooms = _roomRepository.GetAllWithAmenitiesAndRoomType();
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
        //public IActionResult RoomCard()
        //{

        //}
    }
}
