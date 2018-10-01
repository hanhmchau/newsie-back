const db = require('../db');

exports.create = async ({name, content, categoryId, authorId, previewImage}) => {
    const { rows } = await db.query(
        'INSERT INTO Post(Name, Content, CategoryId, AuthorId, PreviewImage) VALUES($1, $2, $3, $4, $5) RETURNING Id',
        [name, content, categoryId, authorId, previewImage]
    );
    return rows[0];
};

exports.getAllPublicPosts = async (limit = 10, offset = 0) => {
    const { rows } = await db.query(
        'SELECT * FROM Post WHERE public = TRUE LIMIT $2 OFFSET $2',
        [limit, offset]
    );
    rows.forEach(row => row.tags = exports.getTags(row.id));
    return rows;
};

exports.getPublicPostsByAuthor = async authorId => {
    let query = 'SELECT * FROM Post WHERE AuthorId = $1 WHERE Public = TRUE';
    const { rows } = await db.query(query, [authorId]);
    rows.forEach(row => row.tags = exports.getTags(row.id));
    return rows;
};

exports.getAllPostsByAuthor = async authorId => {
    let query = 'SELECT * FROM Post WHERE AuthorId = $1';
    const { rows } = await db.query(query, [authorId]);
    rows.forEach(row => row.tags = exports.getTags(row.id));
	return rows;
};

exports.getPrivatePostsByAuthor = async authorId => {
    let query = 'SELECT * FROM Post WHERE AuthorId = $1 WHERE Public = FALSE';
    const { rows } = await db.query(query, [authorId]);
    rows.forEach(row => row.tags = exports.getTags(row.id));
	return rows;
};

exports.getPostsByAuthor = async (authorId, includesPrivate = false, includesPublic = true) => {
    let query = 'SELECT * FROM Post WHERE AuthorId = $1 ';
    if (!includesPrivate) {
        query += ' AND Public = TRUE '
    }
    if (!includesPublic) {
        query += ' AND Public = FALSE ';
    }
    const { rows } = await db.query(query, [authorId]);
    rows.forEach(row => row.tags = exports.getTags(row.id));
	return rows;
};

exports.getTags = async (postId) => {
    const { rows } = await db.query('SELECT * FROM Tag t WHERE t.id IN (SELECT tagId FROM PostTag WHERE postId = $1)', [postId]);
    return rows;
};

exports.addTag = async (postId, tagId) => {
    const { rows } = await db.query('INSERT INTO PostTag VALUES($1, $2)', [postId, tagId]);
    return rows[0];
};

exports.removeTag = async (postId, tagId) => {
    const { rows } = await db.query(
		'DELETE FROM PostTag WHERE PostId = $1 AND TagId = $2',
        [postId, tagId]
	);
    return rows[0];
};

exports.toggle = async (postId, isPublic) => {
    const { rows } = await db.query(
		'UPDATE Post SET Public = $1 WHERE id = $2',
        [isPublic, postId]
	);
	return rows[0];
};

exports.update = async ({ id, name, content, categoryId }) => {
    const { rows } = await db.query(
        'UPDATE Post SET Name = $1, Content = $2, CategoryId = $3 WHERE id = $4',
        [name, content, categoryId, id]
    );
    return rows[0];
};

exports.getById = async id => {
	const { rows } = await db.query(
		'SELECT p.*, u.id, u.email FROM Post p JOIN AppUser u ON p.authorId = u.id WHERE Id = $1',
		[id]
    );
    const post = rows[0];
    if (post) {
        post.tags = exports.getTags(id);
    }
    return post;
};

exports.delete = async id => {
    const { rows } = await db.query(
        'DELETE FROM Post WHERE Id = $1',
        [id]
    );
    return rows[0];
};

exports.favorite = async (postId, userId) => {
	const { rows } = await db.query('INSERT INTO Favorite VALUES($1, $2)', [postId, userId]);
	return rows[0];
};

exports.unfavorite = async (postId, userId) => {
    const { rows } = await db.query('DELETE FROM Favorite WHERE PostId = $1 AND UserId = $2', [postId, userId]);
    return rows[0];
};

exports.uploadPreviewImage = async (postId, fileName) => {
    const { rows } = await db.query(
		'UPDATE Post SET PreviewImage = $1 WHERE id = $2',
		[fileName, postId]
	);
	return rows[0];
};