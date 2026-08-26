# CAMPUSX OS Kivy Client - Deployment Guide

This document outlines deployment configurations, environment variables, and client settings.

---

## 1. Client Environment Variables

When running the compiled binary or script in production, configure the target network endpoints:

```bash
# REST API endpoint for NestJS/Express core server
export CAMPUSX_API_URL="https://campusx-api.yourdomain.edu/api"

# REST API endpoint for FastAPI Sports CV microservice
export CAMPUSX_SPORTS_API_URL="https://sports-api.yourdomain.edu/api"

# WebSockets endpoint for sports match telemetry
export CAMPUSX_SPORTS_WS_URL="wss://sports-api.yourdomain.edu/ws/analytics"
```

---

## 2. Configuration Settings

Local settings are preserved inside `campusx_offline_cache.db` under the `local_settings` table:

- **Theme Mode**: Stores light/dark status preference.
- **Biometric Enabled**: Stores fingerprint login preference.
- **Cache Timeout**: Time-to-live settings for local API cache tables (default is 24 hours).

---

## 3. Network Ports Cheat-Sheet

Ensure firewall routing rules allow the client to establish outgoing TCP connections to:

| Service | Port | Protocol | Description |
|---|---|---|---|
| Core ERP API | 5000 | HTTPS / WebSockets | JWT authentication, profiles, lists |
| NextJS Portal | 3000 | HTTPS | Webview portals |
| Sports CV OS | 8000 | HTTPS / WSS | CV tracking radar streams |
| S3 Storage | 9000 | HTTPS | Document PDF uploads/downloads |
