#!/bin/bash

# FlowOps Development Environment Runner
# This script helps verify and start the FlowOps development environment

echo "🚀 Preparing FlowOps development environment..."

# Check if Docker is installed and running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Error: Docker is not running or not installed."
  echo "Please start Docker and try again."
  exit 1
fi

# Verify .env.dev exists
if [ ! -f .env.dev ]; then
  echo "❌ Error: .env.dev file not found."
  echo "Creating from example..."
  cp .env.example .env.dev
  echo "⚠️ Please review and update .env.dev with your configurations."
  exit 1
fi

# Verify client/.env.dev exists
if [ ! -f client/.env.dev ]; then
  echo "❌ Error: client/.env.dev file not found."
  echo "Creating from example..."
  cp client/.env.example client/.env.dev
  echo "⚠️ Please review and update client/.env.dev with your configurations."
  exit 1
fi

# Verify mandatory environment variables
source .env.dev
REQUIRED_VARS=("APP_NAME" "APP_PORT" "MONGODB_URI")
MISSING_VARS=()

for VAR in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!VAR}" ]; then
    MISSING_VARS+=("$VAR")
  fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
  echo "❌ Error: The following required environment variables are missing in .env.dev:"
  for VAR in "${MISSING_VARS[@]}"; do
    echo "  - $VAR"
  done
  echo "Please update your .env.dev file and try again."
  exit 1
fi

# Fix potential Docker Compose command issues
if [ -f "dockercompose.dev.yml" ] && [ ! -f "docker-compose.dev.yml" ]; then
  echo "⚠️ Warning: Found 'dockercompose.dev.yml' instead of 'docker-compose.dev.yml'"
  echo "Creating correct filename..."
  cp dockercompose.dev.yml docker-compose.dev.yml
fi

# Start Docker Compose
echo "🚀 Starting FlowOps development environment..."
docker compose -f docker-compose.dev.yml up --build

# The script will return control when docker-compose is stopped
echo "👋 FlowOps development environment has been stopped." 