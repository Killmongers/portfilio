#!/bin/bash

echo "🚀 Setting up Portfolio Project"
echo "==============================="

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p data
mkdir -p logs
mkdir -p scripts

# Set proper permissions
echo "🔐 Setting permissions..."
chmod 755 data
chmod 755 logs
chmod 755 scripts

# Make scripts executable
echo "⚡ Making scripts executable..."
chmod +x scripts/*.sh

# Install Node.js dependencies
if [ -f "package.json" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
else
    echo "⚠️  package.json not found, skipping npm install"
fi

# Install Python dependencies
if [ -f "scripts/requirements.txt" ]; then
    echo "🐍 Installing Python dependencies..."
    pip install -r scripts/requirements.txt
else
    echo "⚠️  requirements.txt not found, skipping pip install"
fi

# Create initial data files if they don't exist
echo "📄 Creating initial data files..."
if [ ! -f "data/portfolio_data.json" ]; then
    echo "{}" > data/portfolio_data.json
fi

if [ ! -f "data/contact_messages.json" ]; then
    echo "[]" > data/contact_messages.json
fi

echo ""
echo "✅ Project setup complete!"
echo ""
echo "🐳 To run with Docker:"
echo "   docker-compose up"
echo ""
echo "💻 To run locally:"
echo "   npm run dev (frontend)"
echo "   python scripts/fastapi_backend.py (backend)"
echo ""
echo "🌐 To deploy to Render:"
echo "   1. Push to GitHub"
echo "   2. Connect repo to Render"
echo "   3. Use Blueprint deployment"

