from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import health
from api.middleware.rate_limit import RateLimiter
import uvicorn
import os

# Initialize FastAPI App
app = FastAPI(
    title="ProfitOS Chimera API",
    description="Autonomous Revenue Operations Engine",
    version="1.0.0"
)

# 1. Security: CORS Middleware
# Pulls allowed origins from env or defaults to * for initial boot
origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Performance: Rate Limiting Middleware
# Initialize the limiter (100 requests per 60s)
limiter = RateLimiter(max_requests=100, window_seconds=60)

@app.middleware("http")
async def apply_rate_limit(request, call_next):
    return await limiter(request, call_next)

# 3. Routes: Integration
# Include the health check route for Railway/Deployment verification
app.include_router(health.router)

@app.get("/")
async def root():
    return {
        "service": "ProfitOS Chimera",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    # Default port for Railway/Docker
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("api.main:app", host="0.0.0.0", port=port, reload=True)
