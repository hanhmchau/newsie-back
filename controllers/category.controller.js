const categoryService = require('../services/category.service');

exports.getAlLCategories = async (req, res) => {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
};