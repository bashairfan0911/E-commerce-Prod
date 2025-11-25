# CI/CD Pipeline Summary

## 🎯 Configuration
**Active Branch:** `test-dev` ONLY

## 📋 What Happens When You Push to test-dev

### 1. Security Scanning
- ✅ **Trivy** - Scans code and dependencies for vulnerabilities
- ✅ **OWASP Dependency Check** - Identifies known CVEs
- ✅ **SonarQube** - Analyzes code quality and security

### 2. Build & Deploy
- ✅ Builds Docker images for backend and frontend
- ✅ Pushes to Docker Hub with tags:
  - `your-username/ekomart-backend:test-dev`
  - `your-username/ekomart-frontend:test-dev`
  - `your-username/ekomart-backend:test-dev-<commit-sha>`
  - `your-username/ekomart-frontend:test-dev-<commit-sha>`

### 3. Post-Build Security
- ✅ Scans Docker images with Trivy
- ✅ Uploads results to GitHub Security tab

## 🚀 Quick Usage

### Push to test-dev (triggers full pipeline)
```bash
git checkout test-dev
git add .
git commit -m "feat: your changes"
git push origin test-dev
```

### Create PR to test-dev (triggers checks only)
```bash
git checkout -b feature/new-feature
git add .
git commit -m "feat: new feature"
git push origin feature/new-feature
# Create PR to test-dev on GitHub
```

### Deploy locally using test-dev images
```bash
export DOCKER_USERNAME=your-dockerhub-username
docker-compose -f docker-compose.test-dev.yml up -d
```

## 📦 Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub access token |
| `SONAR_TOKEN` | SonarQube/SonarCloud token |
| `SONAR_HOST_URL` | SonarQube server URL (e.g., https://sonarcloud.io) |

## 📊 View Results

### GitHub Actions
- Go to: `https://github.com/YOUR-USERNAME/YOUR-REPO/actions`
- View workflow runs and logs

### Security Alerts
- Go to: `https://github.com/YOUR-USERNAME/YOUR-REPO/security`
- View code scanning alerts from Trivy

### SonarQube Dashboard
- Go to: `https://sonarcloud.io` (or your server)
- View code quality metrics

### Docker Hub
- Go to: `https://hub.docker.com/u/YOUR-USERNAME`
- View pushed images and tags

## 🔧 Files Structure

```
.github/
├── workflows/
│   ├── ci-cd.yml          # Main pipeline (test-dev only)
│   └── pr-check.yml       # PR validation (test-dev only)
└── BRANCH-STRATEGY.md     # Branch strategy guide

docker-compose.test-dev.yml # Deploy test-dev images
CICD-SETUP.md              # Setup instructions
TEST-DEV-DEPLOYMENT.md     # Deployment guide
CI-CD-SUMMARY.md           # This file
```

## ⚙️ Workflow Files

### ci-cd.yml
- **Triggers:** Push to `test-dev`
- **Jobs:**
  1. security-scan (Trivy)
  2. owasp-dependency-check
  3. sonarqube-analysis
  4. build-and-push (Docker images)

### pr-check.yml
- **Triggers:** Pull requests to `test-dev`
- **Jobs:**
  1. lint-and-test
  2. security-check (quick Trivy scan)
  3. docker-build-test (no push)

## 🎨 Customization

### Add More Branches
Edit `.github/workflows/ci-cd.yml`:
```yaml
on:
  push:
    branches: [ test-dev, develop, main ]
```

### Change Docker Image Names
Edit `.github/workflows/ci-cd.yml`:
```yaml
images: ${{ secrets.DOCKER_USERNAME }}/your-custom-name
```

### Adjust Security Severity
Edit `.github/workflows/ci-cd.yml`:
```yaml
severity: 'CRITICAL,HIGH,MEDIUM,LOW'
```

## 🐛 Troubleshooting

### Pipeline Fails
1. Check Actions tab for error logs
2. Review security scan results
3. Fix issues and push again

### Docker Push Fails: "insufficient scopes"
**Solution**: Update Docker Hub token
1. See [Docker Hub Setup Guide](DOCKER-HUB-SETUP.md)
2. Create new token with "Read, Write, Delete" permissions
3. Update `DOCKER_PASSWORD` secret in GitHub

### Can't Pull Images
```bash
docker login
docker pull your-username/ekomart-backend:test-dev
```

### Secrets Not Working
1. Go to Settings → Secrets and variables → Actions
2. Verify all required secrets are added
3. Check secret names match exactly

### SonarQube Fails
**Solution**: It's optional, pipeline will continue
- See [SonarCloud Setup Guide](SONARCLOUD-SETUP.md) to fix
- Or ignore it - Docker builds will still work

## 📚 Documentation

- [Full Setup Guide](CICD-SETUP.md)
- [Test-Dev Deployment](TEST-DEV-DEPLOYMENT.md)
- [Branch Strategy](.github/BRANCH-STRATEGY.md)
- [Workflow Details](.github/workflows/README.md)

## ✅ Checklist

Before pushing to test-dev:
- [ ] All secrets configured in GitHub
- [ ] Docker Hub account created
- [ ] SonarQube/SonarCloud setup complete
- [ ] Code tested locally
- [ ] Commit message follows convention

## 🎯 Next Steps

1. Push to test-dev to trigger first pipeline run
2. Monitor Actions tab for results
3. Review security alerts
4. Deploy using docker-compose.test-dev.yml
5. Test the application
6. Promote to develop/main when ready (manual)

---

**Need Help?** Check the documentation files or GitHub Actions logs for detailed information.
