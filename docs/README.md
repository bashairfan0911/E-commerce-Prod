# EkoMart Documentation

Complete documentation for the EkoMart E-Commerce platform.

## 📁 Documentation Structure

### CI/CD Pipeline
**Location**: [`docs/cicd/`](cicd/)

Complete CI/CD pipeline documentation including setup, deployment, and troubleshooting.

**Quick Links**:
- [CI/CD Quick Start](cicd/CI-CD-SUMMARY.md)
- [Setup Guide](cicd/CICD-SETUP.md)
- [Deployment Guide](cicd/TEST-DEV-DEPLOYMENT.md)
- [Branch Strategy](cicd/BRANCH-STRATEGY.md)
- [Workflow Details](cicd/WORKFLOWS.md)

### Kubernetes
**Location**: `kubernetes/`

Kubernetes deployment configurations and guides.

### Terraform
**Location**: `terraform/`

Infrastructure as Code for AWS deployment.

## 🚀 Quick Start Guides

### For Developers
1. Clone the repository
2. Read [CI/CD Setup Guide](cicd/CICD-SETUP.md)
3. Configure GitHub secrets
4. Push to `test-dev` branch

### For DevOps
1. Review [Terraform configurations](../terraform/)
2. Check [Kubernetes manifests](../kubernetes/)
3. Configure [CI/CD pipeline](cicd/)

### For Testing
1. Pull test-dev images from Docker Hub
2. Use `docker-compose.test-dev.yml`
3. Follow [Deployment Guide](cicd/TEST-DEV-DEPLOYMENT.md)

## 📚 Main Documentation Files

### Root Level
- `README.md` - Main project README
- `docker-compose.yml` - Local development setup
- `docker-compose.test-dev.yml` - Test-dev deployment

### CI/CD (`docs/cicd/`)
- Complete CI/CD pipeline documentation
- Security scanning setup
- Docker Hub integration
- SonarQube configuration

### Backend (`backend/`)
- API documentation
- Database models
- Environment configuration

### Frontend (`frontend/`)
- Component documentation
- Build configuration
- Environment setup

## 🔧 Configuration Files

### CI/CD
- `.github/workflows/ci-cd.yml` - Main pipeline
- `.github/workflows/pr-check.yml` - PR validation
- `sonar-project.properties` - SonarQube config

### Docker
- `backend/Dockerfile` - Backend image
- `frontend/Dockerfile` - Frontend image
- `docker-compose.yml` - Local development
- `docker-compose.test-dev.yml` - Test environment

### Infrastructure
- `terraform/` - AWS infrastructure
- `kubernetes/` - K8s manifests

## 🎯 Common Tasks

### Start Development
```bash
docker-compose up -d
```

### Run Tests
```bash
cd backend && npm test
cd frontend && npm test
```

### Deploy to Test-Dev
```bash
git push origin test-dev
# Pipeline runs automatically
```

### Pull Test-Dev Images
```bash
docker pull your-username/ekomart-backend:test-dev
docker pull your-username/ekomart-frontend:test-dev
```

## 🔗 External Links

- **GitHub Repository**: [Your Repo URL]
- **Docker Hub**: https://hub.docker.com/u/YOUR-USERNAME
- **SonarCloud**: https://sonarcloud.io
- **MongoDB Atlas**: https://cloud.mongodb.com

## 📖 Documentation Index

### Getting Started
- [Project README](../README.md)
- [CI/CD Setup](cicd/CICD-SETUP.md)
- [Local Development](../README.md#local-development)

### Development
- [Backend Setup](../backend/README.md)
- [Frontend Setup](../frontend/README.md)
- [Database Schema](../backend/Models/)

### Deployment
- [Test-Dev Deployment](cicd/TEST-DEV-DEPLOYMENT.md)
- [Kubernetes Deployment](../kubernetes/)
- [Terraform Infrastructure](../terraform/)

### Operations
- [CI/CD Pipeline](cicd/WORKFLOWS.md)
- [Branch Strategy](cicd/BRANCH-STRATEGY.md)
- [Monitoring & Logs](cicd/TEST-DEV-DEPLOYMENT.md#troubleshooting)

## 🆘 Support

### Documentation Issues
- Check specific documentation file
- Review troubleshooting sections
- Check GitHub Actions logs

### Technical Issues
- Backend: Check `backend/` documentation
- Frontend: Check `frontend/` documentation
- Infrastructure: Check `terraform/` or `kubernetes/`

### CI/CD Issues
- Review [CI/CD docs](cicd/)
- Check GitHub Actions logs
- Verify secrets configuration

---

**Project**: EkoMart E-Commerce Platform  
**Documentation Version**: 1.0  
**Last Updated**: November 2025
