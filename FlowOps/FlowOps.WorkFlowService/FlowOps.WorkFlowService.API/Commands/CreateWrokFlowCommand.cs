


using MediatR;

namespace FlowOps.WorkFlowService.Commands;


public record CreateWorkFlowCommand(string Name, string Script) : IRequest<CreateWorkFlowResponse>;



public class CreateWorkFlowCommandHandler : IRequestHandler<CreateWorkFlowCommand, CreateWorkFlowResponse>
{
    public CreateWorkFlowCommandHandler()
    {

    }
    public async Task<CreateWorkFlowResponse> Handle(CreateWorkFlowCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
