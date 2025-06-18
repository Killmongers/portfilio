# Docker & Render Deployment Guide

## 🐳 Docker Setup

### Local Development with Docker

1. **Build and run with Docker Compose:**
\`\`\`bash
# Development mode (with hot reload)
docker-compose -f docker-compose.dev.yml up

# Production mode
docker-compose up
\`\`\`

2. **Build individual images:**
\`\`\`bash
# Build backend
docker build -f Dockerfile.backend -t portfolio-backend .

# Build frontend
docker build -f Dockerfile.frontend -t portfolio-frontend .
\`\`\`

3. **Run individual containers:**
\`\`\`bash
# Run backend
docker run -p 8000:8000 portfolio-backend

# Run frontend
docker run -p 3000:3000 portfolio-frontend
\`\`\`

## 🌐 Render Deployment

### Prerequisites
- GitHub account with your portfolio code
- Render account (free tier available)

### Deployment Steps

1. **Push to GitHub:**
\`\`\`bash
git add .
git commit -m "Add Docker configuration for Render deployment"
git push origin main
\`\`\`

2. **Connect to Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect \`render.yaml\`

3. **Configure Environment Variables:**
   - Backend will run on: \`https://your-backend.onrender.com\`
   - Frontend will run on: \`https://your-frontend.onrender.com\`
   - Update CORS settings in backend if needed

### Environment Variables

**Backend:**
- \`PORT\`: 8000 (auto-set by Render)
- \`PYTHONPATH\`: /opt/render/project/src/scripts

**Frontend:**
- \`NODE_ENV\`: production
- \`NEXT_PUBLIC_API_URL\`: https://your-backend.onrender.com

### File Structure
\`\`\`
portfolio/
├── Dockerfile.frontend          # Next.js Docker config
├── Dockerfile.backend           # FastAPI Docker config
├── docker-compose.yml           # Production compose
├── docker-compose.dev.yml       # Development compose
├── render.yaml                  # Render deployment config
├── next.config.mjs             # Next.js config with standalone output
└── scripts/
    ├── fastapi_backend.py      # Updated with Docker support
    ├── docker-build.sh         # Build script
    └── deploy-render.sh         # Deployment helper
\`\`\`

### Render Free Tier Limitations
- Services sleep after 15 minutes of inactivity
- 750 hours/month of runtime
- Persistent disk storage available

### Troubleshooting

**Build Issues:**
- Check Dockerfile syntax
- Verify all dependencies in requirements.txt
- Ensure Next.js builds successfully locally

**Runtime Issues:**
- Check Render logs in dashboard
- Verify environment variables
- Test health endpoints

**CORS Issues:**
- Update CORS origins in FastAPI backend
- Add your Render frontend URL to allowed origins

### Custom Domain (Optional)
- Add custom domain in Render dashboard
- Update CORS settings with your domain
- Configure DNS records
\`\`\`

## 🔧 Configuration Files Explained

### Dockerfile.frontend
- Multi-stage build for optimization
- Standalone Next.js output for smaller image
- Production-ready with proper user permissions

### Dockerfile.backend
- Python 3.11 slim base image
- Health check endpoint
- Persistent data storage in /app/data

### render.yaml
- Blueprint for automatic deployment
- Configures both frontend and backend services
- Sets up persistent disk for data storage
- Free tier configuration

## 🚀 Quick Start Commands

\`\`\`bash
# Local development
docker-compose -f docker-compose.dev.yml up

# Production build
docker-compose up

# Build images
chmod +x scripts/docker-build.sh
./scripts/docker-build.sh

# Deploy to Render
chmod +x scripts/deploy-render.sh
./scripts/deploy-render.sh
\`\`\`

