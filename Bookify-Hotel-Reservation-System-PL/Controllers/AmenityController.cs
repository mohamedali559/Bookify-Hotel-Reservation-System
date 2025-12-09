using Bookify_Hotel_Reservation_System__DAL.Models;
using Bookify_Hotel_Reservation_System_BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bookify_Hotel_Reservation_System_PL.Controllers
{
    public class AmenityController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public AmenityController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IActionResult Index()
        {
            var Amenities = _unitOfWork.Amenities.GetAll();
            return View("Index", Amenities);
        }

        [Authorize(Roles = "Admin")]
        public IActionResult Add()
        {
            return View("Add");
        }

        [Authorize(Roles = "Admin")]
        public IActionResult SaveAdd(Amenity amenity)
        {
            if (amenity.Name != null && amenity.Description != null)
            {
                _unitOfWork.Amenities.Add(amenity);
                _unitOfWork.Complete();
                return RedirectToAction("Index");
            }

            return View("Add", amenity);
        }
    }
}
