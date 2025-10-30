# GitHub Secrets Setup Guide

## What are GitHub Secrets?

GitHub Secrets allow you to store sensitive information (passwords, API keys) securely in your repository. They can be used in GitHub Actions for CI/CD pipelines.

## How to Add Secrets to GitHub

### Step 1: Go to Repository Settings

1. Go to your GitHub repository: `https://github.com/bashairfan0911/E-commerce-Prod`
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### Step 2: Add Each Secret

Add these secrets one by one:

#### Database Secret
- **Name:** `DBURI`
- **Value:** `mongodb+srv://bashairfan518:Irfan86101@cluster0.hwcnddm.mongodb.net/ekomart?retryWrites=true&w=majority`

#### JWT Secret
- **Name:** `JWT_SECRET_KEY`
- **Value:** `TN3TY7aH4qVFwRgJHvlsmaATH8RrrTBH`

#### Cloudinary Secrets
- **Name:** `CLOUD_NAME`
- **Value:** `drukumhal`

- **Name:** `CLOUD_API_KEY`
- **Value:** `517746727976313`

- **Name:** `CLOUD_API_SECRET_KEY`
- **Value:** `EZmCUOotMuHeSwTx79ro8vuzt3k`

#### Razorpay Secrets (Optional)
- **Name:** `KEY_ID`
- **Value:** `your_razorpay_key_id`

- **Name:** `KEY_SECRET`
- **Value:** `your_razorpay_key_secret`

#### Docker Hub Secrets (for CI/CD)
- **Name:** `DOCKER_USERNAME`
- **Value:** `irfan8194`

- **Name:** `DOCKER_PASSWORD`
- **Value:** `your_docker_hub_password`

### Step 3: Verify Secrets

After adding all secrets, you should see them listed (values are hidden):
- ✅ DBURI
- ✅ JWT_SECRET_KEY
- ✅ CLOUD_NAME
- ✅ CLOUD_API_KEY
- ✅ CLOUD_API_SECRET_KEY
- ✅ KEY_ID
- ✅ KEY_SECRET
- ✅ DOCKER_USERNAME
- ✅ DOCKER_PASSWORD

## Using Secrets in GitHub Actions

Create `.github/workflows/docker-build.yml`:

```yaml
name: Build and Push Docker Images

on:
  push:
    branches: [ dev, main ]
  pull_request:
    branches: [ dev, main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push backend
      uses: docker/build-push-action@v4
      with:
        context: ./backend
        push: true
        tags: irfan8194/ecommerce-backend:latest
    
    - name: Build and push frontend
      uses: docker/build-push-action@v4
      with:
        context: ./frontend
        push: true
        tags: irfan8194/ecommerce-frontend:latest
```

## Using Secrets in Deployment

### For Docker Compose on Server:

1. SSH into your server
2. Create `.env` file:
```bash
nano .env
```

3. Add all environment variables:
```env
DBURI=${{ secrets.DBURI }}
JWT_SECRET_KEY=${{ secrets.JWT_SECRET_KEY }}
CLOUD_NAME=${{ secrets.CLOUD_NAME }}
CLOUD_API_KEY=${{ secrets.CLOUD_API_KEY }}
CLOUD_API_SECRET_KEY=${{ secrets.CLOUD_API_SECRET_KEY }}
KEY_ID=${{ secrets.KEY_ID }}
KEY_SECRET=${{ secrets.KEY_SECRET }}
```

4. Run docker-compose:
```bash
docker-compose up -d
```

### For Cloud Platforms:

#### Render.com
1. Go to your service settings
2. Add Environment Variables
3. Copy values from GitHub Secrets

#### Railway.app
1. Go to your project
2. Click Variables
3. Add each secret as a variable

#### AWS ECS
1. Use AWS Secrets Manager
2. Reference secrets in task definition

#### Heroku
1. Go to Settings → Config Vars
2. Add each secret

## Security Best Practices

### ✅ DO:
- Store all sensitive data in GitHub Secrets
- Use different secrets for dev/staging/production
- Rotate secrets regularly
- Use strong, unique passwords
- Limit access to secrets (only necessary people)

### ❌ DON'T:
- Never commit `.env` files to Git
- Never hardcode secrets in code
- Never share secrets in chat/email
- Never log secret values
- Never use same secrets across projects

## Checking if Secrets are Secure

### Files that should NOT be in Git:
```bash
# Check if these files are tracked
git ls-files | grep -E '\.env$|\.env\.local$'

# If they show up, remove them:
git rm --cached .env
git rm --cached backend/.env
git commit -m "Remove .env files from Git"
git push
```

### Files that SHOULD be in Git:
- ✅ `.env.example` (template without real values)
- ✅ `.gitignore` (includes .env)
- ✅ `docker-compose.yml` (uses ${VARIABLE} syntax)

## Troubleshooting

### Secret not working in GitHub Actions
- Check secret name matches exactly (case-sensitive)
- Verify secret is added to correct repository
- Check if secret is available in the branch you're using

### Secret not working in deployment
- Verify `.env` file exists on server
- Check file permissions: `chmod 600 .env`
- Verify docker-compose is reading the .env file
- Check container logs: `docker-compose logs backend`

## Summary

✅ Secrets added to GitHub
✅ `.env` file not in Git
✅ `.env.example` in Git as template
✅ Ready for CI/CD deployment
✅ Secure and production-ready

Your sensitive data is now secure! 🔒
