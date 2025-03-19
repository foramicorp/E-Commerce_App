// IMPORTING REQUIREMENTS
const Router = require("express");
const isToken = require("../Middlewares/auth.middleware");
const { addToCart, removeFromCart, clearCart, getCart } = require("../Controllers/cart.controller");
const cartRouter = Router();

// CART ROUTINGS
cartRouter.post("/addto-cart" , isToken , addToCart);
cartRouter.get("/get-cart" , isToken , getCart);
cartRouter.post("/remove-item", isToken , removeFromCart);
cartRouter.delete("/clear-cart" , isToken , clearCart);

// EXPORTING CART ROUTER
module.exports = cartRouter;