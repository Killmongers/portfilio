#!/bin/bash

echo "🚀 Deploying to Render"
echo "====================="

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml not found!"
    echo "💡 Make sure you have the render.yaml file in your project root"
    exit 1
fi

echo "📋 Deployment checklist:"
echo "✅ render.yaml configured"
echo "✅ Dockerfiles created"
echo "✅ Environment variables set"
echo ""
echo "📝 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Connect your GitHub repo to Render"
echo "3. Render will automatically deploy using render.yaml"
echo ""
echo "🌐 Your services will be available at:"
echo "   Backend:  https://portfolio-backend.onrender.com"
echo "   Frontend: https://portfolio-frontend.onrender.com"

