namespace FlowOps.MemoryService.Client;

public class MemoryServiceClient : IMemoryServiceClient
{
    private readonly HttpClient _httpClient;

    public MemoryServiceClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }
}
