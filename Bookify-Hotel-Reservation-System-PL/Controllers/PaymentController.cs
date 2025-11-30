using Bookify_Hotel_Reservation_System__DAL.Models;
using Bookify_Hotel_Reservation_System_BLL.Interfaces;
using Bookify_Hotel_Reservation_System_PL.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookify_Hotel_Reservation_System_PL.Controllers
{
    public class PaymentController : Controller
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IBookingRepository _bookingRepository;

        public PaymentController(
            IPaymentRepository paymentRepository,
            IBookingRepository bookingRepository)
        {
            _paymentRepository = paymentRepository;
            _bookingRepository = bookingRepository;
        }

        public IActionResult Index()
        {
            return View();
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

                // Get the booking
                var booking = _bookingRepository.Get(model.BookingId);
                if (booking == null)
                {
                    return Json(new { success = false, message = "Booking not found" });
                }

                // Check if payment already exists for this booking
                var existingPayment = _paymentRepository.GetByBookingId(model.BookingId);
                if (existingPayment != null)
                {
                    return Json(new { success = false, message = "Payment already processed for this booking" });
                }

                // Validate amount matches booking price
                if (model.Amount != booking.Price)
                {
                    return Json(new { success = false, message = $"Payment amount (${model.Amount}) does not match booking price (${booking.Price})" });
                }

                // Generate transaction ID
                var transactionId = $"TXN-{DateTime.Now:yyyyMMddHHmmss}-{booking.Id}";

                // Create payment record
                var payment = new Payment
                {
                    Amount = model.Amount,
                    PaymentDate = DateTime.Now,
                    PaymentMethod = model.PaymentMethod,
                    TransactionId = transactionId,
                    Status = "Completed",
                    Booking = booking
                };

                // Save payment
                _paymentRepository.Add(payment);
                _paymentRepository.Save();

                // Update booking status to Confirmed
                booking.Status = BookingStatus.Confirmed;
                _bookingRepository.Update(booking);
                _bookingRepository.Save();

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
                var booking = _bookingRepository.GetAllWithRoomsAndUser()
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
            var payment = _paymentRepository.Get(paymentId);
            if (payment == null)
            {
                return RedirectToAction("Index", "Home");
            }

            return View(payment);
        }
    }
}
