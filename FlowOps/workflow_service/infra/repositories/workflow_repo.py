from typing import Optional
from infra.db.mongodb import mongodb
from domain.entities.workflow import Workflow
from app.core.exceptions import DatabaseError

class WorkflowRepository:
    def __init__(self):
        self.collection = mongodb.get_collection("workflows")
    
    def create(self, workflow: Workflow) -> dict:
        try:
            record = {
                "id": workflow.id,
                "name": workflow.name,
                "script": workflow.script,
                "created_at": workflow.created_at,
                "updated_at": workflow.updated_at
            }
            self.collection.insert_one(record)
            return record
        except Exception as e:
            raise DatabaseError(f"Failed to create workflow: {str(e)}")
    
    def get_by_id(self, workflow_id: str) -> Optional[dict]:
        try:
            return self.collection.find_one({"id": workflow_id})
        except Exception as e:
            raise DatabaseError(f"Failed to retrieve workflow: {str(e)}")

workflow_repo = WorkflowRepository() 