const db = require('../db');
const bcrypt = require('bcryptjs');

exports.login = async (email, password) => {
	const { rows } = await db.query(
		'SELECT Id, Password FROM AppUser WHERE Email = $1',
		[email]
    );
    const user = rows[0];
    if (user) {
        const validPassword = await bcrypt.compare(password.toString(), user.password.toString());
        if (validPassword) {
            return {
                id: user.id
            };
        }
    }
};

exports.register = async (email, password) => {
    const hashedPassword = bcrypt.hashSync(password.toString(), 10);
	const { rows } = await db.query(
		'INSERT INTO AppUser(Email, Password) VALUES($1, $2) RETURNING Id',
		[email, hashedPassword]
    );
    return rows[0];
};

exports.getRole = async id => {
    const { rows } = await db.query(
        'SELECT Role FROM AppUser WHERE Id = $1',
        [id]
    );
    return rows[0];
};


exports.getFavoritePosts = async userId => {
	const { rows } = await db.query(
		'SELECT * FROM Post WHERE Id IN (SELECT PostId FROM Favorite WHERE UserId = $1)',
		[userId]
	);
	return rows;
};

exports.isOwner = async (userId, postId) => {
	const { rows } = await db.query('SELECT authorId FROM Post WHERE id = $1', [
		postId
    ]);
    const authorId = rows[0].authorid;
	return authorId === userId;
};

exports.isCommentOwner = async (userId, commentId) => {
    const { rows } = await db.query(
		'SELECT commenterId FROM Comment WHERE id = $1',
		[commentId]
	);
    const commenterId = rows[0].commenterid;
    return commenterId === userId;
};