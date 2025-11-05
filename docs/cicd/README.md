# CI/CD Documentation

Complete documentation for the automated CI/CD pipeline configured for the `test-dev` branch.

## 📚 Documentation Files

### Quick Start
- **[CI-CD-SUMMARY.md](CI-CD-SUMMARY.md)** - Quick reference guide (START HERE)
  - Overview of what happens on push
  - Quick commands
  - Troubleshooting tips

### Setup Guides
- **[CICD-SETUP.md](CICD-SETUP.md)** - Complete setup instructions
  - GitHub secrets configuration
  - Docker Hub setup
  - SonarQube setup
  - Step-by-step guide

### Deployment
- **[TEST-DEV-DEPLOYMENT.md](TEST-DEV-DEPLOYMENT.md)** - Deployment guide
  - How to deploy test-dev images
  - Docker commands
  - Troubleshooting

### Reference
- **[BRANCH-STRATEGY.md](BRANCH-STRATEGY.md)** - Branch strategy and workflow
  - Branch overview
  - Workflow triggers
  - Docker image tags

- **[WORKFLOWS.md](WORKFLOWS.md)** - Detailed workflow documentation
  - Pipeline stages
  - Security scanning details
  - Viewing results

### Configuration Files
- **[sonar-project.properties](sonar-project.properties)** - SonarQube configuration
- **[docker-compose.test-dev.yml](docker-compose.test-dev.yml)** - Docker Compose for test-dev

## 🚀 Quick Start

### 1. Setup (First Time)
```bash
# Read the setup guide
cat docs/cicd/CICD-SETUP.md

# Configure GitHub secrets (see CICD-SETUP.md)
# - DOCKER_USERNAME
# - DOCKER_PASSWORD
# - SONAR_TOKEN
# - SONAR_HOST_URL
```

### 2. Push to test-dev
```bash
git checkout test-dev
git add .
git commit -m "feat: your changes"
git push origin test-dev
```

### 3. Watch Pipeline
- Go to GitHub → Actions tab
- View workflow run
- Check security scan results

### 4. Deploy Locally
```bash
export DOCKER_USERNAME=your-dockerhub-username
docker-compose -f docker-compose.test-dev.yml up -d
```

## 📋 What's Automated

### On Push to test-dev
✅ Trivy security scan  
✅ OWASP dependency check  
✅ SonarQube code analysis  
✅ Docker image build  
✅ Push to Docker Hub  
✅ Image security scan  

### On Pull Request to test-dev
✅ Lint and test  
✅ Quick security check  
✅ Test Docker build (no push)  

## 🎯 Pipeline Overview

```
Push to test-dev
    ↓
Security Scanning
    ├── Trivy (filesystem)
    ├── OWASP Dependency Check
    └── SonarQube Analysis
    ↓
Build Docker Images
    ├── Backend: ekomart-backend:test-dev
    └── Frontend: ekomart-frontend:test-dev
    ↓
Push to Docker Hub
    ↓
Scan Docker Images
    └── Trivy (images)
    ↓
✅ Complete
```

## 🔧 Workflow Files Location

Actual workflow files are in `.github/workflows/`:
- `.github/workflows/ci-cd.yml` - Main CI/CD pipeline
- `.github/workflows/pr-check.yml` - Pull request checks

## 📊 View Results

### GitHub
- **Actions**: https://github.com/YOUR-USERNAME/YOUR-REPO/actions
- **Security**: https://github.com/YOUR-USERNAME/YOUR-REPO/security

### External Services
- **Docker Hub**: https://hub.docker.com/u/YOUR-USERNAME
- **SonarCloud**: https://sonarcloud.io

## 🐛 Troubleshooting

### Pipeline Fails
1. Check Actions tab for logs
2. Review security scan results
3. Fix issues and push again

### Can't Pull Images
```bash
docker login
docker pull your-username/ekomart-backend:test-dev
```

### Secrets Not Working
- Go to Settings → Secrets and variables → Actions
- Verify all secrets are configured

## 📖 Reading Order

For first-time setup, read in this order:

1. **CI-CD-SUMMARY.md** - Get overview
2. **CICD-SETUP.md** - Complete setup
3. **TEST-DEV-DEPLOYMENT.md** - Deploy and test
4. **BRANCH-STRATEGY.md** - Understand workflow
5. **WORKFLOWS.md** - Deep dive into pipeline

## 🎨 Customization

### Add More Branches
Edit `.github/workflows/ci-cd.yml`:
```yaml
on:
  push:
    branches: [ test-dev, develop, main ]
```

### Change Image Names
Edit `.github/workflows/ci-cd.yml`:
```yaml
images: ${{ secrets.DOCKER_USERNAME }}/your-custom-name
```

## ✅ Prerequisites

- [ ] GitHub account with repository
- [ ] Docker Hub account
- [ ] SonarCloud account (or SonarQube server)
- [ ] Git installed locally
- [ ] Docker installed locally (for testing)

## 🆘 Need Help?

1. Check the specific documentation file for your issue
2. Review GitHub Actions logs
3. Check Security tab for vulnerability details
4. Review SonarQube dashboard for code quality issues

## 📝 Notes

- **Active Branch**: Only `test-dev` has automated CI/CD
- **Manual Deployment**: Other branches (main, develop) require manual deployment
- **Security First**: Pipeline includes multiple security scanning tools
- **Docker Hub**: Images are public by default (configure private repos if needed)

---

**Last Updated**: November 2025  
**Pipeline Version**: 1.0  
**Active Branch**: test-dev
