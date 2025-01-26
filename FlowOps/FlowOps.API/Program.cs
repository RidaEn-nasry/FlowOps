using FlowOps.WorkFlowService.Client.Extensions;
using FlowOps.MemoryService.Client.Extensions;
using FlowOps.Business.Extensions;
using FlowOps.Business.Commands;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure service client

builder.Services.AddWorkflowService(builder.Configuration);
builder.Services.AddMemoryService(builder.Configuration);

builder.Services.AddBusiness();

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(CreateWorkflowCommandHandler).Assembly);
});


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