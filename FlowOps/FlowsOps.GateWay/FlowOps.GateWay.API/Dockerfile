# FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview AS base
# WORKDIR /app
# EXPOSE 80
# EXPOSE 443

# FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
# WORKDIR /src
# COPY ["FlowOps.API/FlowOps.API.csproj", "FlowOps.API/"]
# COPY ["FlowOps.MemoryService.Client/FlowOps.MemoryService.Client.csproj", "FlowOps.MemoryService.Client/"]
# COPY ["FlowOps.WorkFlowService.Client/FlowOps.WorkFlowService.Client.csproj", "FlowOps.WorkFlowService.Client/"]
# RUN dotnet restore "FlowOps.API/FlowOps.API.csproj"
# COPY . .
# WORKDIR "/src/FlowOps.API"
# RUN dotnet build "FlowOps.API.csproj" -c Release -o /app/build

# FROM build AS publish
# RUN dotnet publish "FlowOps.API.csproj" -c Release -o /app/publish

# FROM base AS final
# WORKDIR /app
# COPY --from=publish /app/publish .
# ENTRYPOINT ["dotnet", "FlowOps.API.dll"]