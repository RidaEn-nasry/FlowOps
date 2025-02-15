
using MediatR;

namespace FlowOps.WorkFlowService.DataLayer.Domain;


public class BaseEntity
{

    public IList<INotification> DomainEvents { get; set; } = [];
    public Guid Id { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }

    public BaseEntity()
    {
        Id = Guid.NewGuid();
        CreatedAt = DateTimeOffset.UtcNow;
    }

    public void Delete()
    {
        DeletedAt = DateTimeOffset.UtcNow;
    }

    public void Update()
    {
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public bool IsDeleted()
    {
        return DeletedAt.HasValue;
    }

    public void AddDomainEvent(INotification eventItem)
    {
        DomainEvents.Add(eventItem);
    }

    public void RemoveDomainEvent(INotification eventItem)
    {
        DomainEvents?.Remove(eventItem);
    }

    public void ClearDomainEvents()
    {
        DomainEvents.Clear();
    }

}