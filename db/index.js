export default require('knex')({
    client: 'pg',
    connection: process.env.DB_CONNECTION
});