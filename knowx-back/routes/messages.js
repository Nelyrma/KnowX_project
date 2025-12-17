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
                DISTINCT ON (CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END)
                m.*,
                u_sender.first_name as sender_first_name,
                u_sender.last_name as sender_last_name,
                u_receiver.first_name as receiver_first_name,
                u_receiver.last_name as receiver_last_name,
                o.title as offer_title,
                COUNT(*) OVER (PARTITION BY CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END) as message_count,
                SUM(CASE WHEN m.is_read = false AND m.receiver_id = $1 THEN 1 ELSE 0 END) OVER (PARTITION BY CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END) as unread_count
             FROM messages m
             LEFT JOIN users u_sender ON m.sender_id = u_sender.id
             LEFT JOIN users u_receiver ON m.receiver_id = u_receiver.id
             LEFT JOIN offers o ON m.offer_id = o.id
             WHERE m.sender_id = $1 OR m.receiver_id = $1
             ORDER BY CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END, m.created_at DESC`,
            [userId]
        );
        
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching conversations:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/messages/unread-count - Compte les messages non lus
router.get('/unread-count', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;

        const result = await pool.query(
            `SELECT COUNT(*) as count 
             FROM messages 
             WHERE receiver_id = $1 AND is_read = false`,
            [userId]
        );

        const count = parseInt(result.rows[0].count, 10) || 0;
        res.json({ count });
    } catch (err) {
        console.error('Error fetching unread message count:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/messages/ conversations - Récupérer les conversations
router.get('/conversations', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        
        const result = await pool.query(`
            SELECT DISTINCT ON (
                CASE 
                    WHEN m.sender_id = $1 THEN m.receiver_id 
                    ELSE m.sender_id 
                END
            )
            m.*,
            u_sender.first_name as sender_first_name,
            u_sender.last_name as sender_last_name,
            u_receiver.first_name as receiver_first_name,
            u_receiver.last_name as receiver_last_name,
            o.title as offer_title,
            COUNT(*) OVER (PARTITION BY 
                CASE 
                    WHEN m.sender_id = $1 THEN m.receiver_id 
                    ELSE m.sender_id 
                END
            ) as message_count,
            SUM(CASE WHEN m.is_read = false AND m.receiver_id = $1 THEN 1 ELSE 0 END) 
                OVER (PARTITION BY 
                    CASE 
                        WHEN m.sender_id = $1 THEN m.receiver_id 
                        ELSE m.sender_id 
                    END
                ) as unread_count
            FROM messages m
            LEFT JOIN users u_sender ON m.sender_id = u_sender.id
            LEFT JOIN users u_receiver ON m.receiver_id = u_receiver.id
            LEFT JOIN offers o ON m.offer_id = o.id
            WHERE m.sender_id = $1 OR m.receiver_id = $1
            ORDER BY 
                CASE 
                    WHEN m.sender_id = $1 THEN m.receiver_id 
                    ELSE m.sender_id 
                END, 
                m.created_at DESC
        `, [userId]);
        
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching conversations:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/messages/conversation/:userId - Récupère une conversation spécifique
router.get('/conversation/:otherUserId', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const otherUserId = req.params.otherUserId;
        
        const result = await pool.query(`
            SELECT 
                m.*,
                u_sender.first_name as sender_first_name,
                u_sender.last_name as sender_last_name,
                u_receiver.first_name as receiver_first_name,
                u_receiver.last_name as receiver_last_name,
                o.title as offer_title
            FROM messages m
            LEFT JOIN users u_sender ON m.sender_id = u_sender.id
            LEFT JOIN users u_receiver ON m.receiver_id = u_receiver.id
            LEFT JOIN offers o ON m.offer_id = o.id
            WHERE (m.sender_id = $1 AND m.receiver_id = $2)
               OR (m.sender_id = $2 AND m.receiver_id = $1)
            ORDER BY m.created_at ASC
        `, [userId, otherUserId]);
        
        // Marquer les messages comme lus
        await pool.query(`
            UPDATE messages 
            SET is_read = true 
            WHERE receiver_id = $1 AND sender_id = $2 AND is_read = false
        `, [userId, otherUserId]);
        
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching conversation:', err);
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
