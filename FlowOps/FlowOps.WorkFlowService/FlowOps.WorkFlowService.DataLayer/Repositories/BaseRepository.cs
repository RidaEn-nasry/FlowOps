using System.Linq.Expressions;
using FlowOps.WorkFlowService.DataLayer.Context;
using FlowOps.WorkFlowService.DataLayer.Domain;
using MongoDB.Driver;

namespace FlowOps.WorkFlowService.DataLayer.Repositories;

public class BaseRepository<T> : IRepository<T> where T : BaseEntity
{
    private readonly IMongoCollection<T> _collection;

    public BaseRepository(DataContext context)
    {
        _collection = context.GetCollection<T>(typeof(T).Name.ToLower());
    }



    public async Task<T> GetById(Guid id)
    {
        var filter = Builders<T>.Filter.Eq(doc => doc.Id, id);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<T>> GetAll()
    {
        return await _collection.Find(doc => !doc.IsDeleted()).ToListAsync();
    }

    public async Task<T> Add(T entity)
    {
        await _collection.InsertOneAsync(entity);
        return entity;
    }

    public async Task<T> Update(T entity)
    {
        entity.Update();
        var filter = Builders<T>.Filter.Eq(doc => doc.Id, entity.Id);
        await _collection.ReplaceOneAsync(filter, entity);
        return entity;
    }

    public async Task Delete(Guid id)
    {
        var entity = await GetById(id);
        if (entity == null)
            return;

        entity.Delete();
        var filter = Builders<T>.Filter.Eq(doc => doc.Id, id);
        await _collection.DeleteOneAsync(filter);
    }

    public async Task<IEnumerable<T>> Find(Expression<Func<T, bool>> predicate)
    {
        return await _collection.Find(predicate).ToListAsync();
    }
} 