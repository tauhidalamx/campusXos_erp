#!/bin/bash
# -*- coding: utf-8 -*-
# CAMPUSX OS - Python Kivy Client macOS Bundler Script

set -e

echo "=== Starting Python Kivy macOS Compilation Pipeline ==="

# 1. Clean previous build folders
rm -rf dist/CampusXOS_Kivy.app dist/CampusXOS_Kivy.dmg builds/mac/build

# 2. Check virtual environment active
if [ -f ".venv/bin/activate" ]; then
    echo "Activating local Python virtual environment..."
    source .venv/bin/activate
fi

# 3. Build standalone app bundle using PyInstaller
echo "Compiling Python executables with PyInstaller..."
pyinstaller \
    --name="CampusXOS_Kivy" \
    --windowed \
    --noconfirm \
    --clean \
    --workpath="builds/mac/build" \
    --add-data="campusx_desktop_mobile/campusx_app.kv:." \
    campusx_desktop_mobile/main.py

# 4. Generate styled DMG installer volume using dmgbuild
if command -v dmgbuild &> /dev/null; then
    echo "Generating styled DMG volume package..."
    dmgbuild -s builds/mac/dmg_settings.py "CAMPUSX OS Kivy Client" dist/CampusXOS_Kivy.dmg
else
    echo "Warning: 'dmgbuild' is not installed. Exporting raw app bundle instead."
fi

echo "=== Kivy macOS Build Finished Successfully: dist/CampusXOS_Kivy.app ==="
