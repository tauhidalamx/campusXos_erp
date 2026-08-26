# -*- coding: utf-8 -*-
"""
CAMPUSX OS Python Backend - Global Configuration
Loads settings, database connections, and auth tokens from environment variables.
"""

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App Settings
    app_name: str = "CAMPUSX OS Unified Backend"
    port: int = int(os.environ.get("PORT", 8001))
    debug: bool = os.environ.get("DEBUG", "true").lower() == "true"
    
    # Security & Tokens
    jwt_secret: str = os.environ.get("JWT_SECRET", "campusx_os_cryptographic_secret_hash_key_100x")
    jwt_algorithm: str = os.environ.get("JWT_ALGORITHM", "HS256")
    access_token_expire_minutes: int = 1440 # 24 hours for developer convenience
    
    # Databases
    database_url: str = os.environ.get("DATABASE_URL", "sqlite:///campusx_os_python.db")
    redis_url: str = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
    kafka_brokers: str = os.environ.get("KAFKA_BROKERS", "localhost:9092")
    
    # Storage / Buckets
    s3_endpoint: str = os.environ.get("S3_ENDPOINT", "http://localhost:9000")
    s3_access_key: str = os.environ.get("S3_ACCESS_KEY", "minioadmin")
    s3_secret_key: str = os.environ.get("S3_SECRET_KEY", "minioadmin")
    s3_bucket: str = os.environ.get("S3_BUCKET", "campusx-vault")

    class Config:
        env_file = ".env"

settings = Settings()
