const userService = require('../services/user.service');
const postService = require('../services/post.service');
const jwt = require('jsonwebtoken');

const { roles } = require('../consts');
const sign = user => jwt.sign(user, process.env.SECRET);

exports.login = async (req, res) => {
	const { email, password } = {
		...req.body
	};
	const user = await userService.login(email, password);
	if (user) {
		const token = sign(user);
		res.json({
			user,
			token
		});
	} else {
		res.status(400).json({
			message: 'Not found'
		});
	}
};

exports.register = async (req, res) => {
	const { email, password } = {
		...req.body
	};
	try {
		const user = await userService.register(email, password);
		if (user) {
			const token = sign(user);
			res.json({
				user,
				token
			});
		} else {
			res.sendStatus(500);
		}
	} catch (e) {
		res.status(400).json({
			message: e.message
		});
	}
};

exports.isAuthenticated = async (req, res, next) => {
	const token = req.get('Authorization').split(' ')[1];
	try {
		const decoded = jwt.verify(token, process.env.SECRET);
		req.user = decoded.id;
		next();
	} catch (e) {
		res.status(403).json({ message: 'Forbidden' });
	}
};

exports.isJournalist = async (req, res, next) => {
	const token = req.get('Authorization').split(' ')[1];
	try {
		const decoded = jwt.verify(token, process.env.SECRET);
		const { role } = await userService.getRole(decoded.id);
		if (role === roles.JOURNALIST) {
			req.user = decoded.id;
			next();
		} else {
			res.status(403).json({ message: 'Forbidden' });
		}
	} catch (e) {
		res.status(403).json({ message: 'Forbidden' });
	}
};

exports.isProfileOwner = async (req, res, next) => {
	const token = req.get('Authorization').split(' ')[1];
	try {
		const decoded = jwt.verify(token, process.env.SECRET);
		const userId = req.params.userId || req.params.id;
		if (decoded.id.toString() === userId) {
			req.user = decoded.id;
			next();
		} else {
			res.status(403).json({ message: 'Forbidden' });
		}
	} catch (e) {
		res.status(403).json({ message: 'Forbidden' });
	}
};

exports.isPostOwner = async (req, res, next) => {
	try {
		const token = req.get('Authorization').split(' ')[1];
		const decoded = jwt.verify(token, process.env.SECRET);
		const userId = decoded.id;
		const postId = req.params.postId || req.params.id;
		if (await userService.isOwner(userId, postId)) {
			req.user = decoded.id;
			next();
		} else {
			throw new Error();
		}
	} catch (e) {
		res.status(403).json({ message: 'Forbidden' });
	}
};

exports.isCommentOwner = async (req, res, next) => {
	if (req.get('Authorization')) {
		const token = req.get('Authorization').split(' ')[1];
		try {
			const decoded = jwt.verify(token, process.env.SECRET);
			const userId = decoded.id;
			const commentId = req.params.commentId;
			if (await userService.isCommentOwner(userId, commentId)) {
				req.user = decoded.id;
				next();
			} else {
				res.status(403).json({ message: 'Forbidden' });
			}
		} catch (e) {
			res.status(403).json({ message: 'Forbidden' });
		}
	} else {
		res.status(403).json({ message: 'Forbidden' });
	}
};

exports.getFavoritePosts = async (req, res) => {
	const userId = req.body.userId;
	const posts = userService.getFavoritePosts(userId);
	res.json({
		posts
	});
};

exports.private = async (req, res) => {
	res.json({
		id: req.user
	});
};

exports.getPublicPostsByAuthor = async (req, res) => {
	const authorId = req.params.id;
	const posts = await postService.getPublicPostsByAuthor(authorId);
	res.json(posts);
};

exports.getPrivatePostsByAuthor = async (req, res) => {
	const authorId = req.params.id;
	const posts = await postService.getPrivatePostsByAuthor(authorId);
	res.json(posts);
};

exports.getUserById = async (req, res) => {
	const userId = req.params.id;
	const user = await userService.getUserById(userId);
	if (user) {
		res.json(user);
	} else {
		res.sendStatus(404);
	}
};
