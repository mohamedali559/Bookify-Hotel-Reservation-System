using Bookify_Hotel_Reservation_System__DAL.Contexts;
using Bookify_Hotel_Reservation_System__DAL.Models;
using Bookify_Hotel_Reservation_System_BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Bookify_Hotel_Reservation_System_PL.Controllers
{
    public class AmenityController : Controller
    {
        private readonly IAmenityRepository amenityRepository;
        public AmenityController(IAmenityRepository amenityRepository )
        {
            this.amenityRepository = amenityRepository;
        }
        public IActionResult Index()
        {
            var Amenities = amenityRepository.GetAll();
            return View("Index",Amenities);
        }
        public IActionResult Add()
        {
            return View("Add");
        }
        public IActionResult SaveAdd(Amenity amenity)
        {
            if(amenity.Name != null && amenity.Description!=null)
            {
                amenityRepository.Add(amenity);
                amenityRepository.Save();
                return RedirectToAction("Index");
            }

            return View("Add",amenity);
        }
    }
}
