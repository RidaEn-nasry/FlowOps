from fastapi import Request
from fastapi.responses import JSONResponse
from .exceptions import (
    DatabaseError,
    EventPublishError,
    WorkflowNotFoundError
)
from app.models.errors import ErrorResponse

error_handlers = {
    DatabaseError: (503, "DATABASE_ERROR"),
    EventPublishError: (503, "EVENT_PUBLISH_ERROR"),
    WorkflowNotFoundError: (404, "WORKFLOW_NOT_FOUND"),
}

async def service_exception_handler(request: Request, exc: Exception):
    error_info = error_handlers.get(
        type(exc),
        (500, "INTERNAL_SERVER_ERROR") 
    )
    
    return JSONResponse(
        status_code=error_info[0],
        content=ErrorResponse(
            status_code=error_info[0],
            message=str(exc),
            error_type=error_info[1],
            details={"service": "workflow_service"}
        ).model_dump()
    ) 