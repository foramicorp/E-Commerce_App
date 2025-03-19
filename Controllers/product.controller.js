// IMPORTING REQUIREMENTS
const Product = require('../Models/product.model');

// ADD PRODUCT CONTROLLER (ONLY ALLOW TO ADMIN)
const addProduct = async (req, res) => {
    try {
        // GETTING PRODUCT DATA FROM REQ.BODY
        const { name, description, price, category, image } = req.body;
        const addedBy = req.user._id;

        // VALIDATING INPUT
        if (!name || !description || !image || !price || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // CREATING AND SAVING NEW PRODUCT TO DB
        const product = new Product({
            name,
            description,
            image,
            price,
            category,
            addedBy
        })
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
// GET ALL PRODUCT
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('addedBy', 'userId name email')
        return res.json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

// UPDATE PRODUCT CONTROLLER 
const updateProduct = async (req, res) => {
    try {
        // FIND PRODUCT AND UPDATE
        const productId = req.params.id;
        const product = await Product.findByIdAndUpdate(productId, {new : true});
        console.log(product);
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

// EXPORTING CONTROLLERS
module.exports = {
    addProduct,
    getProductById,
    getAllProducts,
    updateProduct,
    deleteProduct,
}

