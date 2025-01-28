

namespace FlowOps.WorkFlowService.Domain;

public class Workflow
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; }
    public string Script { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}


