

namespace Bookify_Hotel_Reservation_System_BLL.Repositories
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly BookifyDbContext _Context;

        public ReviewRepository(BookifyDbContext context)
        {
            _Context = context;
        }
        public void Add(Review review)
        {
            _Context.Add(review);
        }

        public bool Delete(int id)
        {
            Review review = Get(id);
            if (review != null)
            {
                return false;
            }
            _Context.Remove(review);
            return true;
        }

        public Review? Get(int id)
        {
            return _Context.Reviews.FirstOrDefault(a => a.Id == id);

        }

        public IEnumerable<Review> GetAll()
        {
            return _Context.Reviews.ToList();
        }
        public IEnumerable<Review> GetAllWithUsers()
        {
            return _Context.Reviews.Include(r=>r.User).ToList();
        }


        public Review Update(Review review)
        {
            _Context.Update(review);
            return review;
        }
        public void Save()
        {
            _Context.SaveChanges();
        }
    }
}
