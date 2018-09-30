const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', userController.login);

module.exports = router;