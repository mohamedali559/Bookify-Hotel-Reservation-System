
namespace Bookify_Hotel_Reservation_System_BLL.Repositories
{

    public class BookingRepository : IBookingRepository
    {
        private readonly BookifyDbContext _Context;

        public BookingRepository(BookifyDbContext context)
        {
            _Context = context;
        }

        public void Add(Booking booking)
        {
            _Context.Bookings.Add(booking);
        }

        public bool Delete(int id)
        {
            Booking foundedBooking = Get(id);
            if (foundedBooking == null)
                return false;

            _Context.Bookings.Remove(foundedBooking);
            return true;
        }

        public Booking? Get(int id)
        {
            return _Context.Bookings.FirstOrDefault(b => b.Id == id);
        }

        public IEnumerable<Booking> GetAll()
        {
            return _Context.Bookings.ToList();
        }

        public IEnumerable<Booking> GetAllWithRoomsAndUser()
        {
            var bookings = _Context.Bookings
                      .Include(b => b.Room)
                      .Include(b => b.User)
                      .ToList();
            return bookings;
        }

        public Booking Update(Booking booking)
        {
            _Context.Bookings.Update(booking);
            return booking;
        }
        public void Save()
        {
            _Context.SaveChanges();
        }
    }
}
