#!/bin/bash
# ==============================================================================
# CAMPUSX OS - MACBOOK M4 (APPLE SILICON ARM64) NATIVE BUNDLER & INSTALLER SCRIPT
# Build, bundle, codesign, and package native M4 macOS App & DMG
# ==============================================================================

set -e

echo "================================================================================"
echo "   CAMPUSX OS - MACBOOK M4 (ARM64) NATIVE MACOS APP COMPILATION PIPELINE        "
echo "================================================================================"
uname -a
echo "Architecture: $(uname -m)"
echo "------------------------------------------------------------------------"

# 1. Clean previous build artifacts
rm -rf dist/CampusXOS_M4.app dist/CampusXOS_M4.dmg builds/mac/build_m4

# 2. Activate virtual environment
if [ -f ".venv/bin/activate" ]; then
    echo "Activating Python virtual environment..."
    source .venv/bin/activate
fi

# 3. Build standalone M4 App bundle using PyInstaller
echo "Compiling native Apple Silicon (arm64) executable with PyInstaller..."
pyinstaller \
    --name="CampusXOS_M4" \
    --windowed \
    --noconfirm \
    --clean \
    --target-arch="arm64" \
    --workpath="builds/mac/build_m4" \
    --add-data="campusx_desktop_mobile/campusx_app.kv:." \
    campusx_desktop_mobile/main.py

# 4. Codesign for Apple Silicon M4 execution
if [ -d "dist/CampusXOS_M4.app" ]; then
    echo "Applying Apple Silicon ad-hoc codesign signature..."
    codesign --force --deep --sign - dist/CampusXOS_M4.app
    
    echo "Clearing Gatekeeper quarantine flags for flawless local execution..."
    xattr -cr dist/CampusXOS_M4.app
    
    echo "Verifying Apple Silicon binary architecture:"
    file dist/CampusXOS_M4.app/Contents/MacOS/CampusXOS_M4
fi

# 5. Generate DMG volume package
if command -v hdiutil &> /dev/null; then
    echo "Generating DMG volume package for macOS M4..."
    rm -f dist/CampusXOS_M4.dmg
    hdiutil create -volname "CampusX OS M4" -srcfolder dist/CampusXOS_M4.app -ov -format UDZO dist/CampusXOS_M4.dmg
fi

echo "================================================================================"
echo "✔ MACBOOK M4 APP BUILD FINISHED SUCCESSFULLY!"
echo "  • App Bundle: dist/CampusXOS_M4.app"
if [ -f "dist/CampusXOS_M4.dmg" ]; then
    echo "  • DMG Volume: dist/CampusXOS_M4.dmg"
fi
echo "================================================================================"
