using Bookify_Hotel_Reservation_System__DAL.Contexts;
using Bookify_Hotel_Reservation_System__DAL.Models;
using Bookify_Hotel_Reservation_System_BLL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Bookify_Hotel_Reservation_System_BLL.Repositories;

public class BookingRepository : GenericRepository<Booking>, IBookingRepository
{
    public BookingRepository(BookifyDbContext context) : base(context)
    {
    }

    public IEnumerable<Booking> GetAllWithRoomsAndUser()
    {
        return _context.Bookings
            .Include(b => b.Room)
                .ThenInclude(r => r.RoomType)
            .Include(b => b.User)
            .ToList();
    }
}
