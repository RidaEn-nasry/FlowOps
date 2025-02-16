from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    APP_NAME: str = "FlowOps Gateway"
    APP_VERSION: str = "1.0.0"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    WORKFLOW_SERVICE_URL: str = "http://workflow_service:8100"
    ALLOW_ORIGINS: str = "*"
    ALLOW_CREDENTIALS: bool = True  
    ALLOW_METHODS: str = "*"
    ALLOW_HEADERS: str = "*"
    
    
    class Config:
        env_file = ".env"

settings = Settings()