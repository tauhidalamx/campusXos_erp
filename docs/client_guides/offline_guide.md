# Offline Mode Guide

This guide explains how offline synchronization, local database caching, and fallback login work when there is no internet connection.

---

## 1. Local Cache Storage

When offline, the application reads data from a local SQLite database named `campusx_offline_cache.db`:

```
  +-------------------------------------------------------------+
  |                   campusx_offline_cache.db                  |
  |                                                             |
  |  +-------------------------------------------------------+  |
  |  |                      api_cache                        |  |
  |  |  [endpoint (PK)] | [response_json] | [timestamp]      |  |
  |  +-------------------------------------------------------+  |
  |  |                     local_settings                    |  |
  |  |  [key (PK)]      | [value]                            |  |
  |  +-------------------------------------------------------+  |
  +-------------------------------------------------------------+
```

---

## 2. Offline Login

If the server at `http://localhost:5000/api/auth/login` is unreachable, `api.py` switches to local authentication:

1. Looks up the entered email address.
2. Compares credentials against demo accounts:
   - **Admin**: `admin@campusx.edu` / `admin123`
   - **Student**: `student@campusx.edu` / `student123`
   - **Faculty**: `faculty@campusx.edu` / `faculty123`
3. Reads cached user profiles from the `api_cache` table.
4. Logs into **Offline Mode** if credentials match.

---

## 3. Data Synchronization

- **Reading Data (GET)**: When connected, responses from endpoints like `/users` or `/posts` are stored in `api_cache` so they remain readable offline.
- **Saving Data (POST)**: Modifying server data requires an active connection. While offline, the app notifies the user to re-establish a connection before saving changes.

