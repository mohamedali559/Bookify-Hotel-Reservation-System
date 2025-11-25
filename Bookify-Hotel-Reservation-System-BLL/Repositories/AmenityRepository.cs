


namespace Bookify_Hotel_Reservation_System_BLL.Repositories
{
    public class AmenityRepository : IAmenityRepository
    {
        private readonly BookifyDbContext _Context;

        public AmenityRepository(BookifyDbContext context)
        {
            _Context = context;
        }
        public void Add(Amenity amenity)
        {
            _Context.Add(amenity);
        }

        public bool Delete(int id)
        {
            Amenity amenity = Get(id);
            if ( amenity!= null)
            {
                return false;
            }
            _Context.Remove(amenity);
            return true;
        }

        public Amenity? Get(int id)
        {
             return _Context.Amenities.FirstOrDefault(a => a.Id == id);
            
        }

        public IEnumerable<Amenity> GetAll()
        {
            return _Context.Amenities.ToList();
        }


        public Amenity Update(Amenity amenity)
        {
            _Context.Update(amenity);
            return amenity;
        }
        public void Save()
        {
            _Context.SaveChanges();
        }
    }
}
