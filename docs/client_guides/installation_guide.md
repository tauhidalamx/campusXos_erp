# CAMPUSX OS Kivy Client - Installation Guide

This document outlines instructions to configure the Python runtime environment and launch the CAMPUSX OS Kivy client application.

---

## 1. Environment Requirements

- **Python**: Version 3.12+ (Version 3.9+ is supported as fallback).
- **Pip**: Latest version.
- **Operating Systems**: macOS (Apple Silicon or Intel), Windows 10/11, Ubuntu 20.04/22.04 LTS.

---

## 2. Setting Up Virtual Environment

Open your terminal and initialize the workspace environment:

```bash
# Clone or navigate to the workspace
cd antygravity

# Initialize the virtual environment
python3 -m venv .venv

# Activate the virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

---

## 3. Installing Dependencies

Install the packages defined in the requirements file:

```bash
# Upgrade pip to prevent package version conflicts
pip install --upgrade pip

# Install requirements
pip install -r requirements.txt
```

### Core Packages Loaded
- `Kivy==2.3.1`: Cross-platform GUI framework.
- `requests==2.32.5`: HTTP client.
- `websockets`: WebSocket client framework.
- `cryptography`: Local database encryption fallbacks.

---

## 4. Launching the App

To start the Kivy native client locally:

```bash
# Ensure dev servers are running on port 5000/8000
node dev.js

# If dev.js is not launched, execute the Kivy client runner:
./run_kivy.sh
```
