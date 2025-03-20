// IMPORTING REQUIREMENTS
const express = require('express');
const dbConnect = require('./Configs/db.config');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

const userRouter = require('./Routes/user.route');
const productRouter = require('./Routes/product.route');
const cartRouter = require('./Routes/cart.route');
const orderRouter = require('./Routes/order.route');
const categoryRouter = require('./Routes/category.route');

// WELCOME ROUTE
app.get('/', (req, res) => {
    res.send("welcome to the api");
})

// USING ROUTERS
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/category', categoryRouter);


// STARTING THE SERVER ON PORT 8090 AND CONNECTING TO THE DATABASE
app.listen(8090, () => {
    console.log('Server started on port 8090');
    dbConnect()
});
