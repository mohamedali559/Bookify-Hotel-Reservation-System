using Bookify_Hotel_Reservation_System__DAL.Contexts;
using Bookify_Hotel_Reservation_System__DAL.Models;
using Bookify_Hotel_Reservation_System_BLL.Interfaces;

namespace Bookify_Hotel_Reservation_System_BLL.Repositories;

public class RoomTypeRepository : GenericRepository<RoomType>, IRoomTypeRepository
{
    public RoomTypeRepository(BookifyDbContext context) : base(context)
    {
    }

    public IEnumerable<string> GetAllRoomTypeNames()
    {
        return _context.RoomTypes
            .Select(rt => rt.Name)
            .Distinct()
            .ToList();
    }
}
