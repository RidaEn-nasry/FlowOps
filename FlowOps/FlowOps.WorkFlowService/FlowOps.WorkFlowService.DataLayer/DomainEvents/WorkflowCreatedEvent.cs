namespace FlowOps.WorkFlowService.DataLayer.DomainEvents;

public class WorkflowCreatedEvent : BaseDomainEvent
{
    public Guid WorkflowId { get; }

    public WorkflowCreatedEvent(Guid workflowId)
    {
        WorkflowId = workflowId;
    }
}