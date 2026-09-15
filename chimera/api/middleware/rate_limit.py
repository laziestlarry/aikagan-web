"""Rate limiting middleware. Prevents API abuse."""
from fastapi import Request, HTTPException
from collections import defaultdict
import time

class RateLimiter:
    def __init__(self, max_requests: int = 100, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window = window_seconds
        self._requests: dict = defaultdict(list)

    async def __call__(self, request: Request, call_next):
        client_ip = request.client.host
        now = time.time()
        self._requests[client_ip] = [t for t in self._requests[client_ip] if t > now - self.window]
        if len(self._requests[client_ip]) >= self.max_requests:
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        self._requests[client_ip].append(now)
        return await call_next(request)
