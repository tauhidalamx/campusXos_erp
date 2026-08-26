# Database Schema Guide

This guide covers the database tables and relationships defined in [models.py](file:///Users/tauhidalam/antygravity/campusx_backend_python/models.py).

---

## 1. Schema Diagram (ERD)

```
  +-------------+          +---------------+          +------------+
  |    users    |          |  enrollments  |          |  courses   |
  |  (PK) id    +<--------+  (PK) id       +-------->+  (PK) code  |
  +-------------+          +---------------+          +------------+
         ^
         |
  +------+------+
  | attendance  |
  | (PK) id     |
  +-------------+
```

---

## 2. Main Tables

### users
- **`id`**: Unique user ID (string).
- **`name`**: User's full name.
- **`email`**: User email address (unique).
- **`password`**: Password hash.
- **`role`**: Access role (`student`, `faculty`, `registrar`, `admin`).
- **`department`**: Department name (e.g., Computer Science, Finance).

### courses
- **`code`**: Unique course code (e.g., `CS202`).
- **`title`**: Course name.
- **`credits`**: Course credit hours.

### attendance
- **`id`**: Attendance record ID.
- **`courseCode`**: Linked course code (`courses.code`).
- **`studentId`**: Linked student ID (`users.id`).
- **`date`**: Date recorded (`YYYY-MM-DD`).
- **`status`**: Attendance status (`PRESENT` or `ABSENT`).

