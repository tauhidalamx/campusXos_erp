# CMake Build Guide

This guide covers CMake targets and build commands for CampusX C++.

---

## 1. Modular Target Layout

The codebase separates application logic from UI components:

```
                            +----------------------+
                            |      Executable      |
                            |       CampusXOS      |
                            +----------+-----------+
                                       |
                                       v
                            +----------------------+
                            |      UI Library      |
                            |     CampusXUiLib     |
                            +----------+-----------+
                                       |
                                       v
                            +----------------------+
                            |     Core Library     |
                            |    CampusXCoreLib    |
                            +----------------------+
```

---

## 2. CMake Targets

### CampusXCoreLib
- **Sources**: `core/CampusXCore.cpp`, `core/ApiClient.cpp`
- **Libraries**: `Qt6::Network`, `Qt6::Sql`
- **Role**: Handles logging, local SQLite storage, and network communication.

### CampusXUiLib
- **Sources**: Theme engine, animations, settings windows, and workspace widgets.
- **Libraries**: `CampusXCoreLib`, `Qt6::Widgets`, `Qt6::WebSockets`
- **Role**: Renders UI components, themes, and transitions.

### CampusXOS
- **Sources**: `main.cpp`
- **Role**: Main GUI application launcher.

---

## 3. How to Build

To configure and build the application:

```bash
cd campusx_native_cpp
mkdir build && cd build

# Configure build with C++23
cmake ..

# Build release binary
cmake --build . --config Release
```

