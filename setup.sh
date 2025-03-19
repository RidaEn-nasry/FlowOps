#!/bin/bash

# FlowOps Setup Script
# This script helps set up FlowOps for local development

echo "🚀 Setting up FlowOps for development..."

# Create environment files
echo "📄 Creating environment files..."
cp .env.example .env.dev
cp client/.env.example client/.env.development

# Configure for local development
echo "⚙️ Configuring for local development..."
sed -i.bak 's/# MONGODB_URI=mongodb:\/\/localhost:27017\/flowops/MONGODB_URI=mongodb:\/\/localhost:27017\/flowops/g' .env.dev
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
echo "To start the backend service:"
echo "  cd FlowOps"
echo "  npm run start:dev"
echo ""
echo "To start the frontend:"
echo "  cd client"
echo "  npm run dev"
echo ""
echo "For more information, check the README.md file." 