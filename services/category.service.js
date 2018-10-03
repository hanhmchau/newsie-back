const db = require('../db');

exports.getAllCategories = async () => {
    const { rows } = await db.query(
        'SELECT * FROM Category'
    );
    return rows;
};
