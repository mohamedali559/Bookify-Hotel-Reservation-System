using Bookify_Hotel_Reservation_System__DAL.Contexts;
using Bookify_Hotel_Reservation_System__DAL.Models;
using Bookify_Hotel_Reservation_System_BLL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Bookify_Hotel_Reservation_System_BLL.Repositories;

public class RoomRepository : GenericRepository<Room>, IRoomRepository
{
    public RoomRepository(BookifyDbContext context) : base(context)
    {
    }

    public IEnumerable<Room> GetAllWithAmenitiesAndRoomType()
    {
        return _context.Rooms
            .Include(r => r.RoomType)
            .Include(r => r.RoomAmenities)
            .ThenInclude(ra => ra.Amenity)
            .ToList();
    }

    public Room? GetByIdWithAmenitiesAndRoomType(int id)
    {
        return _context.Rooms
            .Include(r => r.RoomType)
            .Include(r => r.RoomAmenities)
            .ThenInclude(ra => ra.Amenity)
            .FirstOrDefault(r => r.Id == id);
    }

    public Room GetAllWithAmenitiesAndRoomTypeById(int id)
    {
        return _context.Rooms
            .Include(r => r.RoomType)
            .Include(r => r.RoomAmenities)
            .ThenInclude(ra => ra.Amenity)
            .FirstOrDefault(r => r.Id == id);
    }
}
