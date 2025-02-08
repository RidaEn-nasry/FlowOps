
using FlowOps.GateWay.Business.Commands;
using FlowOps.GateWay.Business.Extensions;
using FlowOps.GateWay.Business.Mapper;
using FlowOps.GateWay.MemoryService.Client.Extensions;
using FlowOps.GateWay.WorkFlowService.Client.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure service clients
builder.Services.AddWorkflowServiceClient(builder.Configuration);
builder.Services.AddMemoryServiceClient(builder.Configuration);

builder.Services.AddBusiness();

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(CreateWorkflowCommandHandler).Assembly);
});


builder.Services.AddAutoMapper(typeof(WorkFlowProfile).Assembly);


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(builder.Configuration["AllowedOrigins"])
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Run();