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

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Please upload at least one image" });
        }

        const images = [];

        for (const file of req.files) {
            try {
                const result = await cloudinary.uploader.upload(file.path, { folder: 'products' })
                images.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
                fs.unlinkSync(path.join(__dirname, '../uploads/products', file.filename))
            } catch (error) {
                // Continue with other files
            }
        }

        if (images.length === 0) {
            return res.status(500).json({ message: "Failed to upload images to Cloudinary" });
        }

        const newProduct = new productModel({ title, images, description, originalprice, sellingprice, discount, category, brandname, weight, type })
        await newProduct.save()
        return res.status(200).json({ message: "Product added successfully", newProduct })
    } catch (error) {
        return res.status(500).json({ message: "Product is not added", error: error.message })
    }
}

export const allProducts = async (req, res) => {
    try {
        const allproducts = await productModel.find();
        return res.status(200).json({ message: "All product fetched", products: allproducts })
    } catch (error) {
        return res.status(500).json({ message: "Products fetching problem" })
    }
}

export const singleProduct = async (req, res) => {
    const { id } = req.params;
    
    try {
        const singleProduct = await productModel.findOne({ _id: id })
        return res.status(200).json({ message: "Single product fetched", singleProduct: singleProduct })
    } catch (error) {
        return res.status(500).json({ message: "Single products fetching problem" })
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
            } catch (error) {
                // Continue with other images
            }
        }

        await productModel.deleteOne({ _id: id })
        return res.status(200).json({ message: "Product deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Problem in delete product" })
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { title, description, originalprice, sellingprice, discount, category, brandname, weight, type, imagesToRemove, keepImages } = req.body;

    try {
        const product = await productModel.findOne({ _id: id });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.title = title || product.title;
        product.description = description || product.description;
        product.originalprice = originalprice || product.originalprice;
        product.sellingprice = sellingprice || product.sellingprice;
        product.discount = discount || product.discount;
        product.category = category || product.category;
        product.brandname = brandname || product.brandname;
        product.weight = weight || product.weight;
        product.type = type || product.type;

        if (imagesToRemove) {
            try {
                const idsToRemove = JSON.parse(imagesToRemove);

                for (const publicId of idsToRemove) {
                    try {
                        await cloudinary.uploader.destroy(publicId);
                    } catch (error) {
                        // Continue with other images
                    }
                }
            } catch (parseError) {
                // Invalid JSON, skip
            }
        }

        let updatedImages = [];
        if (keepImages) {
            try {
                updatedImages = JSON.parse(keepImages);
            } catch (parseError) {
                // Invalid JSON, start with empty array
            }
        }

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                try {
                    const result = await cloudinary.uploader.upload(file.path, { folder: 'products' });
                    updatedImages.push({
                        url: result.secure_url,
                        public_id: result.public_id
                    });
                    fs.unlinkSync(path.join(__dirname, '../uploads/products', file.filename));
                } catch (error) {
                    // Continue with other files
                }
            }
        }

        product.images = updatedImages;

        await product.save();

        const savedProduct = await productModel.findOne({ _id: id });

        return res.status(200).json({ message: "Product updated successfully", product: savedProduct });
    } catch (error) {
        return res.status(500).json({ message: "Problem updating product", error: error.message });
    }
}