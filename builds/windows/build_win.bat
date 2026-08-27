@echo off
rem =====================================================================
rem CAMPUSX OS - Windows Native Compilation Script
rem This script installs dependencies and builds the Windows executable.
rem Run this inside Command Prompt in the project workspace root.
rem =====================================================================

echo [1/3] Initializing Windows virtual environment...
python -m venv .venv
call .venv\Scripts\activate.bat

echo [2/3] Installing Kivy and packaging requirements...
python -m pip install --upgrade pip
pip install kivy==2.3.1 requests==2.32.5 pyinstaller==6.21.0

echo [3/3] Compiling CAMPUSX OS standalone executable (.exe)...
pyinstaller --name="CampusXOS" --windowed --noconfirm --add-data="campusx_desktop_mobile\campusx_app.kv;." --distpath="builds\windows" --workpath="builds\windows\build" campusx_desktop_mobile\main.py

echo Compilation complete! CampusXOS.exe is located in builds\windows\
pause
