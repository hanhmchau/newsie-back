const postService = require('../services/post.service');
const { getFullUrl } = require('../utils');

exports.create = async (req, res) => {
	const post = await postService.create(req.body.post);
	res.json({
		id: post.id
	});
};

exports.getAllPublic = async (req, res) => {
	const posts = await postService.getAllPublic();
	res.json({
		posts
	});
};

exports.getPostsByAuthor = async (req, res) => {
	const { authorId, includesPrivate, includesPublic } = { ...req.body };
	const posts = await postService.getPostsByAuthor(authorId, includesPrivate, includesPublic);
	res.json({
		posts
	});
};

exports.addTag = async (req, res) => {
    const {postId, tagId} = {...req.body};
    await postService.addTag(postId, tagId);
    res.sendStatus(204);
};

exports.removeTag = async (req, res) => {
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
    const post = await postService.update(req.body.post);
    res.json({
        post
    });
};

exports.getById = async (req, res) => {
    const post = await postService.getById(req.body.postId);
	res.json({
		post
	});
};

exports.delete = async (req, res) => {
    const post = await postService.delete(req.body.postId);
    res.json({
        post
    });
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

exports.getFavoritePosts = async (req, res) => {
    const userId = req.body.userId;
    const posts = postService.getFavoritePosts(userId);
    res.json({
        posts
    });
};

exports.uploadPreviewImage = async (req, res) => {
    const fileName = req.file;
    const postId = req.body.postId;
    // await postService.uploadPreviewImage(postId, fileName);
    return res.json({
        fileName: getFullUrl(req, fileName)
    });
};