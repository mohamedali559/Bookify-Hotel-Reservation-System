using Bookify_Hotel_Reservation_System__DAL.Models;

namespace Bookify_Hotel_Reservation_System_BLL.Interfaces
{
    public interface IPaymentRepository
    {
        IEnumerable<Payment> GetAll();
        Payment? Get(int id);
        Payment? GetByBookingId(int bookingId);
        void Add(Payment payment);
        Payment Update(Payment payment);
        bool Delete(int id);
        void Save();
    }
}
