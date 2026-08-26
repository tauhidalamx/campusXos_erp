# -*- coding: utf-8 -*-
"""
CAMPUSX OS Python Backend - Celery App Worker
Configures background worker pools using Redis as message broker.
"""

from celery import Celery
import os

redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "campusx_workers",
    broker=redis_url,
    backend=redis_url,
    include=["campusx_backend_python.workers.tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True
)
