var express = require('express');
var router = express.Router();
const userRouter = require('./user.route');
const postRouter = require('./post.route');

router.use('/user', userRouter);
router.use('/post', postRouter);

module.exports = router;