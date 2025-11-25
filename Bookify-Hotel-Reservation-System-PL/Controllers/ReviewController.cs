using Bookify_Hotel_Reservation_System_BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Bookify_Hotel_Reservation_System_PL.Controllers
{
    public class ReviewController : Controller
    {
        private readonly IReviewRepository reviewRepository;
        public ReviewController(IReviewRepository reviewRepository)
        {
            this.reviewRepository = reviewRepository;
        }
        public IActionResult Index()
        {
            var reviews = reviewRepository.GetAllWithUsers();
            return View("index", reviews);
        }
    }
}
