using Bookify_Hotel_Reservation_System__DAL.Models;

namespace Bookify_Hotel_Reservation_System_BLL.Interfaces;

public interface IReviewRepository : IGenericRepository<Review>
{
    IEnumerable<Review> GetAllWithUsers();
}
