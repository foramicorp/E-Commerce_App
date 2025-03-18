const express = require('express');
const dbConnect = require('./Configs/db.config');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(cookieParser());
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const userRouter = require('./Routes/user.route');
const productRouter = require('./Routes/product.route');
app.use(express.urlencoded({ extended: true }));
app.use("/Uploads", express.static(path.join(__dirname, "Uploads")))

app.get('/', (req, res) => {
    res.send("welcome to the api");
})

app.use('/api/user' , userRouter);
app.use('/api/product' , productRouter);


app.listen(8090 , () => {
    console.log('Server started on port 8090');
    dbConnect()
})