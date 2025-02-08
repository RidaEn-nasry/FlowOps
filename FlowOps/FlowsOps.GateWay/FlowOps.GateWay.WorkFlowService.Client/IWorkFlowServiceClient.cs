using FlowOps.GateWay.WorkFlowService.Client.Models;

namespace FlowOps.GateWay.WorkFlowService.Client;

public interface IWorkFlowServiceClient
{

    Task<IEnumerable<GetWorkFlowResponse>> GetWorkflowsAsync();
    Task<GetWorkFlowResponse> GetWorkflowAsync(string id);
    Task<WorkFlowBase> CreateWorkflowAsync(CreateWorkflowRequest request);
    Task<GetWorkFlowResponse> UpdateWorkflowAsync(string id, UpdateWorkflowRequest request);
    Task DeleteWorkflowAsync(string id);

}
