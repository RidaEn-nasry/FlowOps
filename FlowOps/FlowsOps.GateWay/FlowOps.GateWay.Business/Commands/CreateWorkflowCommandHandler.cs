

using AutoMapper;
using FlowOps.GateWay.Models.Requests;
using FlowOps.GateWay.WorkFlowService.Client;
using MediatR;

using WorkFlowBase = FlowOps.GateWay.WorkFlowService.Client.Models.WorkFlowBase;
namespace FlowOps.GateWay.Business.Commands;

public record CreateWorkflowCommand(CreateWorkFlowRequest Command) : IRequest<WorkFlowBase>;

public class CreateWorkflowCommandHandler : IRequestHandler<CreateWorkflowCommand, WorkFlowBase>
{
    private readonly IWorkFlowServiceClient _workFlowServiceClient;
    private readonly IMapper _mapper;
    public CreateWorkflowCommandHandler(IWorkFlowServiceClient workFlowServiceClient, IMapper mapper)
    {
        _mapper = mapper;
        _workFlowServiceClient = workFlowServiceClient;
    }
    public async Task<WorkFlowBase> Handle(CreateWorkflowCommand request, CancellationToken cancellationToken)
    {
        var createWorkflowRequest = new CreateWorkFlowRequest
        {
            Name = request.Command.Name,
            Script = request.Command.Script,
        };
        var response = await _workFlowServiceClient.CreateWorkflowAsync(_mapper.Map<CreateWorkFlowRequest, WorkFlowService.Client.Models.CreateWorkflowRequest>(createWorkflowRequest));
        return _mapper.Map<WorkFlowBase>(response);
    }
}


