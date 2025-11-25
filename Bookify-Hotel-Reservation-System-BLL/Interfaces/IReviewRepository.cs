using Bookify_Hotel_Reservation_System__DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookify_Hotel_Reservation_System_BLL.Interfaces
{
    public interface IReviewRepository
    {
        IEnumerable<Review> GetAll();
        public IEnumerable<Review> GetAllWithUsers();
        void Add(Review review);

        Review? Get(int id);

        Review Update(Review review);

        bool Delete(int id);
        public void Save();
    }
}
