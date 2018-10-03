var express = require('express');
var router = express.Router();
const userRouter = require('./user.route');
const postRouter = require('./post.route');
const categoryRouter = require('./category.route');

router.use('/user', userRouter);
router.use('/post', postRouter);
router.use('/category', categoryRouter);

module.exports = router;