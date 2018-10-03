const postService = require('../services/post.service');
const { getFullUrl, getExtension } = require('../utils');

exports.create = async (req, res) => {
    const post = req.body.post;
    post.authorId = req.user;
	const newPost = await postService.create(req.body.post);
	res.json({
        id: newPost.id
	});
};

exports.getAllPublicPosts = async (req, res) => {
    const { page = 1, pageSize = 10 } = { ...req.body };
    const offset = (page - 1) * pageSize;
	const posts = await postService.getAllPublicPosts(pageSize, offset);
	res.json(posts);
};

exports.getPostsByAuthor = async (req, res) => {
	const { authorId, includesPrivate, includesPublic } = { ...req.body };
	const posts = await postService.getPostsByAuthor(authorId, includesPrivate, includesPublic);
	res.json(posts);
};

exports.addTag = async (req, res) => {
    const {postId, tagId} = {...req.body};
    await postService.addTag(postId, tagId);
    res.sendStatus(204);
};

exports.deleteTag = async (req, res) => {
    const { postId, tagId } = { ...req.body };
    await postService.removeTag(postId, tagId);
    res.sendStatus(204);
};

exports.toggle = async (req, res) => {
	const { postId, isPublic } = { ...req.body };
	await postService.toggle(postId, isPublic);
	res.sendStatus(204);
};

exports.update = async (req, res) => {
    const id = req.params.id;
    const post = req.body.post;
    post.id = id;
    await postService.update(req.body.post);
    res.sendStatus(204);
};

exports.getPostById = async (req, res) => {
    const post = await postService.getById(req.params.id);
    if (post && post.public) {
        if (post.public) {
            res.json(post);
        }
    } else {
        res.sendStatus(404);
    }
};

exports.delete = async (req, res) => {
    await postService.delete(req.params.id);
    res.sendStatus(204);
};

exports.favorite = async (req, res) => {
    const { postId, userId } = { ...req.body };
    const post = await postService.favorite(postId, userId);
	res.json({
		post
	});
};

exports.unfavorite = async (req, res) => {
    const { postId, userId } = { ...req.body };
    const post = await postService.favorite(postId, userId);
    res.json({
        post
    });
};

exports.uploadImage = async (req, res) => {
    return res.json({ fileName: getFullUrl(req, req.fullFileName) });
};

exports.uploadPreviewImage = async (req, res) => {
    const postId = req.body.postId;
    await postService.uploadPreviewImage(postId, fileName);
    return res.json({
        fileName: getFullUrl(req, fileName)
    });
};

exports.createComment = async (req, res) => {
    const { postId, content } = { ...req.body };
    const commenterId = req.user;
    const comment = await postService.createComment(postId, content, commenterId);
    return res.json({
        id: comment.id
    });
};

exports.updateComment = async (req, res) => {
	const { commentId, content } = { ...req.body };
	await postService.createComment(
        commentId,
		content
	);
	return res.sendStatus(204);
};

exports.deleteComment = async (req, res) => {
    const { commentId } = { ...req.body };
    await postService.deleteComment(commentId);
    return res.sendStatus(204);
};