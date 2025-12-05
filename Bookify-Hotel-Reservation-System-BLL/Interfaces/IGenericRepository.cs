using System.Linq.Expressions;

namespace Bookify_Hotel_Reservation_System_BLL.Interfaces;

public interface IGenericRepository<T> where T : class
{
    IEnumerable<T> GetAll();
    T? Get(int id);
    void Add(T entity);
    T Update(T entity);
    bool Delete(int id);
    void Save();
    
    // Additional methods for queries with includes
    IEnumerable<T> Find(Expression<Func<T, bool>> predicate);
    T? FirstOrDefault(Expression<Func<T, bool>> predicate);
}
