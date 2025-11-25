using Bookify_Hotel_Reservation_System__DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookify_Hotel_Reservation_System_BLL.Interfaces
{
    public interface IBookingRepository
    {
        IEnumerable<Booking> GetAll();

        Booking Add(Booking booking);

        Booking? Get(int id);

        Booking Update(Booking booking);

        bool Delete(int id);

    }
}
