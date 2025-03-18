const Router = require('express');
const upload = require('../Utils/imageUpload.util');
const isAdmin = require('../Middlewares/role.middleware');
const { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../Controllers/product.controller');

const isToken = require('../Middlewares/auth.middleware');

const productRouter = Router();

productRouter.post('/add-product' ,  isToken, isAdmin , addProduct);
productRouter.get('/get-allproduct' , getAllProducts);
productRouter.get('/get-productbyid' ,  isAdmin ,getProductById);
productRouter.put('/update-product' , isAdmin , updateProduct);
productRouter.delete('/delete-product'  ,isAdmin , deleteProduct);

module.exports = productRouter
