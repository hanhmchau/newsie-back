const Router = require('express-promise-router');
const router = new Router();
const postController = require('../controllers/post.controller');
const userController = require('../controllers/user.controller');
const multer = require('multer');
const utils = require('../utils');
const uuidv1 = require('uuid/v1');
const upload = multer({
    dest: 'public/images/',
    fileName: (req, file, cb) => {
        const fileName = `${uuidv1()}.${utils.getExtension(file.name)}`;
        cb(null, fileName);
    }
});

router.get('/', postController.getAllPublicPosts);

router.get('/:id', postController.getPostById);

router.post('/', userController.isJournalist, postController.create);

router.put('/:id', userController.isPostOwner, postController.update);

router.delete('/:id', userController.isPostOwner, postController.delete);

router.put('/:id/preview-image/', upload.single('preview-image'), userController.isPostOwner, postController.uploadPreviewImage);

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