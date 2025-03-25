// IMPORTING REQUIREMENTS
const Router = require('express');
const isAdmin = require('../Middlewares/role.middleware');
const { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductsByCategory, getProductByCategoryName } = require('../Controllers/product.controller');
const isToken = require('../Middlewares/auth.middleware');

// INITIALIZING ROUTER
const productRouter = Router();

// ROUTING FOR PRODUCTS
productRouter.post('/add-product', isToken, isAdmin, addProduct);

productRouter.get('/get-allproduct', getAllProducts);
productRouter.get('/get-productbyid/:id', isToken, isAdmin, getProductById);
productRouter.get('/get-productby-category/:id', isToken, isAdmin, getProductsByCategory);
productRouter.get('/get-product-categoryby-name/:name', isToken, getProductByCategoryName);

productRouter.put('/update-product/:id', isToken, isAdmin, updateProduct);
productRouter.put('/delete-product/:id', isToken, isAdmin, deleteProduct);

// EXPORTING THE ROUTER
module.exports = productRouter
