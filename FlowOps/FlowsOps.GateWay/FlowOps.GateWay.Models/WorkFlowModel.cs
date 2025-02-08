
namespace FlowOps.GateWay.Models;
public abstract class WorkFlowBase
{
    public Guid? Id { get; set; }
    required public string Name { get; set; }
    required public string Script { get; set; }
}
