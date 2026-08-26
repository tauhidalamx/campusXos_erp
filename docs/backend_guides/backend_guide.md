# Python Backend Architecture Guide

This guide explains the service design, modules, and WebSocket handlers in the FastAPI + SQLAlchemy backend.

---

## 1. API Entry & Routing

The entry point [main.py](file:///Users/tauhidalam/antygravity/campusx_backend_python/main.py) starts the Uvicorn server on **port 8001** and attaches routes under `/api`:

```
                           +------------------------+
                           |     FastAPI Server     |
                           |       (Port 8001)      |
                           +-----------+------------+
                                       |
                   +-------------------+-------------------+
                   |                                       |
       +-----------+-----------+               +-----------+-----------+
       |  Security Middleware  |               |   REST & WS Routers   |
       |     (CORS & WAF)      |               |  (Auth, ERP, Connect) |
       +-----------------------+               +-----------------------+
```

---

## 2. Service Modules

- **Auth Services**: Handles user authentication, login tokens, and password hashing.
- **Academics & ERP**: Manages student rosters, course registration, and attendance records.
- **Connect Social**: Manages chat messaging, post creation, and comments.
- **Blockchain Verification**: Validates digital credentials and transaction logs.
- **Market & Finance**: Runs financial simulation tools and user portfolio tracking.
- **AI Assistant**: Provides academic advising, grade insights, and assistant features.

---

## 3. Real-Time WebSockets

FastAPI manages WebSocket connections natively:
- **Chat Room**: `/api/ws/chat` delivers real-time direct messages and channel posts.
- **Sports Analytics**: `/ws/analytics` (Port 8000) streams live player tracking data at 30 FPS.

