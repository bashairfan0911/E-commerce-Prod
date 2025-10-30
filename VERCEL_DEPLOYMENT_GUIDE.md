# 🚀 Vercel Deployment Guide

## 📋 Prerequisites
- GitHub account with your repository
- Vercel account (sign up at https://vercel.com)
- MongoDB Atlas database (already configured)
- Cloudinary account (already configured)

---

## 🎯 Deployment Steps

### **Step 1: Prepare Your Repository**

1. **Ensure all changes are committed:**
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

### **Step 2: Deploy to Vercel**

#### **Option A: Using Vercel Dashboard (Easiest)**

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Click "Sign Up" or "Login"
   - Choose "Continue with GitHub"

2. **Import Your Project:**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Add Environment Variables:**
   Click "Environment Variables" and add:

   **Frontend Variables:**
   ```
   VITE_API_URL=https://your-backend-url.vercel.app
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete

---

### **Step 3: Deploy Backend Separately**

Since Vercel has limitations with Express apps, deploy backend to **Railway** or **Render**:

#### **Option B: Deploy Backend to Railway (Recommended)**

1. **Go to Railway:**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Backend:**
   - **Root Directory:** `backend`
   - **Start Command:** `node server.js`

4. **Add Environment Variables:**
   ```
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   CLOUD_NAME=your_cloudinary_name
   CLOUD_API_KEY=your_cloudinary_key
   CLOUD_API_SECRET_KEY=your_cloudinary_secret
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

5. **Deploy:**
   - Railway will auto-deploy
   - Copy the generated URL (e.g., `https://your-app.railway.app`)

6. **Update Frontend Environment:**
   - Go back to Vercel dashboard
   - Update `VITE_API_URL` with Railway backend URL
   - Redeploy frontend

---

## 🔧 Alternative: Vercel Serverless Backend

If you want both on Vercel, you need to modify the backend structure:

### **Create API Routes Structure:**

```
backend/
├── api/
│   ├── products.js
│   ├── users.js
│   ├── orders.js
│   └── checkout.js
└── vercel.json
```

Each file exports a serverless function:
```javascript
// backend/api/products.js
module.exports = async (req, res) => {
  // Your route logic here
};
```

**Note:** This requires significant refactoring of your Express app.

---

## 📝 Environment Variables Checklist

### **Backend (Railway/Render):**
- ✅ `PORT`
- ✅ `MONGO_URI`
- ✅ `JWT_SECRET`
- ✅ `RAZORPAY_KEY_ID`
- ✅ `RAZORPAY_KEY_SECRET`
- ✅ `CLOUD_NAME`
- ✅ `CLOUD_API_KEY`
- ✅ `CLOUD_API_SECRET_KEY`
- ✅ `FRONTEND_URL`

### **Frontend (Vercel):**
- ✅ `VITE_API_URL`

---

## 🌐 Update CORS Settings

After deployment, update your backend CORS configuration:

```javascript
// backend/server.js
const corsOptions = {
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
};
```

---

## 🔍 Troubleshooting

### **Issue: API calls failing**
- Check `VITE_API_URL` is correct
- Verify CORS settings include Vercel domain
- Check backend logs on Railway/Render

### **Issue: Images not uploading**
- Verify Cloudinary credentials
- Check file size limits (Vercel: 4.5MB)

### **Issue: Build failing**
- Check Node version compatibility
- Verify all dependencies in `package.json`
- Check build logs for specific errors

---

## 🎉 Post-Deployment

1. **Test all features:**
   - User registration/login
   - Product browsing
   - Cart operations
   - Order placement
   - Admin panel

2. **Set up custom domain (optional):**
   - Go to Vercel project settings
   - Add your custom domain
   - Update DNS records

3. **Enable analytics:**
   - Vercel provides built-in analytics
   - Enable in project settings

---

## 📊 Recommended Architecture

```
┌─────────────────────┐
│   VERCEL (Frontend) │
│   your-app.vercel.app│
└──────────┬──────────┘
           │
           │ API Calls
           ▼
┌─────────────────────┐
│  RAILWAY (Backend)  │
│  your-api.railway.app│
└──────────┬──────────┘
           │
           ├──► MongoDB Atlas
           └──► Cloudinary
```

---

## 💡 Pro Tips

1. **Use environment-specific configs**
2. **Enable automatic deployments from GitHub**
3. **Set up preview deployments for branches**
4. **Monitor performance with Vercel Analytics**
5. **Use Railway's built-in logging**

---

## 🚀 Quick Deploy Commands

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy from command line
cd frontend
vercel

# Deploy to production
vercel --prod
```

---

**Your application will be live at:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-api.railway.app`

**Happy Deploying! 🎊**
