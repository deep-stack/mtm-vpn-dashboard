#!/bin/bash

# Laconic Registry CLI Docker wrapper script
# This script wraps the Docker command to run laconic registry CLI commands
# Run this script from the deploy directory

# Check if docker is available
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed or not in PATH"
    exit 1
fi

# Check if the cerc/laconic-registry-cli image exists
if ! docker image inspect cerc/laconic-registry-cli &> /dev/null; then
    echo "Error: cerc/laconic-registry-cli Docker image not found"
    echo "Please build the image first: docker build -t cerc/laconic-registry-cli ."
    exit 1
fi

# Get current directory (should be deploy directory)
CURRENT_DIR="$(pwd)"
PROJECT_ROOT="$(dirname "$CURRENT_DIR")"

# Verify we're in the deploy directory
if [ ! -f "config.yml" ] || [ ! -f "laconic-cli.sh" ]; then
    echo "Error: This script must be run from the deploy directory"
    echo "Current directory: $CURRENT_DIR"
    echo "Please cd to the deploy directory and run: ./laconic-cli.sh"
    exit 1
fi

# Set up volume mounts
DEPLOY_MOUNT="-v $CURRENT_DIR:/app/deploy"
OUT_MOUNT=""

# Create out directory if it doesn't exist and always mount it
if [ ! -d "out" ]; then
    mkdir -p "out"
fi
OUT_MOUNT="-v $CURRENT_DIR/out:/app/out"

# Run the Docker command with processed arguments
docker run --rm \
    --add-host=host.docker.internal:host-gateway \
    $DEPLOY_MOUNT \
    $OUT_MOUNT \
    -w /app/deploy \
    cerc/laconic-registry-cli \
    laconic registry -c config.yml \
    "$@"
