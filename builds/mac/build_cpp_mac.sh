#!/bin/bash
# -*- coding: utf-8 -*-
# CAMPUSX OS - C++ Native Client macOS Bundler Script

set -e

echo "=== Starting C++ Qt6 macOS Compilation Pipeline ==="

# 1. Clean previous build folders
rm -rf campusx_native_cpp/build dist/CampusXOS_Native.dmg

# 2. Check for compiler
if ! command -v clang++ &> /dev/null; then
    echo "Error: clang++ compiler is not available."
    exit 1
fi

# 3. Configure and compile C++23 code using CMake
echo "Configuring C++ project build directory with CMake..."
if command -v cmake &> /dev/null; then
    cmake -S campusx_native_cpp -B campusx_native_cpp/build -DCMAKE_BUILD_TYPE=Release
    
    echo "Compiling C++ binary targets..."
    cmake --build campusx_native_cpp/build --config Release
    
    # 4. Resolve Qt framework links using macdeployqt
    if command -v macdeployqt &> /dev/null; then
        echo "Injecting Qt frameworks using macdeployqt..."
        macdeployqt campusx_native_cpp/build/CampusXOS.app
        
        echo "Applying Apple Silicon codesign signature and clearing Gatekeeper..."
        codesign --force --deep --sign - campusx_native_cpp/build/CampusXOS.app
        xattr -cr campusx_native_cpp/build/CampusXOS.app
        
        echo "Creating DMG installer..."
        mkdir -p dist
        rm -f dist/CampusXOS_Native.dmg
        hdiutil create -volname "CampusXOS" -srcfolder campusx_native_cpp/build/CampusXOS.app -ov -format UDZO dist/CampusXOS_Native.dmg
        echo "=== C++ macOS Build Finished Successfully: dist/CampusXOS_Native.dmg ==="
    else
        echo "macdeployqt not found. Output raw app: campusx_native_cpp/build/CampusXOS.app"
    fi
else
    echo "Warning: 'cmake' is not installed. C++ build skipped."
fi
