using FlowOps.WorkFlowService.Client.Models;

namespace FlowOps.WorkFlowService.Client;

public interface IWorkFlowServiceClient
{

    Task<IEnumerable<GetWorkFlowResponse>> GetWorkflowsAsync();
    Task<GetWorkFlowResponse> GetWorkflowAsync(string id);
    Task<GetWorkFlowResponse> CreateWorkflowAsync(CreateWorkflowRequest request);
    Task<GetWorkFlowResponse> UpdateWorkflowAsync(string id, UpdateWorkflowRequest request);
    Task DeleteWorkflowAsync(string id);

}
