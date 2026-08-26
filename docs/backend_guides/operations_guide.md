# Backend Operations Guide

This guide explains how to run, manage, and monitor the Python FastAPI backend and Celery workers.

---

## 1. Running the Backend Server

Start the Uvicorn application server locally:

```bash
# Activate virtual environment
source .venv/bin/activate

# Start FastAPI server on port 8001
uvicorn campusx_backend_python.main:app --host 0.0.0.0 --port 8001 --reload
```

Interactive API documentation (Swagger) is available at `http://localhost:8001/docs`.

---

## 2. Running Background Workers

Start the Celery task queue worker:

```bash
# Make sure Redis is running on port 6379
# Start Celery worker
celery -A campusx_backend_python.workers.celery_app worker --loglevel=info
```

---

## 3. Health Checks & Logs

- **Health Check**: Send a GET request to `http://localhost:8001/` to confirm the server is responsive.
- **Log Format**: Standard logs record timestamps, log levels, HTTP methods, endpoints, status codes, and latency in milliseconds.

