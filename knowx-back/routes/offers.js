const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM offers');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { title, skills_offered, description } = req.body;
    const userId = req.userId; // retrieved from authentication middleware

    try {
        const result = await pool.query(
            `INSERT INTO offers (user_id, title, skills_offered, description)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, title, skills_offered, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' })
    }
});

module.exports = router;
