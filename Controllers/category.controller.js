const Category = require("../Models/category.model");


const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};


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

module.exports = { getCategories, addCategories };
