# CI/CD Pipeline Setup Guide

## Important Note
**This CI/CD pipeline is configured to work ONLY with the `test-dev` branch.**

## Quick Start

### Step 1: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

#### Required Secrets

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `DOCKER_USERNAME` | Your Docker Hub username | Your Docker Hub account name |
| `DOCKER_PASSWORD` | Docker Hub access token | Docker Hub → Account Settings → Security → New Access Token |
| `SONAR_TOKEN` | SonarQube authentication token | SonarCloud → My Account → Security → Generate Token |
| `SONAR_HOST_URL` | SonarQube server URL | `https://sonarcloud.io` (or your server URL) |

### Step 2: Docker Hub Setup

1. **Create Docker Hub Account**
   - Go to https://hub.docker.com
   - Sign up for free account

2. **Create Access Token**
   ```
   Docker Hub → Account Settings → Security → New Access Token
   Name: github-actions
   Permissions: Read, Write, Delete
   ```

3. **Create Repositories** (Optional - will be auto-created)
   - `your-username/ekomart-backend`
   - `your-username/ekomart-frontend`

### Step 3: SonarQube Setup (Choose One)

#### Option A: SonarCloud (Recommended for Public Repos)

1. Go to https://sonarcloud.io
2. Click "Log in" → "With GitHub"
3. Import your organization
4. Click "+ Analyze new project"
5. Select your repository
6. Choose "With GitHub Actions"
7. Copy the token provided
8. Add to GitHub secrets as `SONAR_TOKEN`
9. Set `SONAR_HOST_URL` to `https://sonarcloud.io`

#### Option B: Self-Hosted SonarQube

1. Deploy SonarQube server (Docker recommended):
   ```bash
   docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
   ```

2. Access at http://localhost:9000 (default: admin/admin)

3. Create new project:
   - Administration → Projects → Create Project
   - Project key: `ekomart`
   - Generate token

4. Add secrets:
   - `SONAR_TOKEN`: Your generated token
   - `SONAR_HOST_URL`: Your server URL (e.g., `http://your-server:9000`)

### Step 4: Enable GitHub Security Features

1. Go to repository Settings → Security → Code security and analysis
2. Enable:
   - ✅ Dependency graph
   - ✅ Dependabot alerts
   - ✅ Dependabot security updates
   - ✅ Code scanning (CodeQL)

### Step 5: Test the Pipeline

1. **Create or checkout test-dev branch:**
   ```bash
   git checkout -b test-dev
   # or if exists
   git checkout test-dev
   git pull origin test-dev
   ```

2. **Make a change and push:**
   ```bash
   echo "# Test" >> TEST.md
   git add TEST.md
   git commit -m "test: trigger pipeline"
   git push origin test-dev
   ```

3. **Watch the pipeline:**
   - Go to GitHub → Actions tab
   - You'll see the "CI/CD Pipeline" workflow running
   - Full pipeline with security scans and Docker push will execute

4. **Create a Pull Request (optional):**
   - Create PR to test-dev branch
   - This will trigger the PR check workflow (no Docker push)

## Pipeline Overview

### On Pull Request to test-dev
- ✅ Lint and test code
- ✅ Quick security scan (Trivy)
- ✅ Test Docker builds (no push)

### On Push to test-dev
- ✅ Full security scan (Trivy)
- ✅ OWASP Dependency Check
- ✅ SonarQube analysis
- ✅ Build Docker images
- ✅ Push to Docker Hub with `test-dev` tag
- ✅ Scan Docker images

## Viewing Results

### 1. GitHub Actions
- Go to repository → Actions tab
- Click on workflow run to see details
- Download artifacts (OWASP reports)

### 2. Security Alerts
- Go to repository → Security tab
- View Code scanning alerts
- Review Dependabot alerts

### 3. SonarQube Dashboard
- Go to SonarCloud (or your server)
- View project dashboard
- Check quality gate status

### 4. Docker Hub
- Go to https://hub.docker.com
- View your repositories
- Check image tags and sizes

## Troubleshooting

### Issue: "Secret not found"
**Solution:** Verify secrets are added correctly in repository settings

### Issue: "Docker push failed"
**Solution:** 
- Check Docker Hub credentials
- Verify token has write permissions
- Ensure repository exists or allow auto-creation

### Issue: "SonarQube analysis failed"
**Solution:**
- Verify SONAR_TOKEN is valid
- Check SONAR_HOST_URL is correct
- Ensure project exists in SonarQube

### Issue: "Trivy scan fails with high severity"
**Solution:**
- Review security alerts
- Update vulnerable dependencies
- Or temporarily adjust severity threshold

## Customization

### Change Docker Image Names

Edit `.github/workflows/ci-cd.yml`:

```yaml
images: ${{ secrets.DOCKER_USERNAME }}/your-custom-backend-name
```

### Add More Environments

Create additional workflow files:
- `.github/workflows/staging.yml`
- `.github/workflows/production.yml`

### Add Notifications

Add to workflow:

```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Best Practices

1. ✅ Always review security alerts before merging
2. ✅ Keep dependencies updated
3. ✅ Maintain test coverage above 80%
4. ✅ Fix critical vulnerabilities immediately
5. ✅ Use semantic versioning for releases
6. ✅ Tag releases properly
7. ✅ Monitor Docker image sizes

## Next Steps

1. Set up staging environment
2. Add integration tests
3. Configure deployment to Kubernetes
4. Set up monitoring and alerting
5. Add performance testing

## Support

- GitHub Actions: https://docs.github.com/actions
- Trivy: https://aquasecurity.github.io/trivy/
- SonarQube: https://docs.sonarqube.org/
- OWASP: https://owasp.org/www-project-dependency-check/
- Docker Hub: https://docs.docker.com/docker-hub/
