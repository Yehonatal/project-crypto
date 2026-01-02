# Docker Setup Guide

This guide explains how to run the Project Crypto application using Docker and Docker Compose.

## Prerequisites

- Docker (v20.10 or higher)
- Docker Compose (v2.0 or higher)
- Git (to clone the repository)

## Quick Start

### Development Mode (with Live Reloading)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-crypto
   ```

2. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```bash
   cd backend
   cp .env.example .env  # If you have an example file
   # OR create a new .env file
   echo "VITE_API_KEY=your_coingecko_api_key_here" > .env
   echo "PORT=4000" >> .env
   cd ..
   ```

3. **Start development environment**
   ```bash
   # Using the convenience script (recommended)
   ./dev.sh start
   
   # OR manually
   docker-compose -f docker-compose.dev.yml up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:5173 (with hot reloading)
   - Backend API: http://localhost:4000 (with nodemon)
   - Health check: http://localhost:4000/health

### Production Mode

1. **Build and run with Docker Compose**
   ```bash
   # From the project root directory
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:4000
   - Health check: http://localhost:4000/health

## Docker Services

### Backend Service
- **Container Name**: `crypto-backend`
- **Port**: 4000
- **Health Check**: `/health` endpoint
- **Environment**: Production Node.js with Express
- **Features**:
  - Rate limiting
  - Response caching
  - Security headers
  - Compression

### Frontend Service
- **Container Name**: `crypto-frontend`
- **Port**: 80 (HTTP)
- **Environment**: Nginx serving React build
- **Features**:
  - Optimized Nginx configuration
  - Gzip compression
  - Static asset caching
  - Security headers
  - Client-side routing support

## Docker Commands

### Development (with Live Reloading)

**Quick Start for Development:**
```bash
# Using the convenience script
./dev.sh start

# Or manually
docker-compose -f docker-compose.dev.yml up --build
```

**Development Commands:**
```bash
# Start development environment with live reloading
./dev.sh start
# OR
docker-compose -f docker-compose.dev.yml up --build

# Start in background
./dev.sh start-detached
# OR
docker-compose -f docker-compose.dev.yml up --build -d

# View logs
./dev.sh logs
# OR
docker-compose -f docker-compose.dev.yml logs -f

# View logs for specific service
./dev.sh logs-frontend
./dev.sh logs-backend
# OR
docker-compose -f docker-compose.dev.yml logs -f frontend
docker-compose -f docker-compose.dev.yml logs -f backend

# Stop all services
./dev.sh stop
# OR
docker-compose -f docker-compose.dev.yml down

# Restart development environment
./dev.sh restart

# Clean up containers and volumes
./dev.sh clean

# Access container shell
./dev.sh shell-frontend
./dev.sh shell-backend
```

### Production

```bash
# Build and start all services
docker-compose up --build

# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Production

```bash
# Build for production
docker-compose -f docker-compose.yml up --build -d

# Scale services (if needed)
docker-compose up --scale backend=2 -d
```

### Individual Service Management

```bash
# Build specific service
docker-compose build backend
docker-compose build frontend

# Start specific service
docker-compose up backend
docker-compose up frontend

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

## Environment Variables

### Backend (.env file in backend directory)
```env
VITE_API_KEY=your_coingecko_api_key_here
PORT=4000
NODE_ENV=production
```

### Frontend (Optional - can be set in docker-compose.yml)
```env
VITE_API_BASE_URL=http://backend:4000
```

## Health Checks

Both services include health checks:

- **Backend**: `GET /health` - Returns JSON with status and timestamp
- **Frontend**: HTTP check on port 80

Health check configuration:
- Interval: 30 seconds
- Timeout: 10 seconds
- Retries: 3
- Start period: 30 seconds

## Networking

Services communicate through a custom Docker network `crypto-network`:
- Backend is accessible to frontend as `backend:4000`
- Frontend makes API calls to backend using internal network
- Only necessary ports are exposed to host

## Volumes

A named volume `crypto-data` is defined for future use (persistent data storage).

## Security Features

### Backend Container
- Non-root user execution
- Security headers via Helmet
- Rate limiting
- Input validation
- CORS protection

### Frontend Container
- Non-root user execution
- Nginx security headers
- Static asset optimization
- Client-side routing support

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check if ports are in use
   netstat -tulpn | grep :80
   netstat -tulpn | grep :4000
   
   # Modify ports in docker-compose.yml if needed
   ```

2. **API key issues**
   ```bash
   # Verify environment variables
   docker-compose exec backend env | grep VITE_API_KEY
   ```

3. **Service not starting**
   ```bash
   # Check service logs
   docker-compose logs backend
   docker-compose logs frontend
   
   # Check service health
   docker-compose ps
   ```

4. **Frontend can't connect to backend**
   ```bash
   # Verify network connectivity
   docker-compose exec frontend ping backend
   
   # Check backend health
   curl http://localhost:4000/health
   ```

### Development Setup Details

**Live Reloading Explained:**
- The development configuration uses volume mounts to sync your local code with the container
- Frontend runs Vite dev server with hot module replacement (HMR)
- Backend runs with nodemon for automatic restart on file changes
- Changes to your code are reflected immediately without rebuilding

**Development vs Production:**
- **Development**: Uses `docker-compose.dev.yml` with volume mounts and dev servers
- **Production**: Uses `docker-compose.yml` with optimized builds and nginx

**Development Features:**
- ✅ Hot reloading for React components
- ✅ Automatic backend restart with nodemon  
- ✅ Source code mounted as volumes
- ✅ Faster startup (no build step required)
- ✅ Real-time debugging capabilities

### Development Tips

1. **File watching in Docker**
   ```bash
   # Vite config already includes polling for Docker compatibility
   # Located in frontend/vite.config.ts
   ```

2. **Debugging**
   ```bash
   # Access container shells for debugging
   ./dev.sh shell-frontend
   ./dev.sh shell-backend
   
   # Or manually
   docker-compose -f docker-compose.dev.yml exec frontend sh
   docker-compose -f docker-compose.dev.yml exec backend sh
   ```

3. **Performance**
   ```bash
   # If containers are slow, try increasing Docker memory limits
   # Docker Desktop -> Settings -> Resources -> Memory
   ```

4. **Environment variables**
   ```bash
   # Development environment variables are loaded from:
   # - backend/.env (for backend)
   # - VITE_* variables are handled by Vite automatically
   ```

## Maintenance

### Updates
```bash
# Pull latest images
docker-compose pull

# Rebuild with latest changes
docker-compose up --build

# Clean up old images
docker image prune -f
```

### Backup
```bash
# Backup volumes (when applicable)
docker run --rm -v crypto-data:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz /data
```

### Monitoring
```bash
# Check container resources
docker stats

# Check container health
docker-compose ps
```
