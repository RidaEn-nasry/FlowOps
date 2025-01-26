

using FlowOps.Models.FlowOps.API.Models.Requests;
using FlowOps.Models.FlowOps.API.Models.Responses;
using FlowOps.WorkFlowService.Client;
using FlowOps.WorkFlowService.Client.Models;
using MediatR;

namespace FlowOps.Business.Commands;

public record CreateWorkflowCommand(CreateWorkFlowRequest Command) : IRequest<CreateWorkFlowResponse>;

public class CreateWorkflowCommandHandler : IRequestHandler<CreateWorkflowCommand, CreateWorkFlowResponse>
{
    private readonly IWorkFlowServiceClient _workFlowServiceClient;
    public CreateWorkflowCommandHandler(IWorkFlowServiceClient workFlowServiceClient)
    {
        _workFlowServiceClient = workFlowServiceClient;
    }
    public async Task<CreateWorkFlowResponse> Handle(CreateWorkflowCommand request, CancellationToken cancellationToken)
    {
        var createWorkflowRequest = new CreateWorkFlowRequest
        {
            Name = request.Command.Name,
            Description = request.Command.Description,
        };
        var response = await _workFlowServiceClient.CreateWorkflowAsync(createWorkflowRequest);
        return response;
    }
}


