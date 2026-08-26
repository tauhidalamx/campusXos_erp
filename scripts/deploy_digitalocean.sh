#!/bin/bash
# ==============================================================================
# CAMPUSX OS - DIGITAL OCEAN DEPLOYMENT AUTOMATION SCRIPT
# Deploy to Digital Ocean App Platform or Container Registry
# ==============================================================================

set -e

echo "================================================================================"
echo "      CAMPUSX OS - DIGITAL OCEAN AUTOMATED DEPLOYMENT PIPELINE                 "
echo "================================================================================"

# 1. Check prerequisites
if ! command -v doctl &> /dev/null; then
    echo "ℹ Notice: 'doctl' (Digital Ocean CLI) is not installed on local host."
    echo "  App Platform automated Git deployment spec is ready at: .do/app.yaml & app.yaml"
    echo "------------------------------------------------------------------------"
fi

if command -v docker &> /dev/null; then
    if docker info &> /dev/null; then
        echo "✓ Docker CLI & Daemon active. Verifying production container build..."
        docker build -t campusx-os:latest .
        echo "✓ Docker build verified!"
    else
        echo "ℹ Docker CLI installed, daemon offline. Skipping local image build."
    fi
else
    echo "ℹ Docker not detected locally. Image building will run on Digital Ocean servers."
fi

echo ""
echo "------------------------------------------------------------------------"
echo "DIGITAL OCEAN DEPLOYMENT READY:"
echo "------------------------------------------------------------------------"
echo "1. DIGITAL OCEAN APP PLATFORM (Git-driven):"
echo "   • Connect this repository on https://cloud.digitalocean.com/apps"
echo "   • App Platform will use .do/app.yaml or Dockerfile automatically"
echo "   • Healthcheck endpoint: /api/health"
echo ""
echo "2. DIGITAL OCEAN DROPLET:"
echo "   • Spin up Ubuntu Droplet"
echo "   • Run: bash scripts/deploy_droplet.sh"
echo "================================================================================"
