from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class WorkflowCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    script: str = Field(..., min_length=1)
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Sample Workflow",
                "script": "print('Hello from workflow')"
            }
        }

class WorkflowResponse(BaseModel):
    id: str
    name: str
    script: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "name": "Sample Workflow",
                "script": "print('Hello from workflow')",
                "created_at": "2023-01-01T00:00:00.000Z",
                "updated_at": "2023-01-01T00:00:00.000Z"
            }
        } 