

using MediatR;

namespace FlowOps.WorkFlowService.DataLayer.DomainEvents;

public class BaseDomainEvent : INotification
{
    public DateTime DateOccurred { get; protected set; } = DateTime.UtcNow;
}


