# GitHub Deployment Guide

## Prerequisites

1. **Git installed** on your computer
2. **GitHub account** created
3. **Repository created** on GitHub (or create a new one)

## Step 1: Initialize Git (if not already done)

```bash
# Navigate to your project root
cd E-commerce-prod

# Initialize git (skip if already initialized)
git init
```

## Step 2: Create .gitignore File

Make sure you have a `.gitignore` file to exclude sensitive files:

```
# Dependencies
node_modules/
frontend/node_modules/
backend/node_modules/

# Environment variables
.env
backend/.env
frontend/.env

# Build files
frontend/dist/
frontend/build/
backend/dist/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Uploads (optional - if you want to exclude uploaded files)
backend/uploads/

# Testing
coverage/
.nyc_output/
```

## Step 3: Add Files to Git

```bash
# Add all files
git add .

# Or add specific files
git add frontend/
git add backend/
git add README.md
```

## Step 4: Commit Changes

```bash
git commit -m "Initial commit: E-commerce application with all features"
```

## Step 5: Connect to GitHub Repository

### Option A: New Repository

1. Go to GitHub.com
2. Click "New Repository"
3. Name it (e.g., "ecommerce-app")
4. Don't initialize with README (you already have one)
5. Copy the repository URL

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Option B: Existing Repository

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Pull existing changes (if any)
git pull origin main --allow-unrelated-histories

# Push your code
git push -u origin main
```

## Step 6: Verify Upload

1. Go to your GitHub repository
2. Refresh the page
3. You should see all your files!

## Important: Protect Sensitive Data

### Before Pushing, Make Sure:

1. **.env files are NOT included** (check .gitignore)
2. **No API keys in code** (they should be in .env)
3. **No passwords in code**

### Your .env File Should NOT Be Pushed

The `.env` file contains:
- Database credentials
- Cloudinary API keys
- JWT secrets
- Razorpay keys

**These should NEVER be on GitHub!**

## Step 7: Create Environment Variables on Deployment

When deploying, you'll need to set these environment variables:

### Backend Environment Variables:
```
DBURI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET_KEY=your_cloudinary_secret
KEY_ID=your_razorpay_key_id
KEY_SECRET=your_razorpay_key_secret
PORT=5000
```

## Common Git Commands

### Check Status
```bash
git status
```

### Add More Changes
```bash
git add .
git commit -m "Your commit message"
git push
```

### Pull Latest Changes
```bash
git pull origin main
```

### Create a New Branch
```bash
git checkout -b feature-name
```

### Switch Branches
```bash
git checkout main
```

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin YOUR_REPO_URL
```

### Error: "failed to push some refs"
```bash
git pull origin main --rebase
git push origin main
```

### Error: "Permission denied"
- Make sure you're logged into GitHub
- Use HTTPS URL or set up SSH keys

## Next Steps After GitHub

1. **Deploy Backend** (Render, Railway, Heroku)
2. **Deploy Frontend** (Vercel, Netlify)
3. **Set up CI/CD** (GitHub Actions)
4. **Add collaborators** (if team project)

## Repository Structure

Your repository should look like:
```
ecommerce-app/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/
│   ├── Controller/
│   ├── Models/
│   ├── Routes/
│   ├── utils/
│   ├── package.json
│   └── ...
├── README.md
├── .gitignore
└── documentation files
```

## Security Checklist

Before pushing:
- [ ] .env file is in .gitignore
- [ ] No API keys in code
- [ ] No passwords in code
- [ ] No sensitive data in comments
- [ ] Database connection string not hardcoded
- [ ] All secrets in environment variables

## Good Commit Messages

Examples:
- "Initial commit: E-commerce application"
- "Add: Product image upload functionality"
- "Fix: Cart not clearing after order"
- "Update: Order tracking with cancel button"
- "Refactor: Improve error handling"

## Congratulations! 🎉

Your code is now on GitHub and ready to share or deploy!
