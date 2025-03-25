// IMPORTING REQUIREMENTS
const Router = require("express");
const { getCategories, addCategories } = require("../Controllers/category.controller");
const isToken = require("../Middlewares/auth.middleware");
const isAdmin = require("../Middlewares/role.middleware");
const categoryRouter = Router();

// CATEGORY ROUTING
categoryRouter.get("/get-category", isToken, isAdmin, getCategories);
categoryRouter.post("/add-category", isToken, isAdmin, addCategories);

// EXPORTING CATEGORY ROUTER
module.exports = categoryRouter;

