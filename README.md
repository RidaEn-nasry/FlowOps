FlowOps lets you define, automate, and run fully or semi-agentic workflows using simple javascript scripts. It's Agentic, meaning your agents can think, decide, and take action on their own—or they can be semi-agentic by letting you define some of their decision-making.

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)


# Why FlowOps? 
🔹 Write workflows in simple javascript scripts – Infinite flexibility, no restrictive UI.

🔹 LLM-native – Workflows are built around LLMs that can decide actions dynamically.

🔹 No-Code DB for AI Agents – Store & retrieve structured data effortlessly.

🔹 Knowledge Base Integration – Use docs, FAQs, URLs, and more to supercharge your agents.

🔹 Event-Driven Execution – Agents respond instantly to messages, triggers, or APIs.

🔹 Open-Source & Extensible – Modify, contribute, and expand however you need.

# 🛠️ How it works under the hood (Technical Example: A Simple Slack AI Agent)

```
trigger({
  integration: "linkedin",
  event: "resume",
  source: "CompanyLinkedin"
})
``
```javascript
// workflow.js
async (context) => {
  // Extract key information
  const parsed = await ai.extract({
    prompt: "Extract full name, phone, work experience...",
    input: context.resume
  });

  // Conduct automated interview
  const conversationData = await ai.call(
    parsed.phone,
    { script: "perform a screen interview for 15 minutes..." }
  );

  // Generate and send summary
  const summary = await ai.summarize(conversationData);
  await email.send("hr@company.com", summary);
};
```

```mermaid

graph TD
    %% API Gateway
    subgraph API Layer
        A[API Gateway]
    end

    %% Workflow Service
    subgraph Workflow Management
        B[Workflow Service] 
        D[(Workflow DB)]
    end

    %% Memory Service (No-Code DB)
    subgraph Storage
        K[Memory Service]
        M[(No-Code DB)]
    end

    %% Event Bus
    subgraph Event & Queue System
        E[Message Broker]
        Q1[Workflow Execution Queue]
    end

    %% Orchestrator Service
    subgraph Orchestration
        F[Orchestrator]
    end

    %% Integration Services
    subgraph External Integrations
        G[Integration Services]
        H[Slack Integration]
    end

    %% Execution Services
    subgraph Execution Layer
        C[Executor Service]
        J[AI Service]
    end

    %% API Calls
    A -->|HTTP| B
    A -->|HTTP| K

    %% Workflow Service Actions
    B -->|Store Workflow| D
    B -->|Workflow Created Event| E

    %% Orchestrator Actions
    E -->|Workflow Created Event| F
    F -->|Request Webhook| G
    G -->|Create Webhook| H
    H -->|Webhook Registered| F

    %% Webhook Trigger (Message in Slack)
    H -->|Incoming Message| F
    F -->|Fetch Script from Workflow Service| B
    F -->|Add Script to Execution Queue| Q1
    Q1 -->|Executor Picks Up| C

    %% Executor Actions
    C -->|Classify Intent| J
    J -->|Return Classification| C
    C -->|Store in Memory| K
    C -->|Reply in Slack| H

    %% Queue Process
    subgraph Queue Processing
        F -.->|Add Script| Q1
        Q1 -->|Executor Pulls Script| C
    end

    %% Styling
    style A fill:#4CAF50,stroke:#000,stroke-width:2px
    style B fill:#2196F3,stroke:#000,stroke-width:2px
    style C fill:#FFC107,stroke:#000,stroke-width:2px
    style F fill:#9C27B0,stroke:#000,stroke-width:2px
    style G fill:#E91E63,stroke:#000,stroke-width:2px
    style J fill:#00BCD4,stroke:#000,stroke-width:2px
    style K fill:#FFC107,stroke:#000,stroke-width:2px
    style M fill:#FFEB3B,stroke:#000,stroke-width:2px
    style Q1 fill:#8BC34A,stroke:#000,stroke-width:2px


```

# 🚀 Development Setup

FlowOps is a microservices-based application with multiple backend services and a Vue.js frontend. Here's how to set it up for development:

## Environment Setup

### Using Docker (Recommended for First-Time Setup)

1. Clone the repository:
   ```bash
   git clone https://github.com/RidaEn-nasry/flowops.git
   cd flowops
   ```

2. Copy the example env file:
   ```bash
   cp .env.example .env.dev
   ```

3. Start all services with Docker Compose:
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

4. Access the application:
   - Frontend: http://localhost:5173
   - API Gateway: http://localhost:3000
   - MongoDB UI: http://localhost:27017
   - RabbitMQ Management: http://localhost:15672 (guest/guest)

### Running Without Docker (Local Development)

1. Make sure you have:
   - Node.js 18+ installed
   - MongoDB running locally on port 27017
   - RabbitMQ running locally on port 5672

2. Set up environment variables:
   ```bash
   cp .env.example .env.dev
   ```

3. Uncomment and update the local development URLs in `.env.dev` (look for the commented sections with "For non-Docker local development")

4. Install dependencies and start services:

   Backend:
   ```bash
   cd FlowOps
   npm install
   npm run prisma:generate  # Generate Prisma clients
   
   # To run all services concurrently:
   npm run start:services
   
   # Or run individual services:
   npm run start:api       # API Gateway on port 3000
   npm run start:workflow  # Workflow Service on port 3001
   npm run start:memory    # Memory Service on port 3002
   ```

   Frontend:
   ```bash
   cd client
   npm install
   npm run dev  # Starts the Vue dev server on port 5173
   ```

## Debugging in VS Code

1. Open the project in VS Code

2. For debugging the backend services:
   - Select the "Debug API Gateway", "Debug Workflow Service", or "Debug Memory Service" configuration
   - Or use "Debug All Services" to start all backend services in debug mode
   - Or use "Debug Full Stack" to start both backend and frontend in debug mode

3. Start the debugger by pressing F5 or clicking the green play button

## Project Structure

- `/FlowOps` - NestJS backend services
  - `/src/gateway` - API Gateway service
  - `/src/workflow` - Workflow management service
  - `/src/memory` - Database and storage service
  - `/prisma` - Prisma schema definitions

- `/client` - Vue.js frontend application

## Environment Variables

All environment variables are defined in the following files:
- `.env.dev` - Development environment variables
- `.env.prod` - Production environment variables
- `client/.env.development` - Frontend development variables
- `client/.env.production` - Frontend production variables

## Key Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection URL | `mongodb://mongodb:27017/flowops` |
| `RABBITMQ_URI` | RabbitMQ connection URL | `amqp://guest:guest@rabbitmq:5672` |
| `SERVICES_WORKFLOW_URL` | Internal workflow service URL | `http://workflow-service:3001` |
| `SERVICES_MEMORY_URL` | Internal memory service URL | `http://memory-service:3002` |

For more help, contact [Rida En-nasry](http://twitter.com/ennasryRida).

## How to Contribute

We welcome contributions! Please follow these steps:


### Contribution Workflow

1. **Create an issue**  
    Discuss your proposed changes by [opening an issue](https://github.com/RidaEn-nasry/flowops/issues) first.

2. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/issue-number-description
   ```

3. **Implement your changes**  
   Follow our coding standards:
   - PEP8 style guide
   - Type hints for all function signatures
   - Docstrings for public methods

4. **Commit your changes**  
   Use [Conventional Commits](https://www.conventionalcommits.org/) style:
   ```bash
   git commit -m "feat: add new workflow validation"
   ```

5. **Push and open a Pull Request**  
   Create a PR against the `main` branch with a clear description of your changes.

