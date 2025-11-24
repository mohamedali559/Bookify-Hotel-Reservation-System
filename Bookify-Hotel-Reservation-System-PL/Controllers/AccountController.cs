//using Bookify_Hotel_Reservation_System__DAL.Models;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc;

//namespace Bookify_Hotel_Reservation_System_PL.Controllers
//{
//    public class AccountController : Controller
//    {
//        // create row in database
//        private readonly UserManager<ApplicationUser> userManager;

//        // create Cookie
//        private readonly SignInManager<ApplicationUser> signInManager;

//        // inject from Identity Service
//        public AccountController
//            (UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
//        {
//            this.signInManager = signInManager;
//            this.userManager = userManager;
//        }
//        public IActionResult Index()
//        {
//            return View();
//        }
//    }
//}
