from fastapi import APIRouter
router = APIRouter()

@router.get("/api/health")
def health():
    """Railway health check endpoint. Must return 200."""
    return {"status": "healthy", "service": "profit-os-chimera", "version": "1.0.0"}
