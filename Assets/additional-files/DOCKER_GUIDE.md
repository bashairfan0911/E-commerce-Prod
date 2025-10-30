# Docker Deployment Guide

## Files Created

1. **backend/Dockerfile** - Backend container configuration
2. **frontend/Dockerfile** - Frontend container configuration (multi-stage build)
3. **docker-compose.yml** - Orchestrates both services
4. **.dockerignore** - Excludes unnecessary files from Docker images

## Prerequisites

- Docker installed on your system
- Docker Compose installed
- Environment variables configured

## Quick Start

### 1. Create .env file in root directory

Create a `.env` file in the project root with your environment variables:

```env
# Database
DBURI=mongodb+srv://your_connection_string

# JWT
JWT_SECRET_KEY=your_jwt_secret

# Cloudinary
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET_KEY=your_api_secret

# Razorpay (optional)
KEY_ID=your_razorpay_key_id
KEY_SECRET=your_razorpay_key_secret
```

### 2. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 3. Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000

## Individual Container Commands

### Build Backend Only
```bash
cd backend
docker build -t ecommerce-backend .
docker run -p 5000:5000 --env-file ../.env ecommerce-backend
```

### Build Frontend Only
```bash
cd frontend
docker build -t ecommerce-frontend .
docker run -p 80:80 ecommerce-frontend
```

## Docker Compose Commands

### Start Services
```bash
docker-compose up
```

### Start in Background
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs
docker-compose logs -f
```

### Rebuild Services
```bash
docker-compose up --build
```

### Remove Everything (including volumes)
```bash
docker-compose down -v
```

## Container Management

### List Running Containers
```bash
docker ps
```

### Stop a Container
```bash
docker stop ecommerce-backend
docker stop ecommerce-frontend
```

### Remove a Container
```bash
docker rm ecommerce-backend
docker rm ecommerce-frontend
```

### View Container Logs
```bash
docker logs ecommerce-backend
docker logs ecommerce-frontend
```

### Execute Commands in Container
```bash
# Access backend container shell
docker exec -it ecommerce-backend sh

# Access frontend container shell
docker exec -it ecommerce-frontend sh
```

## Image Management

### List Images
```bash
docker images
```

### Remove Images
```bash
docker rmi ecommerce-backend
docker rmi ecommerce-frontend
```

### Clean Up Unused Images
```bash
docker image prune
```

## Production Deployment

### Using Docker Compose in Production

1. **Update docker-compose.yml** for production:
   - Remove volume mounts for development
   - Add health checks
   - Configure restart policies
   - Use production environment variables

2. **Build optimized images**:
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### Push to Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag images
docker tag ecommerce-backend yourusername/ecommerce-backend:latest
docker tag ecommerce-frontend yourusername/ecommerce-frontend:latest

# Push images
docker push yourusername/ecommerce-backend:latest
docker push yourusername/ecommerce-frontend:latest
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID <process_id> /F

# Or change port in docker-compose.yml
ports:
  - "5001:5000"  # Use different host port
```

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Check container status
docker ps -a

# Restart container
docker-compose restart backend
```

### Database Connection Issues
- Make sure MongoDB URI is correct in .env
- Check if MongoDB allows connections from Docker containers
- Verify network connectivity

### Build Errors
```bash
# Clean build (no cache)
docker-compose build --no-cache

# Remove all containers and rebuild
docker-compose down
docker-compose up --build
```

## Environment Variables

### Required Variables:
- `DBURI` - MongoDB connection string
- `JWT_SECRET_KEY` - JWT secret for authentication
- `CLOUD_NAME` - Cloudinary cloud name
- `CLOUD_API_KEY` - Cloudinary API key
- `CLOUD_API_SECRET_KEY` - Cloudinary API secret

### Optional Variables:
- `KEY_ID` - Razorpay key ID
- `KEY_SECRET` - Razorpay key secret
- `NODE_ENV` - Environment (development/production)
- `PORT` - Backend port (default: 5000)

## Best Practices

1. **Never commit .env files** - Use .env.example instead
2. **Use multi-stage builds** - Reduces image size (already implemented in frontend)
3. **Use .dockerignore** - Excludes unnecessary files
4. **Health checks** - Add health check endpoints
5. **Logging** - Use proper logging in containers
6. **Security** - Don't run as root user in production

## Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Nginx)       │
│   Port: 80      │
└────────┬────────┘
         │
         │ HTTP Requests
         │
┌────────▼────────┐
│   Backend       │
│   (Node.js)     │
│   Port: 5000    │
└────────┬────────┘
         │
         │ Database Queries
         │
┌────────▼────────┐
│   MongoDB       │
│   (External)    │
└─────────────────┘
```

## Next Steps

1. Test locally with Docker
2. Push images to Docker Hub
3. Deploy to cloud (AWS, Azure, GCP)
4. Set up CI/CD pipeline
5. Configure monitoring and logging

## Success! 🎉

Your application is now containerized and ready for deployment anywhere Docker runs!
