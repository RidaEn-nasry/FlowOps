from dataclasses import dataclass
from datetime import datetime
import uuid

@dataclass
class WorkflowCreatedEvent:
    workflow_id: str
    name: str
    created_at: datetime
    event_id: str = None
    event_type: str = "workflow.created"
    
    def to_dict(self):
        return {
            "event_type": self.event_type,
            "workflow_id": self.workflow_id,
            "name": self.name,
            "created_at": self.created_at.isoformat(),
            "event_id": self.event_id or str(uuid.uuid4())
        } 