using FlowOps.GateWay.MemoryService.Client.Configuration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FlowOps.MemoryService.Client.Extensions;

public static class MemoryServiceExtension
{
    public static IServiceCollection AddMemoryService(this IServiceCollection services, IConfiguration configuration)
    {
        var config = configuration.GetSection("MemoryServiceConfig").Get<MemoryServiceConfig>();
        services.AddHttpClient<IMemoryServiceClient, MemoryServiceClient>(client => client.BaseAddress = new Uri(config.BaseUrl));
        return services;
    }
}
