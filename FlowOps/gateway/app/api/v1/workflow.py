from fastapi import APIRouter, HTTPException, status
from app.models.workflow import WorkflowCreate, WorkflowResponse
from app.domain.services import WorkflowService

router = APIRouter(
    prefix="/workflows",
    tags=["workflows"],
    responses={
        502: {"description": "Workflow service unavailable"},
        500: {"description": "Internal server error"}
    }
)

@router.post(
    "/",
    response_model=WorkflowResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new workflow",
    description="""
    Creates a new workflow by forwarding the request to the Workflow Service.
    
    The workflow service will:
    * Generate a unique ID
    * Store the workflow in MongoDB
    * Publish a workflow.created event
    """,
    response_description="The created workflow with its ID and timestamps"
)
async def create_workflow(workflow: WorkflowCreate):
    """
    Create a new workflow with the following parameters:
    
    - **name**: A unique name for the workflow (1-255 characters)
    - **script**: The Python script to be executed (non-empty)
    """
    try:
        created_workflow = await WorkflowService.create_workflow(workflow)
        return created_workflow
    except WorkflowServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(e)
        )
    except Exception as e:
        # Log the error here
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        ) 