const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const pool = new Pool({
    user: 'postgres', // DB user(defined in docker)
    host: 'localhost', // where PostgreSql runs (local machine)
    database: 'knowx',  //DB name
    password: 'knowx',  // Docker container password
    port: 5432,  // PostegreSQL default port
});

//POST /signup
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

module.exports = router;
