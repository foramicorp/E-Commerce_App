// IMPORTING REQUIREMENTS
const Category = require("../Models/category.model");

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ _id: -1 });
        res.status(200).json({ TotalCategories: categories.length, categories })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ADD CATEGORY CONTROLLER
const addCategories = async (req, res) => {
    try {
        const categories = ["electronics", "clothing", "books", "home", "beauty", "other"];

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
