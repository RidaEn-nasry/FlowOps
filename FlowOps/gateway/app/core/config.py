from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Application settings
    APP_NAME: str = "FlowOps Gateway"
    APP_VERSION: str = "1.0.0"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000

    # Service URLs
    WORKFLOW_SERVICE_BASE_URL: str = "http://workflow_service:8100/api/v1"

    # CORS settings
    ALLOW_ORIGINS: str = "*"
    ALLOW_CREDENTIALS: bool = True
    ALLOW_METHODS: str = "*"
    ALLOW_HEADERS: str = "*"

    class Config:
        env_file = ".env"

settings = Settings()