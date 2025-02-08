
using FlowOps.WorkFlowService.DataLayer.Context;
using FlowOps.WorkFlowService.DataLayer.Domain;
using MediatR;

namespace FlowOps.WorkFlowService.Business.Extensions;

public static class MediatorExtension
{
    public static async Task DispatchDomainEvents(this IMediator mediator, DataBaseContext context)
    {
        var domainEntities = context.ChangeTracker
            .Entries<BaseEntity>()
            .Where(x => x.Entity.DomainEvents.Any());

        var domainEvents = domainEntities
            .SelectMany(x => x.Entity.DomainEvents) 
            .ToList();

        domainEntities.ToList().ForEach(entity => entity.Entity.ClearDomainEvents());

        foreach (var domainEvent in domainEvents)
            await mediator.Publish(domainEvent);
    }

}