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
            print(f"Connecting to MongoDB with: {settings.MONGO_CONNECTION_STRING}")
            self.client = MongoClient(settings.MONGO_CONNECTION_STRING)
            print("Pinging MongoDB...")
            self.client.admin.command('ping')
            print(f"Accessing database: {settings.MONGO_DB_NAME}")
            self.db = self.client[settings.MONGO_DB_NAME]
            
            print("Checking existing databases:")
            print(self.client.list_database_names())
            
            if settings.MONGO_DB_NAME not in self.client.list_database_names():
                print("Initializing new database...")
                self.db.workflows.insert_one({"_id": "init", "temp": True})
                self.db.workflows.delete_one({"_id": "init"})
                print(f"Database {settings.MONGO_DB_NAME} initialized")
            
            print(f"Connected to MongoDB: {self.db}")
        except ConnectionFailure as e:
            raise DatabaseError(f"Failed to connect to MongoDB: {str(e)}")
    
    def get_collection(self, name: str):
        if self.db is None:
            self.connect()
        return self.db[name]

mongodb = MongoDBClient() 