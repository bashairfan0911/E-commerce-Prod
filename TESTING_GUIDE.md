# EkoMart Testing Guide

## How to Place an Order

### Step 1: Create a User Account
1. Go to `http://localhost:5173/signup`
2. Fill in the signup form:
   - Username: testuser
   - Email: test@example.com
   - Password: test123
3. Click "Register Account"
4. You'll be redirected to login page

### Step 2: Login
1. Go to `http://localhost:5173/login`
2. Enter your credentials:
   - Email: test@example.com
   - Password: test123
3. Click "Login Account"

### Step 3: Browse Products
1. Go to home page: `http://localhost:5173/`
2. Browse the 8 sample products we added
3. Click on any product to view details

### Step 4: Add to Cart
1. On product detail page, click "Add to Cart"
2. You should see a success message
3. Click on the cart icon in the header

### Step 5: View Cart
1. Go to `http://localhost:5173/cart`
2. You'll see all items in your cart
3. You can:
   - Update quantity using +/- buttons
   - Remove items
   - See total price

### Step 6: Proceed to Checkout
1. Click "Proceed To Checkout" button
2. You'll be redirected to checkout page

### Step 7: Fill Billing Details
1. Fill in all required fields:
   - First Name
   - Last Name
   - Email (auto-filled)
   - Country
   - Street Address
   - Town/City
   - State
   - Zip Code
   - Phone
2. Click "Update Address" to save

### Step 8: Select Payment Method
1. Choose payment method:
   - **Cash On Delivery** (Recommended - works without Razorpay)
   - Online (requires Razorpay configuration)
2. Check "I have read and agree terms and conditions"

### Step 9: Place Order
1. Click "Place Order" button
2. For Cash on Delivery:
   - Order will be placed immediately
   - Success message will appear
   - You'll be redirected to orders page

## Current Limitations

### Payment Gateway
- **Razorpay is not configured** with valid credentials
- **Use "Cash On Delivery"** for testing orders
- Online payment will show an error message

### To Enable Online Payments:
1. Get Razorpay API keys from https://dashboard.razorpay.com/
2. Update `backend/.env`:
   ```
   KEY_ID=rzp_test_YOUR_KEY_ID
   KEY_SECRET=YOUR_SECRET_KEY
   ```
3. Update Razorpay key in `frontend/src/pages/User/Checkout.jsx` (line 186)
4. Restart backend server

## Admin Panel

### Login to Admin
1. Go to `http://localhost:5173/admin/login`
2. Use credentials:
   - Email: admin@ekomart.com
   - Password: admin123

### Admin Features
- **Dashboard**: View statistics (products, categories, orders, users)
- **All Products**: View all 8 products
- **Add Product**: Add new products (requires valid Cloudinary credentials)
- **All Categories**: View all 3 categories
- **Add Category**: Add new categories (requires valid Cloudinary credentials)

## Sample Data

### Categories (3)
1. Fruits & Vegetables
2. Dairy & Eggs
3. Snacks & Beverages

### Products (8)
1. Fresh Organic Apples - ₹135
2. Organic Bananas - ₹57
3. Fresh Tomatoes - ₹34
4. Fresh Milk - ₹54
5. Farm Fresh Eggs - ₹72
6. Greek Yogurt - ₹96
7. Potato Chips - ₹45
8. Orange Juice - ₹85

## Troubleshooting

### "Category not added" Error
- Cloudinary credentials may be invalid
- Check `backend/.env` for correct Cloudinary settings
- Use the seed script instead: `node backend/seedData.js`

### "Payment service not configured" Error
- This is expected if Razorpay isn't set up
- Use "Cash On Delivery" payment method instead

### Database Connection Error
- Check if MongoDB URI is correct in `backend/.env`
- Current URI: `mongodb+srv://bashairfan518:Irfan86101@cluster0.hwcnddm.mongodb.net/ekomart`

### Cart is Empty
- Make sure you're logged in
- Try adding products again
- Check browser console for errors

## Quick Commands

### Start Backend
```bash
cd backend
npm start
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Seed Database
```bash
node backend/seedData.js
```

### Clear Database and Re-seed
```bash
node backend/seedData.js
```
(The script automatically clears existing data before seeding)

## API Endpoints

### Products
- GET `/api/allproducts` - Get all products
- GET `/api/singleproduct/:id` - Get single product
- POST `/api/addproduct` - Add new product (admin)
- GET `/api/productdelete/:id` - Delete product (admin)

### Categories
- GET `/api/allcategory` - Get all categories
- POST `/api/addcategory` - Add new category (admin)
- GET `/api/categorydelete/:id` - Delete category (admin)

### Users
- POST `/api/signup` - Register new user
- POST `/api/login` - Login user
- GET `/api/userdetails` - Get user details
- POST `/api/userupdate` - Update user details
- POST `/api/useraddress` - Update user address

### Cart
- POST `/api/addtocart` - Add item to cart
- POST `/api/showcart` - Get cart items
- POST `/api/updatecart` - Update cart quantity
- POST `/api/deletecart` - Remove item from cart

### Orders
- POST `/api/createorder` - Create new order
- GET `/api/showorder/:orderId` - Get order details
- POST `/api/startpayment` - Initiate payment (Razorpay)

## Notes

- All prices are in Indian Rupees (₹)
- Images are using Cloudinary demo URLs
- For production, replace demo images with actual product images
- Make sure to secure admin routes in production
- Add proper authentication middleware for protected routes
