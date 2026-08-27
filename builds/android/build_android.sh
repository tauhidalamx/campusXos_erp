#!/bin/bash
# =====================================================================
# CAMPUSX OS - Android Compilation Script
# Automates the buildozer setup and compilation process.
# Run this inside a terminal in builds/android/
# =====================================================================

set -e

echo "[1/3] Installing dependencies for Android build..."
pip install buildozer cython virtualenv

echo "[2/3] Verifying buildozer configuration..."
if [ ! -f "buildozer.spec" ]; then
    echo "Error: buildozer.spec not found!"
    exit 1
fi

echo "[3/3] Compiling CAMPUSX OS Android application (.apk) using Buildozer..."
buildozer -v android debug

echo "====================================================================="
echo "Build complete! APK package is located in builds/android/bin/"
echo "====================================================================="
