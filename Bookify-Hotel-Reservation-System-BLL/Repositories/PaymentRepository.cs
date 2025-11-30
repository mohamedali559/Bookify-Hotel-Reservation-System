using Bookify_Hotel_Reservation_System__DAL.Contexts;
using Bookify_Hotel_Reservation_System__DAL.Models;
using Bookify_Hotel_Reservation_System_BLL.Interfaces;

namespace Bookify_Hotel_Reservation_System_BLL.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly BookifyDbContext _context;

        public PaymentRepository(BookifyDbContext context)
        {
            _context = context;
        }

        public void Add(Payment payment)
        {
            _context.Payments.Add(payment);
        }

        public bool Delete(int id)
        {
            var payment = Get(id);
            if (payment == null)
                return false;

            _context.Payments.Remove(payment);
            return true;
        }

        public Payment? Get(int id)
        {
            return _context.Payments.FirstOrDefault(p => p.Id == id);
        }

        public IEnumerable<Payment> GetAll()
        {
            return _context.Payments.ToList();
        }

        public Payment? GetByBookingId(int bookingId)
        {
            return _context.Payments.FirstOrDefault(p => p.Booking.Id == bookingId);
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public Payment Update(Payment payment)
        {
            _context.Payments.Update(payment);
            return payment;
        }
    }
}
