using FlowOps.WorkFlowService.DataLayer.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure service client


// builder.Services.AddMediatR(cfg =>
// {
//     cfg.RegisterServicesFromAssembly(typeof(CreateWorkflowCommandHandler).Assembly);
// });


// builder.Services.AddAutoMapper(typeof(WorkFlowProfile).Assembly);


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(builder.Configuration["AllowedOrigins"])
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add MongoDB services
builder.Services.AddDataLayer(builder.Configuration);


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