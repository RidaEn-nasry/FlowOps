

namespace FlowOps.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class WorkFlowController : ControllerBase
{
    private readonly IMediator _mediator;
    public WorkFlowController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetWorkflow(string id)
    {
        var response = await _mediator.Send(new GetWorkQuery(id));
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateWorkflow(Workflow workflow)
    {
        var createdWorkflow = await _mediator.Send(new CreateWorkflowCommand(workflow));
        return CreatedAtAction(nameof(GetWorkflow), new { id = createdWorkflow.Id }, createdWorkflow);
    }

}

