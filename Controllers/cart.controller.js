const Cart = require("../Models/cart.model");
const Product = require("../Models/product.model");

const addToCart = async (req, res) => {
    try {
        // RECEIVE PRODUCTID AND QUANTITY FROM REQ.BODY
        const { productId, name, quantity } = req.body;
        const userId = req.user.id;

        // VALIDATE INPUT
        if (!productId || !quantity) {
            return res.status(400).json({ message: "Product ID and quantity are required" });
        }

        // FINDING PRODUCT 
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // FIND OR CREATE A USER'S CART
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalPrice: 0 });
        }

        // CHECK IF PRODUCT ALREADY EXISTS IN THE CART
        const existItem = cart.items.find((item) => item.product.toString() === productId);

        if (existItem) {
            existItem.quantity += quantity;

        } else {
            cart.items.push({ product: productId, name: product.name, quantity, price: product.price });
        }

        // CALCULATE TOTAL CART PRICE
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // SAVE THE UPDATED CART
        await cart.save();

        res.status(200).json({ message: "Item added to cart", cart });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET CART CONTROLLER
const getCart = async (req, res) => {
    try {

        // FINDING THE USER'S CART  OR RETURNING EMPTY CART IF NOT FOUND  IF NOT FOUND
        const userId = req.user.id;

        // POPULATING THE PRODUCTS IN THE CART  AND RETURNING THE UPDATED CART  IF NOT FOUND
        const cart = await Cart.findOne({ user: userId }).populate("items.product", 'categoryName name ');

        if (!cart) {
            return res.status(404).json({ message: "Cart is empty" });
        }
        res.status(200).json({ cart });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// CLEAR CART CONTROLLER
const clearCart = async (req, res) => {
    try {

        const userId = req.params.id;
        await Cart.findOneAndDelete({ userId: userId })

        res.status(200).json({ message: "Cart cleared successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// EXPORTING CART CONTROLLERS
module.exports = { addToCart, getCart, clearCart };