

namespace FlowOps.WorkFlowService.DataLayer.Context;


public class WorkflowDbContext : DbContext
{
    public WorkflowDbContext(DbContextOptions<WorkflowDbContext> options) : base(options)
    {
    }

    public DbSet<Workflow> Workflows { get; set; }
}   

