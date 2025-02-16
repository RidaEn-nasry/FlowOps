from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["health"])

@router.get("/")
async def health_check():
    return {"status": "ok"} 
