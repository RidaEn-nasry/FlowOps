using FlowOps.WorkFlowService.DataLayer.Configurations;
using MongoDB.Driver;
using Microsoft.Extensions.Options;

namespace FlowOps.WorkFlowService.DataLayer.Context;

public class DataContext
{
    private readonly IMongoDatabase _database;
    private readonly IMongoClient _client;

    public DataContext(IOptions<MongoDbConfig> configuration)
    {
        _client = new MongoClient(configuration.Value.ConnectionString);
        _database = _client.GetDatabase(configuration.Value.DatabaseName);
    }

    public IMongoCollection<T> GetCollection<T>(string name)
    {
        return _database.GetCollection<T>(name);
    }
}