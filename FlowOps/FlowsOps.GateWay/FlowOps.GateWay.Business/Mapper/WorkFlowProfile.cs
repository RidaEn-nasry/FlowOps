
using AutoMapper;
using FlowOps.GateWay.Models.Requests;
using FlowOps.GateWay.WorkFlowService.Client.Models;

namespace FlowOps.GateWay.Business.Mapper;

public class  WorkFlowProfile : Profile
{
    public WorkFlowProfile()
    {
        CreateMap<CreateWorkFlowRequest, CreateWorkflowRequest>();
        CreateMap<WorkFlowService.Client.Models.WorkFlowModel, Models.WorkFlowModel>();
    }
}