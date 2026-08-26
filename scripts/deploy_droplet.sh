#!/bin/bash
# ==============================================================================
# CAMPUSX OS - DIGITAL OCEAN DROPLET SETUP SCRIPT (UBUNTU)
# Bootstrap Node.js 20, Docker, Docker Compose, Nginx, and Systemd Service
# ==============================================================================

set -e

echo "=== Setting up DigitalOcean Droplet for CampusX OS ==="

# 1. Update system packages
sudo apt-get update && sudo apt-get upgrade -y

# 2. Install Node.js 20 and Docker
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

if ! command -v docker &> /dev/null; then
    sudo apt-get install -y docker.io docker-compose
    sudo systemctl enable --now docker
fi

if ! command -v nginx &> /dev/null; then
    sudo apt-get install -y nginx
fi

# 3. Clone / setup app directory
APP_DIR="/opt/campusx-os"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# 4. Build and start application via Docker Compose
if [ -f "$APP_DIR/docker-compose.yml" ]; then
    cd $APP_DIR
    docker-compose up -d --build
    echo "✓ CampusX OS running on Docker port 5000"
fi

echo "=== DigitalOcean Droplet Deployment Completed ==="
