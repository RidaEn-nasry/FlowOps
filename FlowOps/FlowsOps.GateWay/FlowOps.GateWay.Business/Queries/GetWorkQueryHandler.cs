

using FlowOps.Models.FlowOps.API.Models.Responses;
using MediatR;

namespace FlowOps.GateWay.API.Queries;

public record GetWorkQuery(string Id) : IRequest<GetWorkFlowResponse>;

public class GetWorkQueryHandler : IRequestHandler<GetWorkQuery, GetWorkFlowResponse>
{
    public Task<GetWorkFlowResponse> Handle(GetWorkQuery request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}

