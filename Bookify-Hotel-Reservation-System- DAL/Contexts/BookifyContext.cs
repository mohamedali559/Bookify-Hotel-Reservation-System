using Bookify_Hotel_Reservation_System__DAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookify_Hotel_Reservation_System__DAL.Contexts
{
    public class BookifyContext : DbContext
    {
        public BookifyContext(DbContextOptions<BookifyContext>options) : base(options)
        {
            
        }
        public DbSet<Room> Rooms { get; set; }
    }
}
