from domain.entities.workflow import Workflow
from domain.events.workflow_events import WorkflowCreatedEvent
from infra.repositories.workflow_repo import workflow_repo
from infra.messaging.rabbitmq import rabbitmq
from app.core.exceptions import WorkflowNotFoundError

class WorkflowService:
    @staticmethod
    def create_workflow(name: str, script: str) -> dict:
        # Create domain entity
        workflow = Workflow(name=name, script=script)
        
        # Save to database
        record = workflow_repo.create(workflow)
        
        # Publish event
        event = WorkflowCreatedEvent(
            workflow_id=workflow.id,
            name=workflow.name,
            created_at=workflow.created_at
        )
        rabbitmq.publish(event.to_dict())
        
        return record
    
    @staticmethod
    def get_workflow(workflow_id: str) -> dict:
        record = workflow_repo.get_by_id(workflow_id)
        if not record:
            raise WorkflowNotFoundError(f"Workflow {workflow_id} not found")
        return record 