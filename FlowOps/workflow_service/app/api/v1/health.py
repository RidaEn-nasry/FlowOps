from fastapi import APIRouter

router = APIRouter(
    prefix="/health",
    tags=["health"]
)

@router.get("/",
            summary="Check the health of the workflow service",
            description="""
            Returns a 200 status code if the workflow service is healthy.
            """,
            response_description="The status of the workflow service"
            )
async def health():
    return {"status": "ok"}
