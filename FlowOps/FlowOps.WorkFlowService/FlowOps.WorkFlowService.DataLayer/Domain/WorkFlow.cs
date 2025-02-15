

using FlowOps.WorkFlowService.DataLayer.DomainEvents;

namespace FlowOps.WorkFlowService.DataLayer.Domain;

public class Workflow : BaseEntity
{
    public string Name { get; set; }
    public string Script { get; set; }

    public Workflow(string name, string script)
    {
        Name = name;
        Script = script;
        AddDomainEvent(new WorkflowCreatedEvent(Id));
    }
}