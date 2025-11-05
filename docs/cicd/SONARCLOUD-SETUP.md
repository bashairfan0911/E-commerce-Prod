# SonarCloud Setup Guide

## Quick Setup (5 minutes)

### Step 1: Sign up for SonarCloud

1. Go to https://sonarcloud.io
2. Click "Log in" → "With GitHub"
3. Authorize SonarCloud to access your GitHub account

### Step 2: Import Your Repository

1. Click the "+" icon → "Analyze new project"
2. Select your organization: `bashairfan0911`
3. Select repository: `E-commerce-Prod`
4. Click "Set Up"

### Step 3: Choose Analysis Method

1. Select "With GitHub Actions"
2. SonarCloud will show you a token
3. **Copy the token** (you'll need it for GitHub secrets)

### Step 4: Add GitHub Secrets

Go to your GitHub repository:
```
https://github.com/bashairfan0911/E-commerce-Prod/settings/secrets/actions
```

Add these secrets:

| Secret Name | Value |
|------------|-------|
| `SONAR_TOKEN` | The token from SonarCloud |
| `SONAR_HOST_URL` | `https://sonarcloud.io` |

### Step 5: Verify Configuration

Your `sonar-project.properties` should have:
```properties
sonar.projectKey=bashairfan0911_E-commerce-Prod
sonar.organization=bashairfan0911
```

### Step 6: Test

Push to test-dev branch:
```bash
git push origin test-dev
```

Check the pipeline in GitHub Actions.

## Troubleshooting

### Error: "You must define sonar.organization"
**Solution**: Make sure `sonar-project.properties` has:
```properties
sonar.organization=bashairfan0911
```

### Error: "Invalid authentication token"
**Solution**: 
1. Generate a new token in SonarCloud
2. Update `SONAR_TOKEN` secret in GitHub

### Error: "Project not found"
**Solution**:
1. Verify project exists in SonarCloud
2. Check `sonar.projectKey` matches exactly

## SonarCloud Dashboard

After successful scan, view results at:
```
https://sonarcloud.io/project/overview?id=bashairfan0911_E-commerce-Prod
```

## What SonarCloud Checks

- 🐛 **Bugs** - Potential runtime errors
- 🔒 **Security Vulnerabilities** - Security issues
- 💩 **Code Smells** - Maintainability issues
- 📊 **Coverage** - Test coverage percentage
- 🔄 **Duplications** - Duplicate code blocks

## Quality Gate

Default quality gate requires:
- No new bugs
- No new vulnerabilities
- Coverage on new code > 80%
- Duplicated lines on new code < 3%

## Optional: Disable SonarQube

If you don't want to use SonarCloud, you can:

1. **Remove from workflow** - Edit `.github/workflows/ci-cd.yml`
2. **Or keep it optional** - It's already set to `continue-on-error: true`

The pipeline will continue even if SonarQube fails.

## Support

- SonarCloud Docs: https://docs.sonarcloud.io/
- Community: https://community.sonarsource.com/
