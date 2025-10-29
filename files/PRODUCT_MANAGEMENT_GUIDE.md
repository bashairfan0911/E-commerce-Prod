# Product Management Guide

## How to Add and Edit Products

### Admin Access

1. **Login as Admin**
   - Navigate to: `http://localhost:5173/admin/login`
   - Use admin credentials to login
   - You'll be redirected to the admin dashboard

### Adding a New Product

1. **Navigate to Add Product Page**
   - From admin dashboard, click on "Add Product" in the sidebar
   - Or go directly to: `http://localhost:5173/admin/addproduct`

2. **Fill in Product Details**

   **Basic Information:**
   - **Product Title**: Enter the product name (e.g., "Fresh Organic Apples")
   - **Brand Name**: Enter the brand (e.g., "FreshFarms")
   - **Category**: Select from dropdown (must create categories first)
   - **Product Type**: Choose from:
     - `featuredGrocery` - Shows in Featured section on homepage
     - `discountGrocery` - Shows in Discount section
     - `weeklyGrocery` - Shows in Weekly Best Sellers
     - `weekendGrocery` - Shows in Weekend Discount
     - `topTrendingGrocery` - Shows in Top Trending section

   **Pricing:**
   - **Original Price**: Enter the original price (e.g., 150)
   - **Selling Price**: Enter the discounted price (e.g., 120)
   - **Discount**: Enter discount percentage (e.g., 20)

   **Product Details:**
   - **Weight**: Enter weight/quantity (e.g., "1 Kg", "500g Pack")
   - **Description**: Enter detailed product description
   - **Stock**: Enter available quantity (e.g., 100)

   **Images:**
   - Click "Choose Files" to upload product images
   - You can upload multiple images (recommended: 2-4 images)
   - Images will be displayed in a slider on product page
   - First image will be the main thumbnail

3. **Submit Product**
   - Click "Add Product" button
   - Wait for success message
   - Product will be added to the database

### Editing an Existing Product

1. **Navigate to All Products**
   - From admin dashboard, click on "All Products"
   - Or go to: `http://localhost:5173/admin/allproducts`

2. **Find the Product**
   - Browse through the product list
   - Use search if available
   - Click the "Edit" button (pencil icon) on the product you want to edit

3. **Update Product Details**
   - You'll be redirected to: `http://localhost:5173/admin/editproduct/:productId`
   - All current product information will be pre-filled
   - Update any fields you want to change:
     - Title, brand, category
     - Prices and discount
     - Weight, description, stock
     - Product type (to change which section it appears in)

4. **Update Images (Optional)**
   - Current images are displayed as thumbnails at the bottom of the form
   
   **To Remove Individual Images:**
   - Click the red "×" button on any image thumbnail
   - The image will be marked for removal
   - You'll see a notification confirming the action
   - The image will be deleted when you click "Update Product"
   
   **To Add More Images:**
   - Scroll to "Add More Images" section
   - Click "Choose Files" and select new images
   - You can select multiple images at once
   - New images will be added to the existing ones (not replace them)
   
   **Important Notes:**
   - You can remove some images and add new ones in the same update
   - If you remove all images, make sure to upload at least one new image
   - Changes are only saved when you click "Update Product"

5. **Save Changes**
   - Click "Update Product" button
   - Wait for success message
   - Changes will be reflected immediately on the website

### Managing Categories

Before adding products, you need to create categories:

1. **Add Category**
   - Go to: `http://localhost:5173/admin/addcategory`
   - Enter category name (e.g., "Fruits & Vegetables")
   - Upload category icon/image
   - Click "Add Category"

2. **View All Categories**
   - Go to: `http://localhost:5173/admin/allcategory`
   - See all existing categories
   - Delete categories if needed (products in that category will need reassignment)

### Product Types Explained

- **featuredGrocery**: Displayed in the "Featured Grocery" section on homepage
- **discountGrocery**: Displayed in the "Discount Products" section
- **weeklyGrocery**: Displayed in the "Weekly Best Sellers" section
- **weekendGrocery**: Displayed in the "Weekend Discount" section
- **topTrendingGrocery**: Displayed in the "Top Trending" section

You can assign multiple products to the same type. They will all appear in that section.

### Tips for Best Results

1. **Images**
   - Use high-quality images (recommended: 600x600px)
   - Upload at least 2 images per product
   - First image should be the best product shot

2. **Pricing**
   - Ensure selling price is less than original price
   - Discount percentage should match the price difference
   - Formula: `discount = ((originalPrice - sellingPrice) / originalPrice) * 100`

3. **Descriptions**
   - Write clear, detailed descriptions
   - Include key features and benefits
   - Mention any special attributes (organic, fresh, etc.)

4. **Stock Management**
   - Keep stock numbers updated
   - Products with 0 stock can still be viewed but may show "Out of Stock"

5. **Categories**
   - Create all necessary categories before adding products
   - Use clear, descriptive category names
   - Categories help customers find products easily

### Deleting Products

1. Go to "All Products" page
2. Find the product you want to delete
3. Click the "Delete" button (trash icon)
4. Confirm deletion
5. Product will be removed from database

### Viewing Products on Website

After adding/editing products:
- Homepage: Products appear in their respective sections based on type
- Products Page: `http://localhost:5173/products` - Shows all products
- Category Page: `http://localhost:5173/products/:categoryname` - Shows products by category
- Single Product: `http://localhost:5173/singleproduct/:productId` - Detailed product view

### Troubleshooting

**Product not showing on homepage:**
- Check if product type is set correctly
- Verify product is not out of stock
- Refresh the page

**Images not uploading:**
- Check file size (should be reasonable, < 5MB)
- Ensure file format is supported (JPG, PNG, WEBP)
- Check backend upload folder permissions

**Category not appearing:**
- Make sure category was created successfully
- Check if category has an image uploaded
- Verify category name spelling

### Admin Routes Summary

- Admin Login: `/admin/login`
- Dashboard: `/admin`
- All Products: `/admin/allproducts`
- Add Product: `/admin/addproduct`
- Edit Product: `/admin/editproduct/:id`
- All Categories: `/admin/allcategory`
- Add Category: `/admin/addcategory`
- Orders: `/admin/orders`

---

For technical issues or questions, refer to the main README.md or TESTING_GUIDE.md files.
