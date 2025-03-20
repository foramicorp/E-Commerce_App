// IMPORTING REQUIREMENTS
const Category = require("../Models/category.model");

// GET CATEGORY CONTROLLER
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ADD CATEGORY CONTROLLER
const addCategories = async (req, res) => {
    try {
        const categories = ["electronics", "elothing", "books", "home", "other"];

        for (const name of categories) {
            const existingCategory = await Category.findOne({ name });
            if (!existingCategory) {
                await Category.create({ name });
            }
        }
        res.status(201).json({ message: "Categories added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// EXPORTING CATEGORY CONTROLLERS
module.exports = { getCategories, addCategories };
