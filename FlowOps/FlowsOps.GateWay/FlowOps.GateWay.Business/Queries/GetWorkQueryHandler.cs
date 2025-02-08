

using FlowOps.GateWay.Models.Responses;
using MediatR;

namespace FlowOps.GateWay.Business.Queries;

public record GetWorkQuery(string Id) : IRequest<GetWorkFlowResponse>;

public class GetWorkQueryHandler : IRequestHandler<GetWorkQuery, GetWorkFlowResponse>
{
    public Task<GetWorkFlowResponse> Handle(GetWorkQuery request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}

