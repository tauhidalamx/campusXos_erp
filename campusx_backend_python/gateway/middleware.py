# -*- coding: utf-8 -*-
"""
CAMPUSX OS Python Backend - Gateway Middleware
Handles API request validation, rate limiting, and performance logging metrics.
"""

import time
import logging
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

# Setup Structured Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("campusx_gateway")

class SecurityGatewayMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # 1. Start timer to measure processing latency
        start_time = time.time()
        
        # 2. XSS Header Injection Shield
        response = Response()
        try:
            response = await call_next(request)
        except Exception as exc:
            logger.error(f"[Gateway Error] Intercepted exception: {exc}")
            return JSONResponse(
                status_code=500,
                content={"error": "Internal Server Error", "details": str(exc)}
            )
            
        # 3. Add security headers
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        
        # 4. Log latency metrics
        latency_ms = (time.time() - start_time) * 1000
        logger.info(
            f"[{request.method}] {request.url.path} - "
            f"Status: {response.status_code} - Latency: {latency_ms:.2f}ms"
        )
        return response

class RateLimiter:
    """Mock Redis Token Bucket rate limiter."""
    def __init__(self, limit: int = 100, window: int = 60):
        self.limit = limit
        self.window = window
        self.buckets = {}

    def is_allowed(self, client_ip: str) -> bool:
        now = time.time()
        if client_ip not in self.buckets:
            self.buckets[client_ip] = [now]
            return True
            
        # Filter tokens inside active window
        self.buckets[client_ip] = [t for t in self.buckets[client_ip] if now - t < self.window]
        
        if len(self.buckets[client_ip]) < self.limit:
            self.buckets[client_ip].append(now)
            return True
        return False
