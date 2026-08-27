# =============================================================================
# CAMPUSX OS - Buildozer Android Specification
# Ready-to-build configuration file for building the Android package (.apk).
# =============================================================================

[app]
title = CAMPUSX OS System Software
package.name = campusxos
package.domain = edu.campusx

# Source directory pointing to the local Flask webview workspace
source.dir = .

# Include file patterns
source.include_exts = py,png,jpg,kv,json

# Application version
version = 1.0.0

# Flask and python requirements for WebView Bootstrap
requirements = python3,flask,requests,urllib3,certifi,charset_normalizer,idna

# Orientation support
orientation = landscape

# Fullscreen mode
fullscreen = 1

# Android SDK / API Configuration
android.api = 33
android.minapi = 21
android.sdk = 33
android.ndk = 25b

# Requested Android permissions
android.permissions = INTERNET

# Use WebView bootstrap instead of SDL2
android.bootstrap = webview

# Build specifications
android.gradle_dependencies = 
android.archs = arm64-v8a, armeabi-v7a

# Output settings
[buildozer]
log_level = 2
warn_on_root = 1
