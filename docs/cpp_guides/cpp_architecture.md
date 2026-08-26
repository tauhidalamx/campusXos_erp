# C++ Architecture Guide

This document outlines the architecture, directory structure, and component flows of the Qt 6 C++ client app.

---

## 1. System Overview

The C++ desktop app communicates with the FastAPI backend using REST and WebSockets:

```mermaid
graph TD
    A[Qt6 C++ Client] -->|QtNetwork REST| B[FastAPI Backend: Port 8001]
    A -->|QtWebSockets| B
    B -->|Database Operations| C[(SQLAlchemy DB)]
```

---

## 2. Directory Structure

- **`CMakeLists.txt`**: Build configuration.
- **`core/`**: Core logic and networking:
  - `CampusXCore`: Plugins, IPC, and configuration settings.
  - `ApiClient`: HTTP client with local SQLite offline caching.
  - `ThemeManager`: Dynamic stylesheet loader.
- **`ui/`**: User interface components:
  - `LoginWindow`: Login and auth UI.
  - `DashboardWindow`: Main window container and navigation router.
- **`ui/modules/`**: Application views (Academics, Connect, Chain, Market, Sports).

---

## 3. Component Lifecycle

```mermaid
sequenceDiagram
    participant Window as DashboardWindow
    participant Stack as QStackedWidget
    participant Module as SportsModule
    participant Net as ApiClient

    Window->>Stack: setCurrentIndex(4)
    Stack->>Module: Load view
    Module->>Net: Connect WebSocket
    Net-->>Module: Receive data stream
    Module->>Module: Update UI
```

