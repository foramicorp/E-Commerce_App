// IMPORTING REQUIREMENTS
const Router = require("express");
const isToken = require("../Middlewares/auth.middleware");
const { placeOrder, getOrder, updateOrderStatus } = require("../Controllers/order.controller");
const isAdmin = require("../Middlewares/role.middleware");
const orderRouter = Router();

// ORDER ROUTING
orderRouter.post("/place-order", isToken, placeOrder);
orderRouter.get("/get-order", isToken, getOrder);
orderRouter.put("/update-order", isToken, isAdmin, updateOrderStatus)

// EXPORTING ORDER ROUTER
module.exports = orderRouter;