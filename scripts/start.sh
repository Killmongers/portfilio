#!/bin/bash

echo "🚀 Starting Portfolio Development Environment"
echo "============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Check if ports are available
if check_port 3000; then
    echo "⚠️  Port 3000 is already in use. Please stop the existing Next.js server."
    exit 1
fi

if check_port 8000; then
    echo "⚠️  Port 8000 is already in use. Please stop the existing FastAPI server."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🐍 Starting FastAPI Backend..."
cd scripts
python3 fastapi_backend.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

echo "⚛️  Starting Next.js Frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting up!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8000"
echo "👨‍💼 Admin:    http://localhost:3000/admin"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait

