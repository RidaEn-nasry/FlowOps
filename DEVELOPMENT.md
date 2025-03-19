# FlowOps Development Guide

This document describes how to set up and run the FlowOps development environment using Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Project Structure

FlowOps consists of several services:

- **Frontend Client**: React application
- **API Gateway**: NestJS service for API routing and orchestration
- **Workflow Service**: NestJS service for workflow management
- **Memory Service**: NestJS service for memory operations
- **MongoDB**: Database for persistent storage
- **RabbitMQ**: Message broker for service communication

## Environment Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-org/flowops.git
   cd flowops
   ```

2. Create environment files:
   ```
   cp .env.example .env.dev
   cp client/.env.example client/.env.dev
   ```

3. Edit `.env.dev` and `client/.env.dev` with your desired configuration.

## Running the Development Environment

We provide two helpful scripts to manage the development environment:

### Starting the Environment

Run the development script:

```bash
./run-dev.sh
```

This script will:
- Verify Docker is running
- Check all necessary environment files exist
- Validate required environment variables
- Start all services with Docker Compose

### Checking Logs

To check logs of specific services:

```bash
./check-logs.sh [SERVICE]
```

Where `[SERVICE]` can be one of:
- `all` - View logs from all services
- `api-gateway` - API Gateway service logs
- `workflow` - Workflow service logs
- `memory` - Memory service logs
- `client` - Frontend client logs
- `mongodb` - MongoDB logs
- `rabbitmq` - RabbitMQ logs

Example: `./check-logs.sh api-gateway`

## Service Ports

- Frontend Client: `http://localhost:5173`
- API Gateway: `http://localhost:3000`
- Workflow Service: `http://localhost:3001`
- Memory Service: `http://localhost:3002`
- MongoDB: `mongodb://localhost:27017`
- RabbitMQ Management UI: `http://localhost:15672` (username: guest, password: guest)

## Development Workflow

1. Start the development environment: `./run-dev.sh`
2. Make changes to the code
3. Services with volumes mounted will automatically reload when files change
4. Check logs to verify changes are applied: `./check-logs.sh all`

## Troubleshooting

### Services won't start

Check for error messages in the Docker Compose output. Common issues:

- Port conflicts: Ensure no other services are using the required ports
- Environment variables: Verify all required variables are set in `.env.dev`
- MongoDB connection: Ensure MongoDB service is running

### Prisma issues

If you encounter Prisma-related issues:

1. Access the service container:
   ```bash
   docker exec -it flowops-api-gateway-dev bash
   ```

2. Try regenerating Prisma clients:
   ```bash
   npm run prisma:generate
   ```

### Logs show errors connecting to services

Ensure the correct service names and ports are used in environment variables. Inside Docker Compose network, services should connect using service names (e.g., `mongodb` not `localhost`).

## Stopping the Environment

To stop all services, press `Ctrl+C` in the terminal where `run-dev.sh` is running, or run:

```bash
docker compose -f docker-compose.dev.yml down
```

To remove volumes and start fresh:

```bash
docker compose -f docker-compose.dev.yml down -v
``` 