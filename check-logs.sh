#!/bin/bash

# FlowOps Development Environment Log Checker
# This script helps check logs from different services

show_help() {
  echo "Usage: ./check-logs.sh [SERVICE]"
  echo ""
  echo "SERVICE options:"
  echo "  all      - Show logs for all services"
  echo "  api      - Show API service logs"
  echo "  client   - Show Client logs"
  echo "  mongodb  - Show MongoDB logs"
  echo ""
  echo "Example: ./check-logs.sh api"
}

if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
  show_help
  exit 0
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Error: Docker is not running."
  exit 1
fi

# Check if containers are running
if ! docker compose -f docker-compose.dev.yml ps > /dev/null 2>&1; then
  echo "❌ Error: Docker Compose services are not running."
  echo "Try starting them with: ./run-dev.sh"
  exit 1
fi

case "$1" in
  "all")
    echo "📋 Showing logs for all services..."
    docker compose -f docker-compose.dev.yml logs --tail=100 -f
    ;;
  "api")
    echo "📋 Showing API service logs..."
    docker compose -f docker-compose.dev.yml logs --tail=100 -f api
    ;;
  "client")
    echo "📋 Showing Client logs..."
    docker compose -f docker-compose.dev.yml logs --tail=100 -f client
    ;;
  "mongodb")
    echo "📋 Showing MongoDB logs..."
    docker compose -f docker-compose.dev.yml logs --tail=100 -f mongodb
    ;;
  *)
    echo "❌ Error: Invalid service name: $1"
    show_help
    exit 1
    ;;
esac 