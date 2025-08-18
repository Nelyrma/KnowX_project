const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'knowx',
  port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? err : '✅ DB connected! Time: ' + res.rows[0].now);
  pool.end();
});
