# 🐳 Complete Docker & GitHub Deployment Guide

## 📋 Prerequisites

- Docker installed locally
- GitHub account
- Render account (free tier available)

## 🚀 Quick Start

### 1. Clone and Setup
\`\`\`bash
git clone <your-repo-url>
cd portfolio-fastapi
chmod +x scripts/*.sh
./scripts/setup-project.sh
\`\`\`

### 2. Local Development
\`\`\`bash
# Development mode with hot reload
docker-compose -f docker-compose.dev.yml up

# Production mode
docker-compose up
\`\`\`

### 3. Deploy to Render
\`\`\`bash
# Push to GitHub
git add .
git commit -m "Initial deployment setup"
git push origin main

# Then connect GitHub repo to Render dashboard
\`\`\`

## 📁 Project Structure
\`\`\`
portfolio-fastapi/
├── .gitignore                 # Comprehensive ignore file
├── .dockerignore             # Docker ignore file
├── Dockerfile.frontend       # Next.js container
├── Dockerfile.backend        # FastAPI container
├── docker-compose.yml        # Production setup
├── docker-compose.dev.yml    # Development setup
├── render.yaml              # Render deployment config
├── package.json             # Node.js dependencies
├── next.config.mjs          # Next.js configuration
├── scripts/
│   ├── requirements.txt     # Python dependencies
│   ├── fastapi_backend.py   # Backend application
│   ├── setup-project.sh     # Project setup script
│   └── docker-build.sh      # Docker build script
└── data/                    # Runtime data (gitignored)
\`\`\`

## 🔧 Docker Configuration

### Frontend (Next.js)
- **Multi-stage build** for optimization
- **Automatic package installation** from package.json
- **Standalone output** for smaller containers
- **Health checks** for monitoring
- **Non-root user** for security

### Backend (FastAPI)
- **Python 3.11 slim** base image
- **Automatic pip install** from requirements.txt
- **Persistent data storage** in /app/data
- **Health checks** and monitoring
- **Non-root user** for security

## 🌐 Render Deployment

### Automatic Features
- **Blueprint deployment** from render.yaml
- **Docker-based** builds
- **Persistent disk** for data storage
- **Environment variables** auto-configured
- **Health monitoring** built-in
- **Auto-scaling** on free tier

### Environment Variables
**Backend:**
- \`PYTHONPATH=/app\`
- \`PORT=8000\` (auto-set)
- \`PYTHONUNBUFFERED=1\`

**Frontend:**
- \`NODE_ENV=production\`
- \`NEXT_TELEMETRY_DISABLED=1\`
- \`NEXT_PUBLIC_API_URL\` (auto-linked to backend)

## 📦 Package Management

### Node.js Dependencies
- Automatically installed from \`package.json\`
- Uses \`npm ci\` for faster, reliable installs
- Supports both \`package-lock.json\` and fallback to \`npm install\`

### Python Dependencies
- Automatically installed from \`scripts/requirements.txt\`
- Uses pip with \`--no-cache-dir\` for smaller images
- Includes all necessary FastAPI dependencies

## 🔍 Health Checks

### Frontend Health Check
- **Endpoint:** \`/api/health\`
- **Checks:** Frontend status + backend connectivity
- **Timeout:** 30 seconds
- **Interval:** 30 seconds

### Backend Health Check
- **Endpoint:** \`/health\`
- **Checks:** API status + data file existence
- **Timeout:** 30 seconds
- **Interval:** 30 seconds

## 🛠️ Development Workflow

### Local Development
\`\`\`bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
\`\`\`

### Production Testing
\`\`\`bash
# Build and test production images
./scripts/docker-build.sh
docker-compose up

# Test health endpoints
curl http://localhost:3000/api/health
curl http://localhost:8000/health
\`\`\`

### Deployment
\`\`\`bash
# Commit changes
git add .
git commit -m "Update deployment configuration"
git push origin main

# Render will automatically deploy
\`\`\`

## 🔧 Troubleshooting

### Build Issues
\`\`\`bash
# Check Docker logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild without cache
docker-compose build --no-cache
\`\`\`

### Runtime Issues
\`\`\`bash
# Check container status
docker-compose ps

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh
\`\`\`

### Render Issues
- Check build logs in Render dashboard
- Verify environment variables
- Check health endpoint responses
- Review disk usage and limits

## 📊 Monitoring

### Local Monitoring
- **Frontend:** http://localhost:3000/api/health
- **Backend:** http://localhost:8000/health
- **Admin Panel:** http://localhost:3000/admin

### Production Monitoring
- **Frontend:** https://your-frontend.onrender.com/api/health
- **Backend:** https://your-backend.onrender.com/health
- **Admin Panel:** https://your-frontend.onrender.com/admin

## 🎯 Key Features

✅ **Automatic package installation** from GitHub
✅ **Multi-stage Docker builds** for optimization
✅ **Health checks** for both services
✅ **Persistent data storage** on Render
✅ **Development and production** configurations
✅ **Comprehensive .gitignore** for clean repos
✅ **Security best practices** (non-root users)
✅ **Auto-deployment** from GitHub pushes
✅ **Environment variable** management
✅ **Error handling** and fallbacks

## 🚀 Next Steps

1. **Push to GitHub** - All dependencies will install automatically
2. **Connect to Render** - Use Blueprint deployment
3. **Configure domains** - Add custom domains if needed
4. **Monitor performance** - Use health endpoints
5. **Scale as needed** - Upgrade Render plan when ready

Your portfolio is now ready for production deployment! 🎉
\`\`\`

