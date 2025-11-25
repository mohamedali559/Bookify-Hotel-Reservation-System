using Microsoft.AspNetCore.Mvc;
using Bookify_Hotel_Reservation_System_BLL.Interfaces;

namespace Bookify_Hotel_Reservation_System_PL.Controllers
{
    public class RoomController : Controller
    {
        private readonly IRoomRepository _roomRepository;
        public RoomController(IRoomRepository roomRepository)
        {
            _roomRepository = roomRepository;
        }
        public IActionResult Room_Index()
        {
            var rooms = _roomRepository.GetAll();
            return View(rooms);
        }
    }
}
