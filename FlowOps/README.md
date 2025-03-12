# FlowOps NestJS Backend

A TypeScript implementation of the FlowOps backend using NestJS framework.

## Features

- API Gateway for routing requests to appropriate microservices
- Create and manage workflows
- Store workflows in MongoDB
- Publish workflow events to RabbitMQ
- RESTful API with validation
- Error handling with custom exceptions
- Logging

## Architecture

The application follows a microservices architecture:

- **Gateway Service**: Entry point for all client requests, routes to appropriate services
- **Workflow Service**: Handles workflow creation and management

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB
- RabbitMQ

## Installation

```bash
# Install dependencies
npm install

# Build the application
npm run build
```

## Running the application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Application
APP_NAME=flowops-api
APP_VERSION=1.0.0
APP_HOST=0.0.0.0
APP_PORT=3000
DEBUG=true

# MongoDB
MONGODB_URI=mongodb://localhost:27017/flowops

# RabbitMQ
RABBITMQ_URI=amqp://localhost:5672
RABBITMQ_EXCHANGE=flowops
RABBITMQ_QUEUE=workflows

# Services
SERVICES_WORKFLOW_URL=http://localhost:3001

# CORS
ALLOW_ORIGINS=*
ALLOW_CREDENTIALS=false
ALLOW_METHODS=GET,POST,PUT,DELETE
ALLOW_HEADERS=Content-Type,Authorization
```

## API Endpoints

### Workflows

- `POST /api/v1/workflows` - Create a new workflow
- `GET /api/v1/workflows/:id` - Get a workflow by ID

### Health Check

- `GET /api/v1/health` - Check service health (includes status of all services)

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```
src/
├── common/              # Common utilities and helpers
│   ├── exceptions/      # Custom exception classes
│   └── filters/         # Exception filters
├── config/              # Application configuration
├── gateway/             # API Gateway module
│   ├── controllers/     # Gateway controllers
│   ├── interfaces/      # Gateway interfaces
│   └── services/        # Gateway services
├── shared/              # Shared resources
│   └── dto/             # Data Transfer Objects
├── workflow/            # Workflow module
│   ├── controllers/     # API controllers
│   ├── interfaces/      # TypeScript interfaces
│   ├── schemas/         # MongoDB schemas
│   └── services/        # Business logic
├── app.module.ts        # Main application module
└── main.ts              # Application entry point
``` 