const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { error } = require('console');

const pool = new Pool({
    user: 'postgres', // DB user(defined in docker)
    host: 'localhost', // where PostgreSql runs (local machine)
    database: 'knowx',  //DB name
    password: 'knowx',  // Docker container password
    port: 5432,  // PostegreSQL default port
});

// POST /signup (inscription)
// --------------------------
router.post('/signup', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);  //hash the password

        const result = await pool.query(
            `INSERT INTO users (first_name, last_name, email, password, skills_offered, skills_wanted)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING id, first_name, last_name, email`,
            [first_name, last_name, email, hashedPassword, [], []] // empty skills by default
        );

        res.status(201).json({
            message: "✅ Account created!",
            user: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            res.status(400).json({ error: "❌ Email already in use" });
        } else {
            res.status(500).json({ error: "❌ Something went wrong" })
        }
    }
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // find the user
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
        return res.status(401).send('Incorrect email or password');
    }

    // compare passwords
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
        return res.status(401).send('Incorrect email or password')
    }

    // generate a JWT
    const token = jwt.sign({ userId: user.rows[0].id }, 'YOUR_SECRET', { expiresIn: '1h' });
    res.send({ token });
});

module.exports = router;
