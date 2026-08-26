# Client API Integration Guide

This guide details the REST API endpoints and WebSocket formats used by the desktop app.

---

## 1. Authentication

### User Login
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "admin@campusx.edu",
    "password": "admin123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": {
      "id": "usr_001",
      "name": "Dr. Evelyn Sterling",
      "role": "admin",
      "department": "CS"
    }
  }
  ```

---

## 2. Academics & ERP

### Get User List
- **Endpoint**: `GET /api/users`
- **Response**: List of student and faculty user accounts.

### Get Applications
- **Endpoint**: `GET /api/admissions/applications`
- **Response**: List of pending admissions applications.

### Mark Attendance
- **Endpoint**: `POST /api/attendance`
- **Request Body**:
  ```json
  {
    "studentId": "STU001",
    "courseCode": "CS202",
    "date": "2026-07-15",
    "status": "PRESENT"
  }
  ```

---

## 3. Sports Analytics (Port 8000)

### Real-Time Live Feed
- **Protocol**: WebSocket
- **Endpoint**: `ws://localhost:8000/ws/analytics`
- **Sample Message**:
  ```json
  {
    "frame_index": 1042,
    "tracks": [
      { "track_id": 1, "class_id": 0, "team_id": 1, "bbox": [100, 200, 110, 220] }
    ],
    "offside_line": { "defender_x_pixel": 450 },
    "analysis": {
      "possession_team_a": 55,
      "predictions": { "expected_goals_a": 1.45, "expected_goals_b": 1.12 }
    },
    "telemetry": { "latency_ms": 12.5, "fps": 60 }
  }
  ```
- **Role**: Streams player tracking coordinates and match stats at 30 FPS.

