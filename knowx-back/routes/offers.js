const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');
const { error } = require('console');

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

router.delete('/:id', authenticateToken, async (req, res) => {
    const offerId = req.params.id;
    const userId = req.userId;

    try {
        // vérifier que l'offre appartient à l'utilisateur qui va la supprimer
        const offer = await pool.query(
            `SELECT * FROM offers
            WHERE id = $1 AND user_id = $2`, [offerId, userId]);
        
        if (offer.rows.length === 0) {
            return res.status(404).json({ error: 'Offer not found or not authorized' });
        }
        await pool.query('DELETE FROM offers WHERE id = $1', [offerId]);
        res.json({ message: 'Offer successfully deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// GET /api/offers/my-requests - Récupère les demandes de l'utilisateur connecté
router.get('/my-requests', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const result = await pool.query(
            'SELECT * FROM offers WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// GET /api/offers/:id - Récupérer une demande spécifique par son ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT
                o.*,
                u.first_name,
                u.last_name
            FROM offers o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.id = $1`,
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Offer not found' });
        }

        // formater les données pour inclure le nom complet
        const offer = result.rows[0];
        const responseData = {
            ...offer,
            user_name: `${offer.first_name} ${offer.last_name}`.trim() || 'Anonymous'
        };

        res.json(responseData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// PUT /api/offers/:id - Mettre à jour une offre
router.put('/:id', authenticateToken, async (req, res) => {
    const offerId = req.params.id;
    const userId = req.userId; // ID du user connecté
    const { title, description, skills_offered } = req.body;

    try {
        // 1. Vérifier que l'offre appartient à l'utilisateur
        const offer = await pool.query(
            `SELECT * FROM offers WHERE id = $1 AND user_id = $2`,
            [offerId, userId]
        );

        if (offer.rows.length === 0) {
            return res.status(404).json({ error: 'Offer not found or not authorized' });
        }

        // 2. Mettre à jour l'offre
        const result = await pool.query(
            `UPDATE offers 
             SET title = $1, skills_offered = $2, description = $3
             WHERE id = $4
             RETURNING *`,
            [title, skills_offered, description, offerId]
        );

        // 3. Renvoyer l'offre mise à jour
        res.json({ message: 'Offer successfully updated!', offer: result.rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// PATCH /api/offers/:id/status - Mettre à jour le statut d'une offre
router.patch('/:id/status', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    const validStatuses = ['pending', 'in progress', 'resolved'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        // Vérifier que l'offre existe et appartient à l'utilisateur
        const offerCheck = await pool.query(
            `SELECT user_id FROM offers WHERE id = $1`,
            [id]
        );

        if (offerCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Offer not found' });
        }

        if (offerCheck.rows[0].user_id !== userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Mettre à jour le statut
        const result = await pool.query(
            `UPDATE offers SET status = $1 WHERE id = $2 RETURNING *`,
            [status, id]
        );

        res.json({ message: 'Status updated', offer: result.rows[0] });
    } catch (err) {
        console.error('Status update error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
