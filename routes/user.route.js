const Router = require('express-promise-router')
const router = new Router();
const userController = require('../controllers/user.controller');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', userController.login);

router.post('/register', userController.register);

router.get('/private', userController.isAuthenticated, userController.private);

router.get('/journalist', userController.isJournalist, userController.private);

router.get('/:id', userController.getUserById);

router.get('/:id/public-posts', userController.getPublicPostsByAuthor);

router.get('/:id/private-posts', userController.isProfileOwner,
 userController.getPrivatePostsByAuthor);

module.exports = router;