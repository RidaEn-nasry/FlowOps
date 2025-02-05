
FlowOps lets you define, automate, and run fully or semi-agentic workflows using simple Python scripts.
It’s LLM-native, meaning your agents can think, decide, and take action on their own—or they can be semi-agentic by letting you define some of their decision-making.

# 💪 Why FlowOps? 
🔹 Write workflows in simple Python scripts – Infinite flexibility, no restrictive UI.

🔹 LLM-native – Workflows are built around LLMs that can decide actions dynamically.

🔹 No-Code DB for AI Agents – Store & retrieve structured data effortlessly.

🔹 Knowledge Base Integration – Use docs, FAQs, URLs, and more to supercharge your agents.

🔹 Event-Driven Execution – Agents respond instantly to messages, triggers, or APIs.

🔹 Open-Source & Extensible – Modify, contribute, and expand however you need.

# 🛠️ How it works under the hood (Technical Example: A Simple Slack AI Agent)

```python
@trigger(integration="slack", event="message", options={"channel": "#support"})
def run(context):
    # LLM figures out the intent
    intent = ai.classify(
        text=context.message.text, 
        labels=["question", "feedback", "complaint"]
    )

    # Save the conversation in the agent’s memory
    memory.store(
        table="messages", 
        workflow_id=context.workflow_id, 
        data={"type": intent, "content": context.message.text}
    )
    slack.reply(context.message.channel, f"Thanks for your {intent}! Let me help.")
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
