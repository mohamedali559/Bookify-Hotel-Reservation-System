using Bookify_Hotel_Reservation_System__DAL.Contexts;
using Bookify_Hotel_Reservation_System__DAL.Models;
using Bookify_Hotel_Reservation_System_BLL.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookify_Hotel_Reservation_System_BLL.Repositories
{

    public class BookingRepository : IBookingRepository
    {
        private readonly BookifyDbContext _Context;

        public BookingRepository(BookifyDbContext context)
        {
            _Context = context;
        }

        public Booking Add(Booking booking)
        {
            _Context.Bookings.Add(booking);
            return booking;
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
            var bookings = _Context.Bookings
                      .Include(b => b.Room)
                      .Include(b => b.User)
                      .ToList();
            return _Context.Bookings.ToList();
        }

        public Booking Update(Booking booking)
        {
            _Context.Bookings.Update(booking);
            return booking;
        }
    }
}
