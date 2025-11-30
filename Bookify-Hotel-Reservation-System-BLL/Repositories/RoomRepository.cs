namespace Bookify_Hotel_Reservation_System_BLL.Repositories
{
    public class RoomRepository : IRoomRepository
    {
        private readonly BookifyDbContext _Context;
        public RoomRepository(BookifyDbContext context)
        {
            _Context = context;
        }

        public void Add(Room room)
        {
            _Context.Rooms.Add(room);
        }

        public bool Delete(int id)
        {
            Room FoundedRoom = Get(id);
            if (FoundedRoom == null)
                return false;

            _Context.Rooms.Remove(FoundedRoom);
            return true;
        }

        public Room? Get(int id)
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
        
        public IEnumerable<Room> GetAllWithAmenitiesAndRoomType()
        {
            return _Context.Rooms.Include(r => r.RoomType)
                            .Include(r => r.RoomAmenities)
                            .ThenInclude(ra => ra.Amenity);
        }
<<<<<<< HEAD

        public Room? GetByIdWithAmenitiesAndRoomType(int id)
        {
            return _Context.Rooms
                .Include(r => r.RoomType)
                .Include(r => r.RoomAmenities)
                .ThenInclude(ra => ra.Amenity)
                .FirstOrDefault(r => r.Id == id);
        }

=======
        public Room GetAllWithAmenitiesAndRoomTypeById(int id)
        {
            return _Context.Rooms.Include(r => r.RoomType)
                            .Include(r => r.RoomAmenities)
                            .ThenInclude(ra => ra.Amenity).FirstOrDefault(r => r.Id == id);
        }
>>>>>>> 326d8e20421d4f00ead55a5a95ec83a2eadec5d8
        public void Save()
        {
            _Context.SaveChanges();
        }
    }
}
