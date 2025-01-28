

namespace FlowOps.DataLayer.Repositories;

public interface IBaseRepository<T>
{
    Task<T> CreateAsync(T entity);
    Task<T> GetByIdAsync(string id);
}