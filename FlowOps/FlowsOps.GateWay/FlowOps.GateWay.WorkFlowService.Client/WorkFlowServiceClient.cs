using FlowOps.GateWay.WorkFlowService.Client.Models;

namespace FlowOps.GateWay.WorkFlowService.Client;

public class WorkFlowServiceClient : IWorkFlowServiceClient
{
    private readonly HttpClient _httpClient;

    public WorkFlowServiceClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public Task<IEnumerable<GetWorkFlowResponse>> GetWorkflowsAsync()
    {
        throw new NotImplementedException();
    }

    public Task<GetWorkFlowResponse> GetWorkflowAsync(string id)
    {
        throw new NotImplementedException();
    }

    public Task<WorkFlowBase> CreateWorkflowAsync(CreateWorkflowRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<GetWorkFlowResponse> UpdateWorkflowAsync(string id, UpdateWorkflowRequest request)
    {
        throw new NotImplementedException();
    }

    public Task DeleteWorkflowAsync(string id)
    {
        throw new NotImplementedException();
    }




}
