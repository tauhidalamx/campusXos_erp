# C++ Packaging Guide

This guide describes how to build and package standalone installers for CampusX C++.

---

## 1. Native Build Commands

Set up CMake and build inside the project directory:

```bash
cd campusx_native_cpp
mkdir build && cd build
cmake ..
cmake --build .
```

---

## 2. Packaging Installers

### Windows
- Collect Qt dependencies with **windeployqt**:
  ```cmd
  windeployqt --release CampusXOS.exe
  ```
- Build an installer package using **Inno Setup** or **WiX** (`.msi`).

### macOS
- Package Qt framework dependencies into the `.app` bundle:
  ```bash
  macdeployqt CampusXOS.app -dmg
  ```
- Creates a mountable `CampusXOS.dmg` installer.

### Linux
- Use **linuxdeployqt** to bundle the client into a single **AppImage** binary.

