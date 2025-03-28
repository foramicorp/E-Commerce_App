// IMPORTING REQUIREMENTS
const Category = require('../Models/category.model');
const Product = require('../Models/product.model');
const mongoose = require('mongoose');

// ADD PRODUCT CONTROLLER (ONLY ALLOW TO ADMIN)
const addProduct = async (req, res) => {
    try {

        // GETTING PRODUCT DATA FROM REQ.BODY
        const { name, description, price, categoryId, categoryName, image } = req.body;
        const addedBy = req.user._id;

        // VALIDATING INPUT
        if (!name || !description || !image || !price || !categoryId || !categoryName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return res.status(400).json({ error: "Invalid category ID" });
        }

        // CREATING AND SAVING NEW PRODUCT TO DB
        const product = new Product({

            name,
            description,
            image,
            price,
            category: new mongoose.Types.ObjectId(categoryId  ),
            categoryName,
            addedBy
        });
        await product.save();
        return res.status(201).json({ message: 'Product added successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

// GET PRODUCT BY ID (ONLY ALLOW TO ADMIN)
const getProductById = async (req, res) => {
    try {

        // FINDING PRODUCT BY ID
        const productId = req.params.id;
        const product = await Product.findById(productId).populate('category addedBy' , "name userId name email").select('-categoryName')

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.json(product);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}
// GET ALL PRODUCT
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("category addedBy" , "name email").select('-categoryName').sort({ _id: -1 }).lean()
        return res.status(200).json({ success : true , TotalProduct: products.length, products });

    } catch (error) {
        console.error(error);
        return res.status(500).json({success : false});
    }
};

// GET PRODUCT BY CATEGORY ID (ONLY ADMIN)
const getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ error: "Invalid category ID" });
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        const products = await Product.find({ category: categoryId }).populate('category addedBy', 'name userId name email').select('-categoryName').sort({ _id: -1 });
        res.status(200).json({ TotalProduct: products.length, products });

    } catch (error) {
        console.error("Error fetching products by category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// GET PRODUCT BY NAME
const getProductByCategoryName = async (req, res) => {
    try {

        const { name } = req.params;
        const category = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        const products = await Product.find({ category: category._id }).populate('category addedBy' , "name userId name email").select('-categoryName -__v -isDeleted').sort({ _id: -1 });
        res.status(200).json({ TotalProduct: products.length, products });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};  

// UPDATE PRODUCT CONTROLLER 
const updateProduct = async (req, res) => {
    try {

        // FIND PRODUCT AND UPDATE
        const productId = req.params.id;
        const product = await Product.findByIdAndUpdate(productId, req.body, { new: true });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ message: 'Product updated successfully', product });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

// DELETE PRODUCT CONTROLLER    
const deleteProduct = async (req, res) => {
    try {

        // FIND PRODUCT AND DELETE IT
        const productId = req.params.id;
        const product = await Product.findByIdAndUpdate({productId}, { isDeleted: true } , {new : true});

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.json({ message: 'Product deleted successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}


// EXPORTING CONTROLLERS
module.exports = {
    addProduct,
    getProductById,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getProductByCategoryName
};