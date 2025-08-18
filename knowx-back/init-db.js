const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'knowx',
    password: 'knowx',
    port: 5432,
});

(async () => {
    try {
        // create users table
        await pool.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                skills_offered TEXT[],
                skills_wanted TEXT[],
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('✅ Table "users" created !');
    } catch (err) {
        console.error('❌ Error :', err);
    } finally {
        pool.end();
    }
})();
