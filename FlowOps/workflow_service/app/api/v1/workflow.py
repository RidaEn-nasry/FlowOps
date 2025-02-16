from fastapi import APIRouter, HTTPException, status
from app.models.workflow import WorkflowCreate, WorkflowResponse
from domain.services.workflow_service import WorkflowService
from app.core.exceptions import (
    WorkflowNotFoundError,
    WorkflowCreationError,
    DatabaseError,
    EventPublishError
)

router = APIRouter(
    prefix="/workflows",
    tags=["workflows"]
)

@router.post(
    "/",
    response_model=WorkflowResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new workflow",
    description="""
    Creates a new workflow, stores it in MongoDB, and publishes a workflow.created event to RabbitMQ.
    """,
    response_description="The created workflow with its ID and timestamps"
)
async def create_workflow(workflow: WorkflowCreate):
    try:
        record = WorkflowService.create_workflow(
            name=workflow.name,
            script=workflow.script
        )
        return record
    except (DatabaseError, EventPublishError) as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get(
    "/{workflow_id}",
    response_model=WorkflowResponse
)
async def get_workflow(workflow_id: str):
    try:
        return WorkflowService.get_workflow(workflow_id)
    except WorkflowNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workflow {workflow_id} not found"
        )
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        ) 