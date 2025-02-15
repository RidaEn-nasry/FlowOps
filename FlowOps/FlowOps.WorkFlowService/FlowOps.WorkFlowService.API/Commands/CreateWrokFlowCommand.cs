


using FlowOps.WorkFlowService.DataLayer.Domain;
using FlowOps.WorkFlowService.DataLayer.Repositories;
using FlowOps.WorkFlowService.Models.Responses;
using MediatR;

namespace FlowOps.WorkFlowService.Commands;

public record CreateWorkFlowCommand(string Name, string Script) : IRequest<CreateWorkFlowResponse>;

public class CreateWorkFlowCommandHandler(
    IWorkFlowRepository workflowRepository
) : IRequestHandler<CreateWorkFlowCommand, CreateWorkFlowResponse>
{
    public CreateWorkFlowCommandHandler()
    {

    }
    public async Task<CreateWorkFlowResponse> Handle(CreateWorkFlowCommand request, CancellationToken cancellationToken)
    {
        var workflow = new Workflow(request.Name, request.Script);
        await workflowRepository.Add(workflow);

        // create in db which triggers a domain event
        // then we have handler sends integration event
        return new CreateWorkFlowResponse(workflow.Id);
    }
}
