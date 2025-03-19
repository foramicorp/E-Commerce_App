const Cart = require("../Models/cart.model");
const Product = require("../Models/product.model");

// ADD TO CART CONTROLLER
const addToCart = async (req, res) => {
    try {

        // RECIEVE PRODUCTID AND QUANTITY FROM REQ.BODY
        const { productId, quantity } = req.body;
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

        // CALCULATING THE PRICE OF PRODUCT 
        const price = product.price * quantity;

        // FINDING THE USER'S CART  OR CREATING A NEW ONE IF NOT FOUND
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalPrice: 0 });
        }

        // CHECKING IF PRODUCT IS ALREADY IN THE CART
        const existingItem = cart.items.find((item) => item.product.toString() === productId);

        // UPDATING THE CART OR ADDING NEW ITEM  IF NOT EXISTING
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price += price;
        } else {
            cart.items.push({ product: productId, quantity, price });
        }

        // UPDATING THE CART IN THE DATABASE  AND RETURNING THE UPDATED CART
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price, 0);

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
        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart) {
            return res.status(404).json({ message: "Cart is empty" });
        }
        res.status(200).json({ cart });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// REMOVE ITEM FROM CART CONTROLLER
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId });
        if (!cart)

            return res.status(404).json({ message: "Cart not found" });


        cart.items = cart.items.filter(item => item.productId.toString() !== productId);


        cart.totalPrice = cart.items.reduce((total, item) => {
            return total + item.quantity * item.productId.price;
        }, 0);

        await cart.save();
        res.status(200).json({ message: "Item removed from cart", cart });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CLEAR CART CONTROLLER
const clearCart = async (req, res) => {
    try {

        const cartId = req.params.id;
        await Cart.findOneAndDelete({ cartId  });

        res.status(200).json({ message: "Cart cleared successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// EXPORTING CART CONTROLLERS
module.exports = { addToCart, getCart, removeFromCart, clearCart };