#!/bin/bash

# FlowOps Setup Script
# This script helps set up FlowOps for local development

echo "🚀 Setting up FlowOps for development..."

# Create environment files
echo "📄 Creating environment files..."
cp .env.example .env.dev
cp client/.env.example client/.env.development

# Uncomment local development settings in .env.dev
echo "⚙️ Configuring for local development..."
sed -i.bak 's/# MONGODB_URI=mongodb:\/\/localhost:27017\/flowops/MONGODB_URI=mongodb:\/\/localhost:27017\/flowops/g' .env.dev
sed -i.bak 's/# WORKFLOW_DATABASE_URL=mongodb:\/\/localhost:27017\/workflow/WORKFLOW_DATABASE_URL=mongodb:\/\/localhost:27017\/workflow/g' .env.dev
sed -i.bak 's/# MEMORY_DATABASE_URL=mongodb:\/\/localhost:27017\/memory/MEMORY_DATABASE_URL=mongodb:\/\/localhost:27017\/memory/g' .env.dev
sed -i.bak 's/# RABBITMQ_URI=amqp:\/\/guest:guest@localhost:5672/RABBITMQ_URI=amqp:\/\/guest:guest@localhost:5672/g' .env.dev
sed -i.bak 's/# SERVICES_WORKFLOW_URL=http:\/\/localhost:3001/SERVICES_WORKFLOW_URL=http:\/\/localhost:3001/g' .env.dev
sed -i.bak 's/# SERVICES_MEMORY_URL=http:\/\/localhost:3002/SERVICES_MEMORY_URL=http:\/\/localhost:3002/g' .env.dev
rm .env.dev.bak

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd FlowOps
npm install
npm run prisma:generate

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../client
npm install

echo "✅ Setup complete!"
echo ""
echo "To start the backend services:"
echo "  cd FlowOps"
echo "  npm run start:services"
echo ""
echo "To start the frontend:"
echo "  cd client"
echo "  npm run dev"
echo ""
echo "For more information, check the README.md file." 