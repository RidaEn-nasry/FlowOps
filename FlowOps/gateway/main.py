import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import router

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="""
        FlowOps Gateway API serves as the entry point for creating and managing workflows.
        
        ## Features
        * Create and manage workflows
        * Forward requests to appropriate microservices
        * Health monitoring
        
        ## API Versioning
        All endpoints are prefixed with `/api/v1/`
        """,
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json"
    )
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOW_ORIGINS, 
        allow_credentials=settings.ALLOW_CREDENTIALS,
        allow_methods=settings.ALLOW_METHODS,
        allow_headers=settings.ALLOW_HEADERS,
    )
    
    app.include_router(workflow.router, prefix="/api/v1")
    app.include_router(health.router, prefix="/api/v1")
    
    return app

app = create_app()

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.APP_HOST,
        port=settings.APP_PORT,
    reload=settings.DEBUG
    )
