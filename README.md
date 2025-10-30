# EkoMart - E-Commerce Platform

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application with admin panel, product management, shopping cart, and payment integration using Razorpay.

## Features

### Customer Features
- User authentication (Login/Signup with JWT)
- Browse products by categories
- Product search and filtering
- Shopping cart management
- Wishlist functionality
- Checkout and order placement
- Order tracking
- User profile and address management
- Razorpay payment integration

### Admin Features
- Admin dashboard
- Product management (Add, View, Delete)
- Category management
- Image upload with Cloudinary integration
- Order management

## Tech Stack

### Frontend
- React 18 with Vite
- React Router DOM for navigation
- Material-UI (MUI) for UI components
- Axios for API calls
- React Toastify for notifications
- Swiper for carousels
- Styled Components

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Cloudinary for image storage
- Razorpay for payment processing
- CORS enabled

## Project Structure

```
├── backend/
│   ├── Controller/       # Business logic
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── checkoutController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── Models/          # Database schemas
│   │   ├── cartModel.js
│   │   ├── categoryModel.js
│   │   ├── orderModel.js
│   │   ├── productModel.js
│   │   └── userModel.js
│   ├── Routes/          # API routes
│   │   ├── cartRoute.js
│   │   ├── categoryRoute.js
│   │   ├── checkoutRoute.js
│   │   ├── productRoute.js
│   │   └── userRoute.js
│   ├── utils/           # Utility functions
│   ├── index.js         # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/      # Static assets
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   │   ├── Home/
│   │   │   ├── Products/
│   │   │   ├── Cart/
│   │   │   ├── User/
│   │   │   └── admin/
│   │   ├── utils/       # Helper functions
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .env                 # Environment variables
├── .gitignore
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher) - [Download](https://nodejs.org/)
- npm (comes with Node.js)
- MongoDB Atlas account or local MongoDB installation
- Cloudinary account for image storage
- Razorpay account for payment integration

Verify installations:
```bash
node -v
npm -v
```

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Arfath02/NN.git
cd E-commerce-prod
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the root directory (not in backend folder) with the following variables:

```env
# Database
DBURI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET_KEY=your_jwt_secret_key

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET_KEY=your_cloudinary_api_secret

# Server Port (optional)
PORT=5000
```

**Important Notes:**
- Replace `your_mongodb_connection_string` with your MongoDB Atlas URI or local MongoDB URI
- Generate a strong JWT secret key (you can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- Get Cloudinary credentials from your [Cloudinary Dashboard](https://cloudinary.com/console)
- The backend uses `process.env.DBURI` (not MONGODB_URI)

#### Start Backend Server
```bash
npm start
```

The backend server will run on `http://localhost:5000` (or your specified PORT)

### 3. Frontend Setup

Open a new terminal window:

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (Vite default port)

## Usage

### Access the Application
- **Frontend (Customer):** http://localhost:5173
- **Admin Panel:** http://localhost:5173/admin/login
- **Backend API:** http://localhost:5000

### API Endpoints

#### Products
- `POST /api/addproduct` - Add new product (with image upload)
- `GET /api/allproducts` - Get all products
- `GET /api/singleproduct/:id` - Get single product
- `GET /api/productdelete/:id` - Delete product

#### Categories
- `/api/category/*` - Category management routes

#### Users
- `/api/user/*` - User authentication and management routes

#### Cart
- `/api/cart/*` - Shopping cart operations

#### Checkout
- `/api/checkout/*` - Order and payment processing

## Building for Production

### Frontend
```bash
cd frontend
npm run build
```
The build files will be in `frontend/dist/`

### Backend
The backend is production-ready. Just ensure:
- Environment variables are properly set
- MongoDB connection is stable
- Use a process manager like PM2 for deployment

## Deployment

### Frontend (Netlify)
The project includes a `netlify.toml` configuration file for easy Netlify deployment:
```bash
cd frontend
npm run build
# Deploy the dist folder to Netlify
```

### Backend
Can be deployed to:
- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean

Make sure to set environment variables in your hosting platform.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your DBURI in .env file
   - Check if MongoDB Atlas IP whitelist includes your IP
   - Ensure database user has proper permissions

2. **Cloudinary Upload Fails**
   - Verify Cloudinary credentials in .env
   - Check if uploads folder exists in backend directory

3. **CORS Errors**
   - Backend has CORS enabled by default
   - If issues persist, configure CORS origin in backend/index.js

4. **Port Already in Use**
   - Change PORT in .env file
   - Kill the process using the port

## Demo

[View Demo Video](https://drive.google.com/file/d/1P4Ycw4Qbdx6W8n8YZ0HFg_ysn3RiOcSd/view?usp=drivesdk)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

Project Link: [https://github.com/bashairfan0911/E-commerce-Prod.git](https://github.com/bashairfan0911/E-commerce-Prod.git)
