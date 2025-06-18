#!/bin/bash

echo "🐳 Building Docker Images for Portfolio"
echo "======================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build backend image
echo "📦 Building Backend Image..."
docker build -f Dockerfile.backend -t portfolio-backend . || {
    echo "❌ Backend build failed"
    exit 1
}

# Build frontend image  
echo "📦 Building Frontend Image..."
docker build -f Dockerfile.frontend -t portfolio-frontend . || {
    echo "❌ Frontend build failed"
    exit 1
}

echo ""
echo "✅ Docker images built successfully!"
echo ""
echo "📋 Available images:"
docker images | grep portfolio

echo ""
echo "🚀 To run locally:"
echo "   docker-compose up"
echo ""
echo "🧪 To test individual containers:"
echo "   docker run -p 8000:8000 portfolio-backend"
echo "   docker run -p 3000:3000 portfolio-frontend"
echo ""
echo "🌐 To run in production:"
echo "   docker-compose -f docker-compose.yml up"

