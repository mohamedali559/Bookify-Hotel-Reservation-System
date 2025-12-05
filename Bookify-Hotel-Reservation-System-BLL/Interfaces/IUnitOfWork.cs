namespace Bookify_Hotel_Reservation_System_BLL.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRoomRepository Rooms { get; }
    IAmenityRepository Amenities { get; }
    IBookingRepository Bookings { get; }
    IReviewRepository Reviews { get; }
    IPaymentRepository Payments { get; }

    int Complete();
    Task<int> CompleteAsync();
}
