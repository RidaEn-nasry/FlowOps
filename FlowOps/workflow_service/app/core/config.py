from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "FlowOps Workflow Service"
    APP_VERSION: str = "1.0.0"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8100
    
    # MongoDB settings
    MONGO_CONNECTION_STRING: str = "mongodb://mongo:27017"
    MONGO_DB_NAME: str = "flowops"
    
    # RabbitMQ settings
    RABBITMQ_HOST: str = "rabbitmq"
    RABBITMQ_USER: str = "user"
    RABBITMQ_PASS: str = "password"
    RABBITMQ_QUEUE: str = "workflow_events"
    
    # CORS settings
    ALLOW_ORIGINS: list = ["*"]
    ALLOW_CREDENTIALS: bool = True
    ALLOW_METHODS: list = ["*"]
    ALLOW_HEADERS: list = ["*"]
    
    class Config:
        env_file = ".env"

settings = Settings() 