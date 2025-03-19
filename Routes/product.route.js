// IMPORTING REQUIREMENTS
const Router = require('express');
const isAdmin = require('../Middlewares/role.middleware');
const { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../Controllers/product.controller');
const isToken = require('../Middlewares/auth.middleware');

// INITIALIZING ROUTER
const productRouter = Router();

// ROUTING FOR PRODUCTS
productRouter.post('/add-product', isToken, isAdmin, addProduct);
productRouter.get('/get-allproduct', getAllProducts);
productRouter.get('/get-productbyid/:id', isToken, isAdmin, getProductById);
productRouter.put('/update-product/:id', isToken, isAdmin, updateProduct);
productRouter.delete('/delete-product/:id', isToken, isAdmin, deleteProduct);

// EXPORTING THE ROUTER
module.exports = productRouter
