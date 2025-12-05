using Bookify_Hotel_Reservation_System__DAL.Contexts;
using Bookify_Hotel_Reservation_System__DAL.Models;
using Bookify_Hotel_Reservation_System_BLL.Interfaces;

namespace Bookify_Hotel_Reservation_System_BLL.Repositories;

public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
{
    public PaymentRepository(BookifyDbContext context) : base(context)
    {
    }

    public Payment? GetByBookingId(int bookingId)
    {
        return _context.Payments.FirstOrDefault(p => p.Booking.Id == bookingId);
    }
}
