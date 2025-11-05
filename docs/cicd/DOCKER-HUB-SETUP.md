# Docker Hub Setup Guide

## Issue: "access token has insufficient scopes"

This error means your Docker Hub token doesn't have the right permissions.

## Fix: Create New Access Token

### Step 1: Go to Docker Hub

1. Visit: https://hub.docker.com
2. Login with your credentials
3. Click on your username (top right)
4. Select "Account Settings"

### Step 2: Create Access Token

1. Click "Security" in the left sidebar
2. Click "New Access Token"
3. Fill in the details:
   - **Description**: `github-actions-ekomart`
   - **Access permissions**: Select **"Read, Write, Delete"**
4. Click "Generate"
5. **COPY THE TOKEN** (you won't see it again!)

### Step 3: Update GitHub Secret

1. Go to your GitHub repository:
   ```
   https://github.com/bashairfan0911/E-commerce-Prod/settings/secrets/actions
   ```

2. Find `DOCKER_PASSWORD` secret
3. Click "Update" (or delete and create new)
4. Paste the new token
5. Click "Update secret"

### Step 4: Verify DOCKER_USERNAME

Make sure you also have `DOCKER_USERNAME` secret set to your Docker Hub username (not email).

| Secret Name | Value | Example |
|------------|-------|---------|
| `DOCKER_USERNAME` | Your Docker Hub username | `bashairfan0911` |
| `DOCKER_PASSWORD` | Access token from Step 2 | `dckr_pat_abc123...` |

### Step 5: Test

Push to test-dev branch:
```bash
git push origin test-dev
```

The Docker build and push should now work!

## Alternative: Use Docker Hub Password

If you don't want to use access tokens, you can use your Docker Hub password:

1. Go to GitHub secrets
2. Update `DOCKER_PASSWORD` with your actual Docker Hub password
3. **Note**: This is less secure than using access tokens

## Troubleshooting

### Error: "repository does not exist"

**Solution**: Create the repositories manually on Docker Hub:

1. Go to https://hub.docker.com
2. Click "Create Repository"
3. Create two repositories:
   - `ekomart-backend`
   - `ekomart-frontend`
4. Set visibility to "Public" (or "Private" if you have a paid plan)

### Error: "unauthorized"

**Solution**: 
1. Verify your Docker Hub username is correct
2. Make sure the token hasn't expired
3. Generate a new token with proper permissions

### Error: "rate limit exceeded"

**Solution**: 
- Docker Hub has rate limits for anonymous users
- Login with your account (which you're doing)
- Wait a few minutes and try again

## Verify Your Setup

After updating the token, check:

1. ✅ `DOCKER_USERNAME` = your Docker Hub username
2. ✅ `DOCKER_PASSWORD` = access token with Read, Write, Delete permissions
3. ✅ Repositories exist on Docker Hub (or set to auto-create)

## Security Best Practices

1. ✅ Use access tokens instead of passwords
2. ✅ Set token description to identify its use
3. ✅ Rotate tokens periodically
4. ✅ Delete unused tokens
5. ✅ Never commit tokens to git

## Next Steps

After fixing the token:
1. Push to test-dev
2. Check GitHub Actions
3. Verify images appear on Docker Hub
4. Pull and test the images locally

---

**Need Help?**
- Docker Hub Docs: https://docs.docker.com/docker-hub/access-tokens/
- GitHub Secrets: https://docs.github.com/en/actions/security-guides/encrypted-secrets
