const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const { roles } = require('../consts');
const sign = id =>
	jwt.sign(
		{
			id
		},
		process.env.SECRET
	);

exports.login = async (req, res) => {
    const { email, password } = {
        ...req.body
    };
    const user = await userService.login(email, password);
    if (user) {
        const token = sign(user.id);
        res.json({
            id: user.id,
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
			const token = sign(user.id);
			res.json({
				id: user.id,
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
    const token = req.get('Authorization');
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(403).json({ message: 'Forbidden' });
    }
};

exports.isJournalist = async (req, res, next) => {
    const token = req.get('Authorization');
	try {
		const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        const { role } = await userService.getRole(decoded.id);
        if (role === roles.JOURNALIST) {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden' });
        }
	} catch (e) {
		res.status(403).json({ message: 'Forbidden' });
	}
};

exports.private = async (req, res) => {
    res.json({
        id: req.user
    });
};