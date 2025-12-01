using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bookify_Hotel_Reservation_System_PL.Controllers
{
    [Authorize]
    public class ReservationController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
