# Test-Dev Environment Deployment Guide

## Overview
The `test-dev` branch is the **ONLY** branch configured with automated CI/CD pipeline. This branch is used for active development and testing.

## Branch Strategy

```
main (production) - Manual deployment
  ↑
develop (staging) - Manual deployment
  ↑
test-dev (testing/development) - ✅ AUTOMATED CI/CD
```

**Note:** Only `test-dev` has automated builds and deployments.

## Automated Pipeline

### When you push to `test-dev` branch:

1. ✅ **Run Tests** - Backend and frontend tests
2. ✅ **Security Scan** - Trivy vulnerability scanning
3. ✅ **Build Docker Images** - Both backend and frontend
4. ✅ **Push to Docker Hub** - Tagged as `test-dev` and `test-dev-<sha>`
5. ✅ **Scan Images** - Post-build security scanning

## Quick Start

### 1. Create test-dev branch (if not exists)

```bash
# Create from develop or main
git checkout develop
git checkout -b test-dev
git push origin test-dev
```

### 2. Make changes and push

```bash
# Make your changes
git add .
git commit -m "feat: your feature description"
git push origin test-dev
```

### 3. Pipeline runs automatically
- Go to GitHub → Actions tab
- Watch the "Test-Dev Environment" workflow
- Images will be pushed to Docker Hub with `test-dev` tag

## Deploy Test-Dev Images

### Option 1: Using Docker Compose (Local Testing)

```bash
# Set your Docker Hub username
export DOCKER_USERNAME=your-dockerhub-username

# Pull and run test-dev images
docker-compose -f docker-compose.test-dev.yml pull
docker-compose -f docker-compose.test-dev.yml up -d

# View logs
docker-compose -f docker-compose.test-dev.yml logs -f

# Stop
docker-compose -f docker-compose.test-dev.yml down
```

### Option 2: Manual Docker Run

```bash
# Pull images
docker pull your-username/ekomart-backend:test-dev
docker pull your-username/ekomart-frontend:test-dev

# Run backend
docker run -d \
  --name ekomart-backend-test \
  -p 5001:8080 \
  --env-file backend/.env.docker \
  your-username/ekomart-backend:test-dev

# Run frontend
docker run -d \
  --name ekomart-frontend-test \
  -p 8080:80 \
  --link ekomart-backend-test:backend \
  your-username/ekomart-frontend:test-dev
```

### Option 3: Deploy to Test Server

```bash
# SSH to your test server
ssh user@test-server

# Pull latest test-dev images
docker pull your-username/ekomart-backend:test-dev
docker pull your-username/ekomart-frontend:test-dev

# Restart containers
docker-compose -f docker-compose.test-dev.yml up -d --force-recreate
```

## Environment Configuration

### Backend (.env.docker)
```env
DBURI=mongodb+srv://...
PORT=8080
NODE_ENV=development
JWT_SECRET_KEY=your-secret
FRONTEND_URL=http://localhost:8080
```

### Frontend
- API URL is configured during build
- Default: `http://localhost:5001/`

## Testing the Deployment

### 1. Check Services are Running

```bash
# Check containers
docker ps

# Check backend health
curl http://localhost:5001/

# Check frontend
curl http://localhost:8080/
```

### 2. View Logs

```bash
# Backend logs
docker logs ekomart-backend-test -f

# Frontend logs
docker logs ekomart-frontend-test -f
```

### 3. Test API Endpoints

```bash
# Get all products
curl http://localhost:5001/api/allproducts

# Get categories
curl http://localhost:5001/api/allcategory
```

## Workflow Features

### Automatic Triggers
- ✅ Push to `test-dev` branch
- ✅ Manual trigger via GitHub Actions UI

### Image Tags
- `test-dev` - Latest test-dev build (always updated)
- `test-dev-abc1234` - Specific commit SHA (immutable)

### Security Scanning
- Pre-build: File system scan
- Post-build: Docker image scan
- Severity: CRITICAL, HIGH

## Troubleshooting

### Issue: Pipeline fails on push
**Check:**
- GitHub Actions logs
- Ensure secrets are configured
- Verify Docker Hub credentials

### Issue: Images not pulling
**Solution:**
```bash
# Login to Docker Hub
docker login

# Pull with full path
docker pull your-username/ekomart-backend:test-dev
```

### Issue: Container won't start
**Check:**
```bash
# View container logs
docker logs ekomart-backend-test

# Check environment variables
docker exec ekomart-backend-test env
```

## Best Practices

### 1. Branch Protection
- Require PR reviews before merging to `develop` or `main`
- Keep `test-dev` for active development

### 2. Testing
- Test thoroughly in `test-dev` before promoting to `develop`
- Run integration tests after deployment

### 3. Database
- Use separate test database
- Don't use production data in test-dev

### 4. Monitoring
- Check logs regularly
- Monitor resource usage
- Review security scan results

## Promoting to Higher Environments

**Note:** Other branches don't have automated CI/CD. You'll need to manually build and deploy.

### From test-dev → develop (Manual)
```bash
git checkout develop
git merge test-dev
git push origin develop

# Manually build and deploy for develop environment
docker build -t your-username/ekomart-backend:develop ./backend
docker build -t your-username/ekomart-frontend:develop ./frontend
docker push your-username/ekomart-backend:develop
docker push your-username/ekomart-frontend:develop
```

### From develop → main (Manual)
```bash
git checkout main
git merge develop
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

# Manually build and deploy for production
docker build -t your-username/ekomart-backend:latest ./backend
docker build -t your-username/ekomart-frontend:latest ./frontend
docker push your-username/ekomart-backend:latest
docker push your-username/ekomart-frontend:latest
```

### Alternative: Extend CI/CD to Other Branches
If you want automated pipelines for other branches, update `.github/workflows/ci-cd.yml`:
```yaml
on:
  push:
    branches: [ test-dev, develop, main ]  # Add more branches
```

## CI/CD Pipeline Details

### Jobs Executed
1. **test-and-scan**
   - Install dependencies
   - Run tests
   - Trivy filesystem scan

2. **build-test-images**
   - Build Docker images
   - Push to Docker Hub
   - Scan images with Trivy
   - Generate summary

### Artifacts
- Docker images on Docker Hub
- Security scan results in Actions logs
- Build summary in workflow run

## Manual Workflow Trigger

You can manually trigger the test-dev workflow:

1. Go to GitHub → Actions
2. Select "Test-Dev Environment"
3. Click "Run workflow"
4. Select `test-dev` branch
5. Click "Run workflow"

## Cleanup

### Remove test containers
```bash
docker-compose -f docker-compose.test-dev.yml down -v
```

### Remove test images
```bash
docker rmi your-username/ekomart-backend:test-dev
docker rmi your-username/ekomart-frontend:test-dev
```

## Support

- Check GitHub Actions logs for build issues
- Review Docker Hub for image availability
- Check Security tab for vulnerability alerts
- Review workflow files in `.github/workflows/`
