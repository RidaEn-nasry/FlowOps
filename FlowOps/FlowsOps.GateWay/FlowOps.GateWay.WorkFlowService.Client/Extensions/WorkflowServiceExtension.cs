
using FlowOps.GateWay.WorkFlowService.Client.Config;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FlowOps.GateWay.WorkFlowService.Client.Extensions;

public static class WorkflowServiceExtension
{
    public static IServiceCollection AddWorkflowServiceClient(this IServiceCollection services, IConfiguration configuration)
    {
        var config = configuration.GetSection("WorkFlowServiceConfig").Get<WorkflowServiceConfig>();
        services.AddHttpClient<IWorkFlowServiceClient, WorkFlowServiceClient>(client => client.BaseAddress = new Uri(config.BaseUrl));
        return services;
    }
}
