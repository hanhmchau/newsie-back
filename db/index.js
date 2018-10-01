const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING
});

module.exports = {
    query: (statement, params) => pool.query(statement, params)
};