using System.ComponentModel.Design;
using FlowOps.WorkFlowService.DataLayer.Context;
using FlowOps.WorkFlowService.DataLayer.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using FlowOps.WorkFlowService.DataLayer.Configurations;
using FlowOps.WorkFlowService.DataLayer.Domain;

namespace FlowOps.WorkFlowService.DataLayer.Extensions;

public static class DataLayerExtensions
{

    public static IServiceCollection AddDataLayer(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<MongoDbConfig>(
            configuration.GetSection("Database"));
        services.AddSingleton<DataBaseContext>();
        services.AddScoped<IWorkFlowRepository, WorkflowRepository>();
        return services;
    }
}   
