using Bookify_Hotel_Reservation_System__DAL.Models;
using Bookify_Hotel_Reservation_System_BLL.Interfaces;
using Bookify_Hotel_Reservation_System_PL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bookify_Hotel_Reservation_System_PL.Controllers
{
    [Authorize]
    public class PaymentController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public PaymentController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IActionResult Index(int bookingId)
        {
            if (bookingId <= 0)
            {
                TempData["ErrorMessage"] = "Invalid booking ID";
                return RedirectToAction("Index", "Home");
            }

            var booking = _unitOfWork.Bookings.GetAllWithRoomsAndUser()
                .FirstOrDefault(b => b.Id == bookingId);

            if (booking == null)
            {
                TempData["ErrorMessage"] = "Booking not found";
                return RedirectToAction("Index", "Home");
            }

            var nights = (booking.CheckOutDate - booking.CheckInDate).Days;

            var model = new PaymentViewModel
            {
                BookingId = booking.Id,
                Amount = booking.Price,
                GuestName = booking.User?.FullName,
                GuestEmail = booking.User?.Email,
                RoomTypeName = booking.Room?.RoomType?.Name,
                CheckInDate = booking.CheckInDate,
                CheckOutDate = booking.CheckOutDate,
                NumberOfNights = nights
            };

            return View(model);
        }

        [HttpPost]
        public IActionResult ProcessPayment([FromBody] PaymentViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    return Json(new { success = false, message = "Invalid payment data: " + string.Join(", ", errors) });
                }

                var booking = _unitOfWork.Bookings.Get(model.BookingId);
                if (booking == null)
                {
                    return Json(new { success = false, message = "Booking not found" });
                }

                var existingPayment = _unitOfWork.Payments.GetByBookingId(model.BookingId);
                if (existingPayment != null)
                {
                    return Json(new { success = false, message = "Payment already processed for this booking" });
                }

                if (model.Amount != booking.Price)
                {
                    return Json(new { success = false, message = $"Payment amount (${model.Amount}) does not match booking price (${booking.Price})" });
                }

                var transactionId = $"TXN-{DateTime.Now:yyyyMMddHHmmss}-{booking.Id}";

                var payment = new Payment
                {
                    Amount = model.Amount,
                    PaymentDate = DateTime.Now,
                    PaymentMethod = model.PaymentMethod,
                    TransactionId = transactionId,
                    Status = "Completed",
                    Booking = booking
                };

                _unitOfWork.Payments.Add(payment);
                
                booking.Status = BookingStatus.Confirmed;
                _unitOfWork.Bookings.Update(booking);
                
                _unitOfWork.Complete();

                return Json(new
                {
                    success = true,
                    message = "Payment processed successfully",
                    paymentId = payment.Id,
                    transactionId = payment.TransactionId,
                    bookingStatus = booking.Status.ToString()
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Payment Error: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }

                return Json(new
                {
                    success = false,
                    message = "Error processing payment: " + ex.Message,
                    details = ex.InnerException?.Message
                });
            }
        }

        [HttpGet]
        public IActionResult GetPaymentDetails(int bookingId)
        {
            try
            {
                var booking = _unitOfWork.Bookings.GetAllWithRoomsAndUser()
                    .FirstOrDefault(b => b.Id == bookingId);

                if (booking == null)
                {
                    return Json(new { success = false, message = "Booking not found" });
                }

                var nights = (booking.CheckOutDate - booking.CheckInDate).Days;

                return Json(new
                {
                    success = true,
                    booking = new
                    {
                        bookingId = booking.Id,
                        roomTypeName = booking.Room?.RoomType?.Name,
                        roomDescription = booking.Room?.RoomType?.Description,
                        checkInDate = booking.CheckInDate.ToString("yyyy-MM-dd"),
                        checkOutDate = booking.CheckOutDate.ToString("yyyy-MM-dd"),
                        numberOfNights = nights,
                        pricePerNight = booking.Room?.RoomType?.BasePrice,
                        totalPrice = booking.Price,
                        userName = booking.User?.UserName,
                        userEmail = booking.User?.Email,
                        status = booking.Status.ToString()
                    }
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public IActionResult Success(int paymentId)
        {
            var payment = _unitOfWork.Payments.Get(paymentId);
            if (payment == null)
            {
                return RedirectToAction("Index", "Home");
            }

            return View(payment);
        }
    }
}
