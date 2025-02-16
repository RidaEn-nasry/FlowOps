from dataclasses import dataclass
from datetime import datetime
import uuid

@dataclass
class Workflow:
    name: str
    script: str
    id: str = None
    created_at: datetime = None
    updated_at: datetime = None

    def __post_init__(self):
        if not self.id:
            self.id = str(uuid.uuid4())
        if not self.created_at:
            self.created_at = datetime.utcnow()
        if not self.updated_at:
            self.updated_at = datetime.utcnow() 