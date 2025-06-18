#!/bin/bash

echo "🔍 Testing Backend Connection..."
echo "================================"

# Test if backend is running
echo "1. Testing backend health..."
curl -s http://127.0.0.1:8000/health | jq '.' || echo "❌ Backend not responding"

echo ""
echo "2. Testing portfolio API..."
curl -s http://127.0.0.1:8000/api/portfolio | jq '.personalInfo.name' || echo "❌ Portfolio API not working"

echo ""
echo "3. Testing projects API..."
curl -s http://127.0.0.1:8000/api/projects | jq 'length' || echo "❌ Projects API not working"

echo ""
echo "4. Testing CORS headers..."
curl -s -I -X OPTIONS http://127.0.0.1:8000/api/portfolio \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" | grep -i "access-control"

echo ""
echo "✅ Connection test complete!"

