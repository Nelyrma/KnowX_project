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
            CREATE TABLE IF NOT EXISTS users (
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
            CREATE TABLE IF NOT EXISTS offers (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                title VARCHAR(255) NOT NULL,
                skills_offered TEXT[],
                description TEXT,
                screenshots TEXT[] DEFAULT '{}',
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        // create messages table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                offer_id INTEGER REFERENCES offers(id) ON DELETE SET NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                is_read BOOLEAN DEFAULT FALSE
            );
        `);

        // create index for better performances
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
        `);
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
        `);
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_messages_offer ON messages(offer_id);
        `);

        console.log('Tables "users", "offers" and "messages" created !');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        pool.end();
        console.log('Database connection closed');
    }
})();
