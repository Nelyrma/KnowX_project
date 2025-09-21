const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'knowx',
    password: 'knowx',
    port: 5432,
});

async function addColumns() {
    try {
        console.log('Adding new columns to users table...');
        
        // Ajoute notification_preferences
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}'
        `);
        console.log('✅ notification_preferences column added');
        
        // Ajoute profile_picture
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN profile_picture VARCHAR(255)
        `);
        console.log('✅ profile_picture column added');
        
        // Ajoute phone_number - NOUVELLE LIGNE
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN phone_number VARCHAR(20)
        `);
        console.log('✅ phone_number column added');
        
        console.log('All columns added successfully');
        
    } catch (err) {
        // Si les colonnes existent déjà, ça affichera une erreur mais ce n'est pas grave
        console.error('❌ Error:', err.message);
    } finally {
        await pool.end();
    }
}

addColumns();
