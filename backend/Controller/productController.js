import productModel from "../Models/productModel.js";
import fs from 'fs';
import path from 'path';
import cloudinary from "../utils/cloudinaryConfig.js";
import { fileURLToPath } from 'url';

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addProduct = async (req, res) => {
    try {
        const { title, description, originalprice, sellingprice, discount, category, brandname, weight, type } = req.body

        console.log('=== ADD PRODUCT REQUEST ===');
        console.log('Product data:', { title, category, brandname, weight, type });
        console.log('Files received:', req.files?.length || 0);

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Please upload at least one image" });
        }

        const images = [];

        for (const file of req.files) {
            try {
                console.log('Uploading file to Cloudinary:', file.filename);
                const result = await cloudinary.uploader.upload(file.path, { folder: 'products' })
                images.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
                console.log('File uploaded successfully:', result.public_id);
                fs.unlinkSync(path.join(__dirname, '../uploads/products', file.filename))
            } catch (error) {
                console.log('Error uploading file:', file.filename, error)
            }
        }

        if (images.length === 0) {
            return res.status(500).json({ message: "Failed to upload images to Cloudinary" });
        }

        console.log('Creating product with', images.length, 'images');
        const newProduct = new productModel({ title, images, description, originalprice, sellingprice, discount, category, brandname, weight, type })
        await newProduct.save()
        console.log('Product saved successfully:', newProduct._id);
        res.status(200).json({ message: "Product added successfully", newProduct })
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: "Product is not added", error: error.message })
    }
}

export const allProducts = async (req, res) => {
    try {
        const allproducts = await productModel.find();
        res.status(200).json({ message: "All product fetched", products: allproducts })
        // console.log(allproducts)
    } catch (error) {
        res.status(500).json({ message: "Products fetching problem" })
    }
}

export const singleProduct = async (req, res) => {
    const { id } = req.params;
    // const {id} = req.query;
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(400).json({ message: "Invalid product ID format" });
    // }
    try {
        const singleProduct = await productModel.findOne({ _id: id })
        res.status(200).json({ message: "Single product fetched", singleProduct: singleProduct })
    } catch (error) {
        res.status(500).json({ message: "Single products fetching problem" })
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await productModel.findOne({ _id: id })
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const images = product.images;

        for (const image of images) {
            try {
                await cloudinary.uploader.destroy(image.public_id)
                console.log(`Deleted image from Cloudinary: ${image.public_id}`);
            } catch (error) {
                console.log(`Error deleting image from Cloudinary: ${image.public_id}`, error);
            }
        }

        await productModel.deleteOne({ _id: id })
        res.status(200).json({ message: "Product deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Problem in delete product" })
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { title, description, originalprice, sellingprice, discount, category, brandname, weight, type, imagesToRemove, keepImages } = req.body;

    console.log('=== UPDATE PRODUCT REQUEST ===');
    console.log('Product ID:', id);
    console.log('imagesToRemove (raw):', imagesToRemove);
    console.log('keepImages (raw):', keepImages);
    console.log('Files uploaded:', req.files?.length || 0);

    try {
        const product = await productModel.findOne({ _id: id });
        if (!product) {
            console.log('Product not found:', id);
            return res.status(404).json({ message: "Product not found" });
        }

        console.log('Product found, updating...');

        // Update product fields
        product.title = title || product.title;
        product.description = description || product.description;
        product.originalprice = originalprice || product.originalprice;
        product.sellingprice = sellingprice || product.sellingprice;
        product.discount = discount || product.discount;
        product.category = category || product.category;
        product.brandname = brandname || product.brandname;
        product.weight = weight || product.weight;
        product.type = type || product.type;

        // Handle image removal
        if (imagesToRemove) {
            try {
                const idsToRemove = JSON.parse(imagesToRemove);
                console.log('Images to remove:', idsToRemove);

                for (const publicId of idsToRemove) {
                    try {
                        const result = await cloudinary.uploader.destroy(publicId);
                        console.log(`Deleted image from Cloudinary: ${publicId}`, result);
                    } catch (error) {
                        console.log(`Error deleting image: ${publicId}`, error);
                    }
                }
            } catch (parseError) {
                console.log('Error parsing imagesToRemove:', parseError);
            }
        }

        // Start with kept images
        let updatedImages = [];
        if (keepImages) {
            try {
                updatedImages = JSON.parse(keepImages);
                console.log('Parsed keepImages successfully:', updatedImages.length, 'images');
                console.log('Keep images details:', updatedImages.map(img => img.public_id));
            } catch (parseError) {
                console.log('Error parsing keepImages:', parseError);
                console.log('keepImages value was:', keepImages);
            }
        } else {
            console.log('No keepImages provided, starting with empty array');
        }

        // Add new images if uploaded
        if (req.files && req.files.length > 0) {
            console.log('Uploading new images...');

            for (const file of req.files) {
                try {
                    const result = await cloudinary.uploader.upload(file.path, { folder: 'products' });
                    updatedImages.push({
                        url: result.secure_url,
                        public_id: result.public_id
                    });
                    fs.unlinkSync(path.join(__dirname, '../uploads/products', file.filename));
                    console.log(`Uploaded new image: ${result.public_id}`);
                } catch (error) {
                    console.log('Error uploading file:', file.filename, error);
                }
            }
        }

        product.images = updatedImages;
        console.log('Final images array before save:', updatedImages.length, 'images');
        console.log('Image details:', updatedImages.map(img => ({ public_id: img.public_id, url: img.url.substring(0, 50) + '...' })));

        await product.save();
        console.log('Product saved successfully');

        // Verify the save by fetching again
        const savedProduct = await productModel.findOne({ _id: id });
        console.log('Verified saved product has', savedProduct.images.length, 'images');

        res.status(200).json({ message: "Product updated successfully", product: savedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: "Problem updating product", error: error.message });
    }
}