# Cloudinary Setup Guide

## The Problem
Images are not uploading because of invalid Cloudinary API credentials.

**Error:** `Invalid api_key 85853622288824149`

## Solution

### Step 1: Get Your Cloudinary Credentials

1. Go to https://cloudinary.com/console
2. Login to your account
3. On the dashboard, you'll see:
   - **Cloud Name**
   - **API Key** (15 digits)
   - **API Secret**

### Step 2: Update .env File

Open `backend/.env` and update these lines:

```env
# Cloudinary Configuration
CLOUD_NAME=your_cloud_name_here
CLOUD_API_KEY=your_15_digit_api_key_here
CLOUD_API_SECRET_KEY=your_api_secret_here
```

**Important:**
- API Key should be exactly **15 digits**
- No quotes around the values
- No spaces before or after the `=`

### Step 3: Restart Backend Server

```bash
# Stop the server (Ctrl+C)
# Start it again
npm start
```

### Step 4: Test Image Upload

1. Go to Add Product or Edit Product
2. Select images
3. Fill in all fields
4. Click Save/Update
5. Images should now upload successfully!

## How to Verify Credentials

### Test in Backend Console:
Add this to your backend code temporarily:

```javascript
console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET_KEY ? '***' : 'MISSING'
});
```

### Expected Output:
```
Cloudinary Config: {
  cloud_name: 'dmoe3eb6c',
  api_key: '858536222888241',  // Should be 15 digits
  api_secret: '***'
}
```

## Common Issues

### Issue 1: API Key has wrong number of digits
**Symptom:** `Invalid api_key` error
**Solution:** Copy the exact API Key from Cloudinary dashboard

### Issue 2: Credentials not loading
**Symptom:** `undefined` values
**Solution:** 
- Make sure `.env` file is in `backend/` folder
- Restart server after changing `.env`
- Check for typos in variable names

### Issue 3: Still getting 401 error
**Symptom:** `http_code: 401`
**Solution:**
- Verify credentials on Cloudinary dashboard
- Make sure account is active
- Check if API access is enabled

## Success Indicators

When credentials are correct, you'll see:
```
Uploading file to Cloudinary: ...
File uploaded successfully: products/abc123
```

And images will appear in your Cloudinary dashboard under the "products" folder.

## Need Help?

If you don't have a Cloudinary account:
1. Sign up at https://cloudinary.com/users/register/free
2. Free tier includes:
   - 25 GB storage
   - 25 GB bandwidth
   - Perfect for development

After signup, follow Step 1 above to get your credentials.
