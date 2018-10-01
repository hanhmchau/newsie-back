const postService = require('../services/post.service');
const { getFullUrl } = require('../utils');

exports.create = async (req, res) => {
	const post = await postService.create(req.body.post);
	res.json({
		id: post.id
	});
};

exports.getAllPublicPosts = async (req, res) => {
    const { page, pageSize } = { ...req.body };
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
    const post = await postService.update(req.body.post);
    post.id = id;
    res.json({
        post
    });
};

exports.getPostById = async (req, res) => {
    const post = await postService.getById(req.params.id);
    if (post) {
        res.json({
            post
        });
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

exports.uploadPreviewImage = async (req, res) => {
    const fileName = req.file;
    const postId = req.body.postId;
    await postService.uploadPreviewImage(postId, fileName);
    return res.json({
        fileName: getFullUrl(req, fileName)
    });
};