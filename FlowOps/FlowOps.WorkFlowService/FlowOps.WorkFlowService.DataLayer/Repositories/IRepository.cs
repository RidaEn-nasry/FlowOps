using System.Linq.Expressions;
using FlowOps.WorkFlowService.DataLayer.Domain;

namespace FlowOps.WorkFlowService.DataLayer.Repositories;

public interface IRepository<T> where T : BaseEntity
{
        Task<T> GetById(Guid id);
        Task<IEnumerable<T>> GetAll();
        Task<T> Add(T entity);
        Task<T> Update(T entity);
        Task Delete(Guid id);
        Task<IEnumerable<T>> Find(Expression<Func<T, bool>> predicate);
}