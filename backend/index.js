import express from 'express'
import cors from 'cors'
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import 'dotenv/config'
import DBConn from './utils/DBCon.js'


import productRoute from './Routes/productRoute.js'
import categoryRoute from './Routes/categoryRoute.js'
import userRoute from './Routes/userRoute.js'
import cartRoute from './Routes/cartRoute.js'
import checkoutRoute from './Routes/checkoutRoute.js'
import wishlistRoute from './Routes/wishlistRoute.js'

const app = express()
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads', 'products');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✓ Created uploads/products directory');
}

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req,res)=>{
    res.send('Hello world')
})

app.use("/api", productRoute)
app.use("/api", categoryRoute)
app.use("/api", userRoute)
app.use("/api", cartRoute)
app.use("/api", checkoutRoute)
app.use("/api", wishlistRoute)

// Database connection
DBConn();

const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})