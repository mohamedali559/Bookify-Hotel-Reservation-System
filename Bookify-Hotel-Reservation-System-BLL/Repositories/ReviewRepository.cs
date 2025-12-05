using Bookify_Hotel_Reservation_System__DAL.Contexts;
using Bookify_Hotel_Reservation_System__DAL.Models;
using Bookify_Hotel_Reservation_System_BLL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Bookify_Hotel_Reservation_System_BLL.Repositories;

public class ReviewRepository : GenericRepository<Review>, IReviewRepository
{
    public ReviewRepository(BookifyDbContext context) : base(context)
    {
    }

    public IEnumerable<Review> GetAllWithUsers()
    {
        return _context.Reviews
            .Include(r => r.User)
            .ToList();
    }
}
