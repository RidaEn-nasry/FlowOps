from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    # App settings
    APP_NAME: str = os.getenv("APP_NAME", "FlowOps Gateway")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    APP_HOST: str = os.getenv("APP_HOST", "0.0.0.0")
    APP_PORT: int = int(os.getenv("APP_PORT", "8000"))
    
    # Service URLs
    WORKFLOW_SERVICE_URL: str = os.getenv("SERVICES_WORKFLOW_URL", "http://workflow_service:8100")
    
    # CORS
    ALLOW_ORIGINS: list = os.getenv("ALLOW_ORIGINS", "*").split(",")
    ALLOW_CREDENTIALS: bool = os.getenv("ALLOW_CREDENTIALS", "True").lower() == "true"
    ALLOW_METHODS: list = os.getenv("ALLOW_METHODS", "GET,POST,PUT,DELETE").split(",")
    ALLOW_HEADERS: list = os.getenv("ALLOW_HEADERS", "Content-Type,Authorization").split(",")
    
    class Config:
        env_file = ".env"

settings = Settings() 