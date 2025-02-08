
using MediatR;
using Microsoft.AspNetCore.Mvc;
using FlowOps.WorkFlowService.Models.Requests;
using FlowOps.WorkFlowService.Commands;

namespace FlowOps.WorkFlowService.API.Controllers;

public class WorkFlowController(IMediator mediator) : ControllerBase
{


    [HttpPost]
    public async Task<IActionResult> CreateWorkflow([FromBody] CreateWorkFlowRequest request)
    {
        var command = new CreateWorkFlowCommand(request.Name, request.Script);
        var result = await mediator.Send(command);
        return Ok(result);
    }
}


