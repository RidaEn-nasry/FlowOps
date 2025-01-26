

using System.ComponentModel.DataAnnotations;

namespace FlowOps.WorkFlowService.Client.Models;

public class WorkFlowBaseModel
{
    required public string Id { get; set; }
    required public string Name { get; set; }
    public string? Description { get; set; }
}
