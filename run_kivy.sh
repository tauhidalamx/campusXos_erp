#!/bin/bash
# =====================================================================
# CAMPUSX OS Kivy Client - Runner script
# Runs Kivy inside the virtual environment to ensure all packages match.
# =====================================================================

# Resolve project path
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Verify virtual environment exists
if [ ! -d ".venv" ]; then
    echo "Error: Python virtual environment (.venv) not found!"
    echo "Please build or configure the environment first."
    exit 1
fi

echo "Activating virtual environment..."
source .venv/bin/activate

echo "Launching CAMPUSX OS Kivy application..."
python campusx_desktop_mobile/main.py
