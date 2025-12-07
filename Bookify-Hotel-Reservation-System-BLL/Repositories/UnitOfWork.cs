using Bookify_Hotel_Reservation_System__DAL.Contexts;
using Bookify_Hotel_Reservation_System_BLL.Interfaces;

namespace Bookify_Hotel_Reservation_System_BLL.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly BookifyDbContext _context;

    public IRoomRepository Rooms { get; private set; }
    public IRoomTypeRepository RoomTypes { get; private set; }
    public IAmenityRepository Amenities { get; private set; }
    public IBookingRepository Bookings { get; private set; }
    public IReviewRepository Reviews { get; private set; }
    public IPaymentRepository Payments { get; private set; }

    public UnitOfWork(BookifyDbContext context)
    {
        _context = context;
        
        Rooms = new RoomRepository(_context);
        RoomTypes = new RoomTypeRepository(_context);
        Amenities = new AmenityRepository(_context);
        Bookings = new BookingRepository(_context);
        Reviews = new ReviewRepository(_context);
        Payments = new PaymentRepository(_context);
    }

    public int Complete()
    {
        return _context.SaveChanges();
    }

    public async Task<int> CompleteAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
