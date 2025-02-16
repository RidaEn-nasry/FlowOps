from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from app.core.config import settings
from app.core.exceptions import DatabaseError

class MongoDBClient:
    def __init__(self):
        self.client = None
        self.db = None
        
    def connect(self):
        try:
            self.client = MongoClient(settings.MONGO_CONNECTION_STRING)
            self.client.admin.command('ping')
            self.db = self.client[settings.MONGO_DB_NAME]
        except ConnectionFailure as e:
            raise DatabaseError(f"Failed to connect to MongoDB: {str(e)}")
    
    def get_collection(self, name: str):
        # NotImplementedError: Database objects do not implement truth value testing or bool(). Please compare with None instead: database is not None
        if self.db is not None:
            self.connect()
        return self.db[name]

mongodb = MongoDBClient() 