import requests
from app.core.config import settings
from app.models.workflow import WorkflowCreate, WorkflowResponse
from app.core.exceptions import WorkflowServiceError

class WorkflowService:
    @staticmethod
    async def create_workflow(workflow: WorkflowCreate) -> WorkflowResponse:
        """
        Send workflow creation request to the workflow service
        """
        try:
            response = requests.post(
                f"{settings.WORKFLOW_SERVICE_BASE_URL}/workflows",
                json=workflow.model_dump()
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            raise WorkflowServiceError(f"Failed to create workflow: {str(e)}") 