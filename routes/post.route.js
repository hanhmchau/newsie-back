const Router = require('express-promise-router');
const router = new Router();
const postController = require('../controllers/post.controller');
const userController = require('../controllers/user.controller');
const { getFullUrl, getExtension } = require('../utils');
const multer = require('multer');
const uuidv1 = require('uuid/v1');

const storage = multer.diskStorage({
    destination: 'public/images/',
	filename: function(req, file, cb) {
        const fileExtension = getExtension(file.originalname);
        const fileName = `${uuidv1()}.${fileExtension}`;
        req.fullFileName = fileName;
        cb(null, fileName);
	}
});
const upload = multer({
    storage
});

router.get('/', postController.getAllPublicPosts);

router.get('/:id', postController.getPostById);

router.get('/:id/private', userController.isPostOwner, postController.getPrivateOrPublicPostById);

router.post('/', userController.isJournalist, postController.create);

router.put('/:id', userController.isPostOwner, postController.update);

router.delete('/:id', userController.isPostOwner, postController.delete);

router.post('/preview-image/', upload.single('preview-image'), postController.uploadImage);

router.put('/:id/preview-image/', userController.isPostOwner, upload.single('preview-image'), postController.uploadPreviewImage);

router.get('/:id/favorite/:postId', userController.isAuthenticated, userController.getFavoritePosts);

router.post('/:id/favorite/:userId', userController.isProfileOwner, postController.favorite);

router.delete('/:id/favorite/:userId', userController.isProfileOwner, postController.unfavorite);

router.put('/:id/toggle/', userController.isPostOwner, postController.toggle);

router.post('/:id/tag/:tagId', userController.isPostOwner, postController.addTag);

router.delete('/:id/tag/:tagId', userController.isPostOwner, postController.deleteTag);

router.post('/:id/comment/', userController.isAuthenticated, postController.createComment);

router.put('/:id/comment/:commentId', userController.isCommentOwner, postController.updateComment);

router.delete('/:id/comment/:commentId', userController.isCommentOwner, postController.deleteComment);

module.exports = router;