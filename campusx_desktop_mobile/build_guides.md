# CAMPUSX OS Compilation & Build Guides

This document outlines the step-by-step instructions to compile and build the CAMPUSX OS Kivy Python application into native software for **Windows**, **macOS (MacBook)**, and **Android**.

---

## 1. Prerequisites

Ensure you have the virtual environment initialized and Kivy dependencies installed:
```bash
# Initialize and activate venv
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

Create a `requirements.txt` file in the root containing:
```text
kivy==2.3.1
requests==2.32.5
```

---

## 2. Compiling for Windows (.exe)

We use **PyInstaller** to bundle the Python code, assets, and Kivy libraries into a standalone executable.

1. Install PyInstaller inside the virtual environment:
   ```bash
   pip install pyinstaller
   ```
2. Generate the executable using the following configuration (adds necessary hooks for Kivy):
   ```bash
   pyinstaller --name="CampusXOS" --onedir --windowed --noconfirm main.py
   ```
3. Kivy requires specific asset linking. Update the generated `CampusXOS.spec` file's `Analysis` block to include Kivy's hooks, or compile directly using:
   ```bash
   python -m PyInstaller --name="CampusXOS" --windowed main.py
   ```
4. The output executable will be located in the `dist/CampusXOS/` folder. Double-click `CampusXOS.exe` to run.

---

## 3. Compiling for macOS / MacBook (.app / .dmg)

On macOS, we package the Kivy application into an `.app` bundle, then wrap it in a `.dmg` installer.

1. Install PyInstaller and `dmgbuild`:
   ```bash
   pip install pyinstaller dmgbuild
   ```
2. Compile into an App Bundle:
   ```bash
   pyinstaller --name="CampusXOS" --windowed --noconfirm main.py
   ```
3. This creates `dist/CampusXOS.app`.
4. Create a DMG volume. Set up a `dmg_settings.py` file or run:
   ```bash
   dmgbuild -s dmg_settings.py "CAMPUSX OS Installer" dist/CampusXOS.dmg
   ```

---

## 4. Compiling for Android (.apk)

We use **Buildozer**, the official toolchain developed by the Kivy team, to compile Python apps into Android `.apk` packages.

> [!NOTE]
> Android compilation requires a Linux environment (Ubuntu is recommended) or macOS. On Windows, you should run this inside a WSL (Windows Subsystem for Linux) container.

1. Install buildozer and dependencies:
   ```bash
   pip install buildozer
   ```
2. Initialize buildozer project configuration:
   ```bash
   buildozer init
   ```
   This generates a `buildozer.spec` configuration file.
3. Configure `buildozer.spec` with these essential properties:
   ```ini
   title = CAMPUSX OS System Software
   package.name = campusxos
   package.domain = edu.campusx
   source.dir = .
   source.include_exts = py,png,jpg,kv,json
   requirements = python3,kivy==2.3.1,requests,urllib3,certifi,charset_normalizer,idna
   orientation = landscape
   osx.kivy_version = 2.3.1
   android.api = 33
   android.minapi = 21
   android.sdk = 33
   android.permissions = INTERNET
   ```
4. Compile the APK package in debug mode:
   ```bash
   buildozer -v android debug
   ```
5. Deploy and run on a connected Android phone via ADB:
   ```bash
   buildozer android deploy run
   ```
   The generated `.apk` will be output in the `bin/` directory (e.g., `bin/campusxos-0.1-debug.apk`).
