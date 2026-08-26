# -*- coding: utf-8 -*-
"""
CAMPUSX OS Python Backend - FastAPI Launcher
Main entry point starting the FastAPI server on port 8001.
Includes all REST/WebSockets routers and security middlewares.
"""

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from campusx_backend_python.config import settings
from campusx_backend_python.database import Base, engine
from campusx_backend_python.gateway.middleware import SecurityGatewayMiddleware
from campusx_backend_python.routers import auth, erp, connect, chain, market, ai, sports, soc

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Setup CORS to allow cross-platform client interactions
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Apply Security WAF and Latency logging middleware
app.add_middleware(SecurityGatewayMiddleware)

# Include Microservice Routers
app.include_router(auth.router, prefix="/api")
app.include_router(erp.router, prefix="/api")
app.include_router(connect.router, prefix="/api")
app.include_router(chain.router, prefix="/api")
app.include_router(market.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(sports.router, prefix="/api")
app.include_router(soc.router, prefix="/api")

@app.get("/")
def get_root():
    return {
        "status": "ONLINE",
        "message": "Welcome to CAMPUSX OS Python Full-Stack Backend Gateway Node."
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=settings.port, reload=settings.debug)
