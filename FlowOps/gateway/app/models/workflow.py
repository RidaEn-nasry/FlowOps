from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Workflow(BaseModel):
    id: str
    name: str
    script: str

class WorkflowCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    script: str = Field(..., min_length=1)

class WorkflowUpdate(BaseModel):
    name: str
    script: str

class WorkflowResponse(BaseModel):
    id: str
    name: str
    script: str
    created_at: datetime
    updated_at: datetime
