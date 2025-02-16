import uuid
from datetime import datetime

class WorkflowDomain:
    def __init__(self, name: str, script: str, workflow_id: str = None):
        self.id = workflow_id or str(uuid.uuid4())
        self.name = name
        self.script = script
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow() 