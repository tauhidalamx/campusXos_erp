# -*- coding: utf-8 -*-
"""
CAMPUSX OS Python Backend - Database Connection
Sets up engine pools, thread sessions, and context generators.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from campusx_backend_python.config import settings

# For development, if using SQLite, configure proper thread checks
connect_args = {}
if settings.database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.database_url,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency session generator yielded to FastAPI routers."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
