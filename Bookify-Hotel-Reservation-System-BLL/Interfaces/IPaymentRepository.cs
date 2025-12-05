using Bookify_Hotel_Reservation_System__DAL.Models;

namespace Bookify_Hotel_Reservation_System_BLL.Interfaces;

public interface IPaymentRepository : IGenericRepository<Payment>
{
    Payment? GetByBookingId(int bookingId);
}
