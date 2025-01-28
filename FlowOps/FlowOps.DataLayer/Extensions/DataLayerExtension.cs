

namespace FlowOps.DataLayer.Extensions;

public static class DataLayerExtension
{
    public static IServiceCollection AddDataLayer(this IServiceCollection services)
    {

        // configure mongo db
        services.Configure<MongoDbConfig>(configuration.GetSection("MongoDb"));

        // register repositories
        services.AddScoped<IWorkFlowRepository, WorkFlowRepository>();
        return services;
    }
}


