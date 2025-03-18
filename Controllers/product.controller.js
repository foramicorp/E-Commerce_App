const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Product = require('../Models/product.model');
const upload = require('../Utils/imageUpload.util');

const addProduct = async (req, res) => {
    try {
        const { name, description,  price, category } = req.body;
        const image = req.file? req.file.path : null;
        const addedBy = req.user._id

        if (!name || !description || !image || !price || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const product = new Product({
            name,
            description,
            image: req.file.path,
            price,
            category,
            addedBy
        })
        await product.save();

        res.cookie("productId", product._id.toString(), {
            httpOnly: true,
            secure: true
        })

        return res.status(201).json({ message: 'Product added successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

const getProductById = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('addedBy' , 'userId name email')
        return res.json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const updatedProduct = req.body;
        const product = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });

    }
}

const deleteProduct = async (req , res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    addProduct,
    getProductById,
    getAllProducts,
    updateProduct,
    deleteProduct,

}

