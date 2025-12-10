using Bookify_Hotel_Reservation_System__DAL.Models;
using Bookify_Hotel_Reservation_System_BLL.Interfaces;
using Bookify_Hotel_Reservation_System_PL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;

namespace Bookify_Hotel_Reservation_System_PL.Controllers
{
    public class ContactController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;

        public ContactController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        public async Task<IActionResult> SubmitReview(ReviewViewModel model)
        {
            if (!ModelState.IsValid)
            {
                TempData["Error"] = "Please fill in all required fields correctly.";
                return RedirectToAction(nameof(Index));
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                TempData["Error"] = "You must be logged in to submit a review.";
                return RedirectToAction("Login", "Account", new { returnUrl = "/Contact" });
            }

            var review = new Review
            {
                Rate = model.Rate,
                Description = model.Description,
                UserId = userId,
                CreatedAt = DateTime.Now
            };

            _unitOfWork.Reviews.Add(review);
            _unitOfWork.Complete();

            TempData["Success"] = "Thank you for your review! It has been submitted successfully.";
            return RedirectToAction(nameof(Index));
        }
    }
}
