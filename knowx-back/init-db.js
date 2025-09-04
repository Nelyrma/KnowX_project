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
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                skills_offered TEXT[],
                skills_wanted TEXT[],
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        // create offers table
        await pool.query(`
            CREATE TABLE offers (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                title VARCHAR(255) NOT NULL,
                skills_offered TEXT[],
                description TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        console.log('✅ Tables "users" and "offers" created !');
    } catch (err) {
        console.error('❌ Error :', err);
    } finally {
        pool.end();
    }
})();
