# Branch Strategy & CI/CD

## Branch Overview

| Branch | Purpose | Auto Deploy | Docker Tag | Environment |
|--------|---------|-------------|------------|-------------|
| `test-dev` | Testing/Development | ✅ Yes | `test-dev` | Development |
| `main` | Production | ❌ Manual | - | Production |
| `develop` | Staging | ❌ Manual | - | Staging |
| `feature/*` | Features | ❌ No | - | Local |

**Note:** CI/CD pipeline is configured ONLY for `test-dev` branch.

## Workflow Triggers

### test-dev Branch (ACTIVE)
```bash
git push origin test-dev
```
**Triggers:**
- ✅ Full Security Scan (Trivy)
- ✅ OWASP Dependency Check
- ✅ SonarQube Code Analysis
- ✅ Build Docker Images
- ✅ Push to Docker Hub as `test-dev`
- ✅ Post-Build Image Security Scan

### Pull Requests to test-dev
```bash
# Create PR to test-dev
```
**Triggers:**
- ✅ Lint & Test
- ✅ Quick Security Check
- ✅ Test Docker Build (no push)

### Other Branches (main, develop)
**No automated pipeline configured.**
Deploy manually or configure additional workflows as needed.

## Quick Commands

### Start Working on test-dev
```bash
git checkout test-dev
git pull origin test-dev

# Make changes
git add .
git commit -m "feat: your feature"
git push origin test-dev

# Pipeline runs automatically!
```

### Deploy test-dev Locally
```bash
export DOCKER_USERNAME=your-username
docker-compose -f docker-compose.test-dev.yml up -d
```

### Check Pipeline Status
```bash
# Open in browser
https://github.com/YOUR-USERNAME/YOUR-REPO/actions
```

### Pull Latest test-dev Images
```bash
docker pull your-username/ekomart-backend:test-dev
docker pull your-username/ekomart-frontend:test-dev
```

## Development Flow

```
feature/new-feature
    ↓ (PR + Review)
test-dev (automated CI/CD)
    ↓ (Manual promotion)
develop (manual deployment)
    ↓ (Manual promotion)
main (manual deployment)
```

## Docker Image Tags (test-dev only)

### Backend Images
- `your-username/ekomart-backend:test-dev` (latest test-dev build)
- `your-username/ekomart-backend:test-dev-abc1234` (specific commit SHA)

### Frontend Images
- `your-username/ekomart-frontend:test-dev` (latest test-dev build)
- `your-username/ekomart-frontend:test-dev-abc1234` (specific commit SHA)

## Security Scans (test-dev only)

| Tool | What it Scans | When |
|------|---------------|------|
| **Trivy** | Vulnerabilities in code & images | Every push to test-dev |
| **OWASP** | Known CVEs in dependencies | Every push to test-dev |
| **SonarQube** | Code quality & security | Every push to test-dev |

## Environment URLs

| Environment | Frontend | Backend | Database |
|-------------|----------|---------|----------|
| **Local (test-dev)** | http://localhost:8080 | http://localhost:5001 | MongoDB Atlas |
| **Test Server** | http://test-dev.example.com | http://api-test.example.com | MongoDB Atlas |

## Required Secrets

Add these in GitHub Settings → Secrets:

```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-token
SONAR_TOKEN=your-sonarqube-token
SONAR_HOST_URL=https://sonarcloud.io
```

## Monitoring

### Check Build Status
- GitHub Actions: https://github.com/YOUR-REPO/actions
- Docker Hub: https://hub.docker.com/u/YOUR-USERNAME

### Check Security
- GitHub Security: https://github.com/YOUR-REPO/security
- SonarCloud: https://sonarcloud.io

### Check Logs
```bash
# Local deployment
docker-compose -f docker-compose.test-dev.yml logs -f

# Specific service
docker logs ekomart-backend-test -f
```

## Troubleshooting

### Pipeline Failed?
1. Check Actions tab for error details
2. Review security scan results
3. Fix issues and push again

### Can't Pull Images?
```bash
docker login
docker pull your-username/ekomart-backend:test-dev
```

### Container Won't Start?
```bash
docker logs container-name
docker exec -it container-name sh
```

## Best Practices

✅ **DO:**
- Test in `test-dev` before promoting
- Review security alerts before merging
- Keep branches up to date
- Use meaningful commit messages
- Tag releases in `main`

❌ **DON'T:**
- Push directly to `main`
- Ignore security warnings
- Skip code reviews
- Use production data in test-dev
- Commit secrets or credentials

## Quick Links

- [Full CI/CD Setup Guide](../CICD-SETUP.md)
- [Test-Dev Deployment Guide](../TEST-DEV-DEPLOYMENT.md)
- [Workflow Documentation](.github/workflows/README.md)
- [Docker Compose Files](../docker-compose.*.yml)
