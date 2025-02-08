

namespace FlowOps.WorkFlowService.Domain;

public class Workflow : BaseEntity
{
    public string Name { get; set; }
    public string Script { get; set; }

    public Workflow(string name, string script)
    {
        Name = name;
        Script = script;
    }
}


