from pydantic import BaseModel

class WorkflowBase(BaseModel):
    id: str | None
    name: str
    script: str
