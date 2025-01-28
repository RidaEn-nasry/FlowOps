


namespace FlowOps.DataLayer.Repositories;

public interface IWorkFlowRepository : IBaseRepository<WorkFlow>
{
}

public class WorkFlowRepository : IWorkFlowRepository
{
    private readonly IMongoCollection<WorkFlow> _collection;

    public WorkFlowRepository(IOptions<MongoDbConfig> config)
    {
        var client = new MongoClient(config.Value.ConnectionString);
        var database = client.GetDatabase(config.Value.DatabaseName);
        _collection = database.GetCollection<WorkFlow>("workflows");
    }

    public async Task<WorkFlow> CreateAsync(WorkFlow workflow)
    {
        await _collection.InsertOneAsync(workflow);
        return workflow;
    }

    public async Task<WorkFlow> GetByIdAsync(string id)
    {
        return await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();
    }
}