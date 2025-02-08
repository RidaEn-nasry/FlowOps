using FlowOps.WorkFlowService.DataLayer.Context;
using FlowOps.WorkFlowService.DataLayer.Domain;

namespace FlowOps.WorkFlowService.DataLayer.Repositories;

public class WorkflowRepository : BaseRepository<Workflow>, IWorkFlowRepository
{
    public WorkflowRepository(DataBaseContext context) : base(context)
    {
    }

}
