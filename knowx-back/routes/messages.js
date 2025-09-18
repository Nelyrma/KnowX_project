const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// GET /api/messages - Récupère tous les messages de l'utilisateur
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        
        const result = await pool.query(
            `SELECT 
                m.*,
                u_sender.first_name as sender_first_name,
                u_sender.last_name as sender_last_name,
                o.title as offer_title
             FROM messages m
             LEFT JOIN users u_sender ON m.sender_id = u_sender.id
             LEFT JOIN offers o ON m.offer_id = o.id
             WHERE m.receiver_id = $1
             ORDER BY m.created_at DESC`,
            [userId]
        );
        
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/messages - Send a message
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { receiver_id, offer_id, content } = req.body;
        const sender_id = req.userId;

        if (!receiver_id || !content) {
            return res.status(400).json({ error: 'Receiver and content are required' });
        }

        const result = await pool.query(
            `INSERT INTO messages (sender_id, receiver_id, offer_id, content)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [sender_id, receiver_id, offer_id, content]
        );

        res.status(201).json({ 
            message: 'Message sent successfully!', 
            data: result.rows[0] 
        });
    } catch (err) {
        console.error('Error sending message:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/messages/:id/read - Marquer un message comme lu
router.put('/:id/read', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const result = await pool.query(
            `UPDATE messages 
             SET is_read = true 
             WHERE id = $1 AND receiver_id = $2
             RETURNING *`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.json({ message: 'Message marked as read', data: result.rows[0] });
    } catch (err) {
        console.error('Error marking message as read:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
