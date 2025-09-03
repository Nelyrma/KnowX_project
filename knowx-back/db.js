const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'knowx',
    password: 'knowx',
    port: 5432,
});

module.exports = pool;
