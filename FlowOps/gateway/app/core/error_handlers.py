from fastapi import Request
from fastapi.responses import JSONResponse
from .exceptions import ServiceError
from app.models.errors import ErrorResponse

error_handlers = {
    ServiceError: (503, "SERVICE_ERROR"),
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
            details={"service": getattr(exc, "service", None)}
        ).model_dump()
    )

async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            status_code=500,
            message="An unexpected error occurred",
            error_type="INTERNAL_SERVER_ERROR",
            details=str(exc) if not isinstance(exc, AssertionError) else None
        ).model_dump()
    )