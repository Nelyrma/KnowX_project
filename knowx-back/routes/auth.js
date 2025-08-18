const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = new Pool({
    user: 'postgres', // DB user(defined in docker)
    host: 'localhost', // where PostgreSql runs (local machine)
    database: 'knowx',  //DB name
    password: 'knowx',  // Docker container password
    port: 5432,  // PostegreSQL default port
});

// POST /signup
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);  //hash the password

    try {
        await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2)',
            [email, hashedPassword]
        );
        res.status(201).send('Account created !');
    } catch (err) {
        res.status(400).send('Email already in use')
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
