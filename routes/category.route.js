const Router = require('express-promise-router');
const router = new Router();
const categoryController = require('../controllers/category.controller');

router.get('/', categoryController.getAlLCategories)

module.exports = router;