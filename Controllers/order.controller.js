// IMPORTING REQUIREMENTS
const Cart = require("../Models/cart.model");
const Order = require("../Models/order.model");


// PLACE ORDER CONTROLLER
const placeOrder = async (req, res) => {
    try {
        const {paymentStatus} = req.body;
        const userId = req.user.id;

        // FETCHING CART DATA FROM DATABASE
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
    
        // VERIFYING CART DATA
        if (!cart) {
            return res.status(400).json({ message: "No cart found for this user" });
        }

        if (!cart.items || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // PLACING ORDER AND SAVING TO THE DATABASE
        const order = new Order({
            user : userId,
            items: cart.items,
            totalAmount: cart.totalPrice,
            paymentStatus ,
            status: "Pending"
        });

        await order.save();
        await Cart.findOneAndDelete({ user: userId });

        return res.status(201).json({ message: "Order placed successfully" });

    } catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// GET ORDER CONTROLLER
const getOrder = async (req, res) => {
    try {
        // FETCHING USERID AND FINDING ORDER
        const userId = req.user.id;
        const orders = await Order.find({ userId }).populate("items.product" , "category name").sort({ _id : -1});
        return res.json({orders});

    } catch (error) {   

        console.error("Error getting order", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// UPDATE ORDER STATUS CONTROLLER (CAN BE ONLY UPDATED BY ADMIN)
const updateOrderStatus = async (req, res) => {
    try {

        // VALIDATING ORDER ID AND STATUS

        const { orderId, status } = req.body;
        const validStatuses = ["Pending", "Delivered",];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        // FINDING ORDER AND UPDATING STATUS
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated", order });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// EXPORTING CONTROLLERS 
module.exports = {
    placeOrder,
    getOrder,
    updateOrderStatus,
}