using Bookify_Hotel_Reservation_System__DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookify_Hotel_Reservation_System_BLL.Interfaces
{
    public interface IAmenityRepository
    {
        IEnumerable<Amenity> GetAll();
        //IEnumerable<Amenity> GetAllWithRoomsAndUser();

        void Add(Amenity amenity);

        Amenity? Get(int id);

        Amenity Update(Amenity amenity);

        bool Delete(int id);

        public void Save();
        
    }
}
