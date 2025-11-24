using Bookify_Hotel_Reservation_System__DAL.Contexts;
using Bookify_Hotel_Reservation_System__DAL.Models;
using Bookify_Hotel_Reservation_System_BLL.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookify_Hotel_Reservation_System_BLL.Repositories
{
    public class RoomRepository : IRoomRepository
    {
        private readonly BookifyDbContext _Context;
        public RoomRepository(BookifyDbContext context)
        {
            _Context = context;
        }

        public Room Add(Room room)
        {
            _Context.Rooms.Add(room);
            return room;
        }

        public bool Delete(int id)
        {
            Room FoundedRoom = Get(id);
            if (FoundedRoom == null)
                return false;

            _Context.Rooms.Remove(FoundedRoom);
            return true;
        }

        public Room Get(int id)
        {
            return _Context.Rooms.FirstOrDefault(r => r.Id == id);
        }

        public IEnumerable<Room> GetAll()
        {
            return _Context.Rooms.ToList();
        }

        public Room Update(Room room)
        {
            _Context.Rooms.Update(room);
            return room;
        }
    }
}
