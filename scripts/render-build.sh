#!/bin/bash

echo "🚀 Render Build Script"
echo "====================="

# Set npm configuration for dependency resolution
echo "📦 Configuring npm for dependency resolution..."
npm config set legacy-peer-deps true
npm config set auto-install-peers true

# Clear npm cache
echo "🧹 Clearing npm cache..."
npm cache clean --force

# Install dependencies with legacy peer deps
echo "📥 Installing dependencies..."
npm install --legacy-peer-deps --no-audit --no-fund

# Verify Next.js installation
echo "🔍 Verifying Next.js installation..."
if command -v npx next &> /dev/null; then
    echo "✅ Next.js found"
    npx next --version
else
    echo "❌ Next.js not found, installing globally..."
    npm install -g next@15.3.3
fi

# Build the application
echo "🏗️  Building application..."
npm run build

echo "✅ Build complete!"

