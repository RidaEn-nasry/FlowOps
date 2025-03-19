#!/bin/bash

# Simple script to check the status of all services

echo "🔍 Checking service status..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker first."
  exit 1
fi

# Check container status
echo "📊 Container Status:"
docker compose -f docker-compose.dev.yml ps

# Log a short snippet from each service
echo -e "\n📋 Recent Logs Summary:"

SERVICES=("api" "client" "mongodb")

for service in "${SERVICES[@]}"; do
  echo -e "\n--- $service ---"
  docker compose -f docker-compose.dev.yml logs --tail=10 $service 2>/dev/null || echo "⚠️ No logs available"
done

# Check if services are responding
echo -e "\n🌐 Service Connectivity:"

# API
echo -n "API (http://localhost:3000): "
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "Not responding"

# Client
echo -e "\nClient (http://localhost:5173): "
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 || echo "Not responding"

echo -e "\n✅ Check complete." 