using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Bookify_Hotel_Reservation_System__DAL.Models;

namespace Bookify_Hotel_Reservation_System_BLL.Interfaces
{
    public interface IRoomRepository
    {
        IEnumerable<Room> GetAll();
        void Add(Room room);
      
        Room? Get(int id);

        Room Update(Room room);

        bool Delete(int id);

        public void Save();
    }
}
