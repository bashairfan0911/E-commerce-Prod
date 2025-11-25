# CI/CD Pipeline Documentation

## Overview
This GitHub Actions workflow provides comprehensive security scanning, code quality analysis, and automated Docker image building and deployment **exclusively for the test-dev branch**.

## Active Branch
**⚠️ Important:** The CI/CD pipeline is configured to run ONLY on the `test-dev` branch.

## Pipeline Stages

### 1. Security Scanning (Trivy)
- **Purpose**: Scan for vulnerabilities in dependencies and code
- **Tool**: Aqua Security Trivy
- **Scans**: 
  - File system scan for vulnerabilities
  - Docker image scanning after build
- **Severity Levels**: CRITICAL, HIGH, MEDIUM
- **Output**: SARIF format uploaded to GitHub Security tab
- **Trigger**: Every push to `test-dev`

### 2. OWASP Dependency Check
- **Purpose**: Identify known vulnerabilities in project dependencies
- **Tool**: OWASP Dependency-Check
- **Output**: HTML report available as artifact
- **Features**:
  - Checks retired dependencies
  - Experimental vulnerability detection enabled
- **Trigger**: Every push to `test-dev`

### 3. SonarQube Analysis
- **Purpose**: Code quality and security analysis
- **Checks**:
  - Code smells
  - Bugs
  - Security hotspots
  - Code coverage
  - Duplications
- **Quality Gate**: Enforced (can be configured to fail build)
- **Trigger**: Every push to `test-dev`

### 4. Build and Push Docker Images
- **Triggers**: Only on push to `test-dev` branch
- **Images Built**:
  - Backend: `ekomart-backend:test-dev`
  - Frontend: `ekomart-frontend:test-dev`
- **Registry**: Docker Hub
- **Features**:
  - Layer caching for faster builds
  - Automatic tagging (test-dev, test-dev-SHA)
  - Post-build Trivy scanning

## Required GitHub Secrets

Configure these secrets in your GitHub repository settings:

### Docker Hub
```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password-or-token
```

### SonarQube
```
SONAR_TOKEN=your-sonarqube-token
SONAR_HOST_URL=https://sonarcloud.io (or your SonarQube server URL)
```

## Setup Instructions

### 1. Docker Hub Setup
1. Create a Docker Hub account at https://hub.docker.com
2. Create access token: Account Settings → Security → New Access Token
3. Add secrets to GitHub: Settings → Secrets and variables → Actions

### 2. SonarQube Setup

#### Option A: SonarCloud (Free for public repos)
1. Go to https://sonarcloud.io
2. Sign in with GitHub
3. Create new organization and project
4. Get your token: My Account → Security → Generate Token
5. Add to GitHub secrets

#### Option B: Self-hosted SonarQube
1. Deploy SonarQube server
2. Create project and generate token
3. Add server URL and token to GitHub secrets

### 3. Enable GitHub Security Features
1. Go to repository Settings → Security → Code security and analysis
2. Enable:
   - Dependency graph
   - Dependabot alerts
   - Code scanning (CodeQL)

## Workflow Triggers

### Automatic Triggers
- **Push to test-dev**: Full pipeline runs (security scans, quality checks, Docker build & push)
- **Pull Request to test-dev**: Lint, test, and quick security check (no Docker push)

### Manual Trigger
You can manually trigger the workflow from the Actions tab (select test-dev branch).

## Viewing Results

### Security Scan Results
- **Location**: Security tab → Code scanning alerts
- **Trivy Results**: Shows vulnerabilities found in code and images
- **OWASP Results**: Download artifact from workflow run

### SonarQube Results
- **Location**: SonarCloud dashboard or your SonarQube server
- **Metrics**: 
  - Reliability rating
  - Security rating
  - Maintainability rating
  - Coverage percentage

### Docker Images
- **Location**: Docker Hub repository
- **Tags**: 
  - `test-dev` - Latest test-dev branch build
  - `test-dev-<sha>` - Specific commit from test-dev

## Customization

### Modify Trivy Severity
Edit `.github/workflows/ci-cd.yml`:
```yaml
severity: 'CRITICAL,HIGH,MEDIUM,LOW'
```

### Change Docker Image Names
Update the `meta-backend` and `meta-frontend` steps:
```yaml
images: ${{ secrets.DOCKER_USERNAME }}/your-custom-name
```

### Add Slack/Email Notifications
Add notification step at the end:
```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Troubleshooting

### Pipeline Fails on Security Scan
- Review the security alerts in the Security tab
- Fix critical vulnerabilities before merging
- Or adjust severity threshold temporarily

### SonarQube Quality Gate Fails
- Check SonarQube dashboard for specific issues
- Fix code smells and bugs
- Improve test coverage

### Docker Push Fails
- Verify Docker Hub credentials
- Check image size limits
- Ensure proper permissions

## Best Practices

1. **Always review security alerts** before merging PRs
2. **Maintain test coverage** above 80%
3. **Fix critical vulnerabilities** immediately
4. **Use semantic versioning** for releases
5. **Keep dependencies updated** regularly

## Additional Resources

- [Trivy Documentation](https://aquasecurity.github.io/trivy/)
- [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)
- [SonarQube Documentation](https://docs.sonarqube.org/)
- [Docker Hub](https://docs.docker.com/docker-hub/)
