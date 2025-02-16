from pydantic import BaseModel
from typing import Any, Optional

class ErrorResponse(BaseModel):
    status_code: int
    message: str
    error_type: str
    details: Optional[Any] = None 