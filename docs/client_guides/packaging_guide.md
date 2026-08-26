# CAMPUSX OS Kivy Client - Packaging Guide

This document outlines bundling parameters to package standalone software binaries for Windows, macOS, Linux, and Android.

---

## 1. Desktop Compilations (PyInstaller)

We use PyInstaller to compile code and assets into standalone software.

### Generating Windows Executable (.exe)
1. Initialize virtual environment:
   ```bash
   source .venv/bin/activate
   pip install pyinstaller
   ```
2. Build binary:
   ```bash
   pyinstaller CampusXOS.spec --noconfirm
   ```
3. Standalone output folder will be exported at `dist/CampusXOS/CampusXOS.exe`.

### Generating macOS Application Bundle (.app / .dmg)
1. Install packaging tools:
   ```bash
   pip install pyinstaller dmgbuild
   ```
2. Compile app structure:
   ```bash
   pyinstaller CampusXOS.spec --noconfirm
   ```
3. Creates `dist/CampusXOS.app`.
4. Run `dmgbuild` to generate macOS installer:
   ```bash
   dmgbuild -s dmg_settings.py "CAMPUSX OS Installer" dist/CampusXOS.dmg
   ```

---

## 2. Android compilation (Buildozer)

Buildozer packages the Python code and downloads the Android NDK/SDK to generate native APK/AAB files.

### Configuration (`buildozer.spec`)
Ensure the following properties are defined:
```ini
requirements = python3,kivy==2.3.1,requests,urllib3,certifi,charset_normalizer,idna,websockets
android.permissions = INTERNET, READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE
android.api = 33
android.minapi = 21
```

### Compiling APK
Execute Buildozer inside Ubuntu or WSL terminal:
```bash
# Compile debug APK
buildozer -v android debug

# Compile release App Bundle for Google Play Store upload
buildozer -v android release
```
The output APK will be written in the `bin/` directory.
