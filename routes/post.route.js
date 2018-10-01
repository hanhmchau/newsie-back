const Router = require('express-promise-router');
const router = new Router();
const postController = require('../controllers/post.controller');

router.get('/picku', postController.uploadPreviewImage);

module.exports = router;