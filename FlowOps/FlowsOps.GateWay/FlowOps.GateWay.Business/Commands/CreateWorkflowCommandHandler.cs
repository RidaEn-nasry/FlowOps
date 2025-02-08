

using AutoMapper;
using FlowOps.GateWay.Models;
using FlowOps.GateWay.Models.Requests;
using FlowOps.GateWay.WorkFlowService.Client;
using FlowOps.GateWay.WorkFlowService.Client.Models;
using MediatR;

namespace FlowOps.GateWay.Business.Commands;

public record CreateWorkflowCommand(CreateWorkFlowRequest Command) : IRequest<WorkFlowModel>;

public class CreateWorkflowCommandHandler : IRequestHandler<CreateWorkflowCommand, WorkFlowModel>
{
    private readonly IWorkFlowServiceClient _workFlowServiceClient;
    private readonly IMapper _mapper;
    public CreateWorkflowCommandHandler(IWorkFlowServiceClient workFlowServiceClient, IMapper mapper)
    {
        _mapper = mapper;
        _workFlowServiceClient = workFlowServiceClient;
    }
    public async Task<WorkFlowModel> Handle(CreateWorkflowCommand request, CancellationToken cancellationToken)
    {
        var createWorkflowRequest = new CreateWorkFlowRequest
        {
            Name = request.Command.Name,
            Script = request.Command.Script,
        };
        var response = await _workFlowServiceClient.CreateWorkflowAsync(_mapper.Map<CreateWorkFlowRequest, CreateWorkflowRequest>(createWorkflowRequest));
        return _mapper.Map<WorkFlowModel>(response);
    }
}


