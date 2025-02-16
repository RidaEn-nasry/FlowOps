from typing import Optional
from infra.db.mongodb import mongodb
from domain.entities.workflow import Workflow
from app.core.exceptions import DatabaseError

class WorkflowRepository:
    def __init__(self):
        self.collection = mongodb.get_collection("workflows")
    
    def create(self, workflow: Workflow) -> dict:
        try:
            print(f"Attempting to insert workflow: {workflow.id}")
            record = {
                "id": workflow.id,  
                "name": workflow.name,
                "script": workflow.script,
                "created_at": workflow.created_at,
                "updated_at": workflow.updated_at
            }
            result = self.collection.insert_one(record)
            print(f"Insert result: {result.acknowledged}")
            print(f"Inserted ID: {result.inserted_id}")
            if not result.acknowledged:
                raise DatabaseError("Failed to create workflow: Insert not acknowledged")
            return record
        except Exception as e:
            raise DatabaseError(f"Failed to create workflow: {str(e)}")
    
    def get_by_id(self, workflow_id: str) -> Optional[dict]:
        try:
            record = self.collection.find_one({"id": workflow_id})
            if record and '_id' in record:
                record.pop('_id')
            return record
        except Exception as e:
            raise DatabaseError(f"Failed to retrieve workflow: {str(e)}")

workflow_repo = WorkflowRepository() 