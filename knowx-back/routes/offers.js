const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');
const upload = require('../middleware/upload');
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

// utilisation .array('images', 5) pour accepter jusqu’à 5 fichiers dans le champ 'images'
router.post(
    '/', authenticateToken,
    upload.array('images', 5),
    async (req, res) => {
        const { title, skills_offered, description } = req.body;
        const userId = req.userId; // retrouvé à partir de authentication middleware
        const imageFiles = req.files || []; // tableau de fichiers uploadés

        try {
            // Sauvegarder les chemins des images dans la DB
            const imagePaths = imageFiles.map(file => `/uploads/${file.filename}`);

            const result = await pool.query(
                `INSERT INTO offers (user_id, title, skills_offered, description, screenshots)
                VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [userId, title, skills_offered, description, imagePaths]
            );
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error('Error creating offer:', err);
            
            // supprimer les images uploadés
            if (req.files && req.files.length > 0) {
                const fs = require('fs');
                req.files.forEach(file => {
                    fs.unlinkSync(file.path); // supprimer l'image du dossier uploads
                });
            }
            res.status(500).json({ error: 'Server Error' })
        }
    }
);

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
router.put(
    '/:id',
    authenticateToken,
    upload.array('images', 5),
    async (req, res) => {
        const offerId = req.params.id;
        const userId = req.userId; // ID du user connecté
        const { title, description, skills_offered } = req.body;
        const newImages = req.files || [];
        const deletedScreenshotUrls = req.body.deleted_screenshots || [];

        let existingScreenshots = [];

        try {
            // 1. Vérifier que l'offre appartient à l'utilisateur
            const offer = await pool.query(
                `SELECT * FROM offers WHERE id = $1 AND user_id = $2`,
                [offerId, userId]
            );

            if (offer.rows.length === 0) {
                // supprimer les nouvelles images uploadées en cas d'erreur
                if (newImages.length > 0) {
                    const fs = require('fs');
                    newImages.forEach(file => fs.unlinkSync(file.path));
                }
                return res.status(404).json({ error: 'Offer not found or not authorized' });
            }

            existingScreenshots = offer.rows[0].screenshots || [];

            // 2. Supprimer les fichiers physiques marqués pour suppression
            if (deletedScreenshotUrls.length > 0) {
                const fs = require('fs');
                deletedScreenshotUrls.forEach(url => {
                    const filePath = path.join(__dirname, '..', 'uploads', path.basename(url));
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
            }

            // 3. Générer les chemins des nouvelles images
            const newImagePaths = newImages.map(file => `/uploads/${file.filename}`);

            // 4. Construire le nouveau tableau de screenshots
            const keptScreenshots = existingScreenshots.filter(
                url => !deletedScreenshotUrls.includes(url)
            );
            const updatedScreenshots = [...keptScreenshots, ...newImagePaths];

            // 5. Mettre à jour l'offre
            const result = await pool.query(
                `UPDATE offers 
                 SET title = $1, skills_offered = $2, description = $3, screenshots = $4
                 WHERE id = $5
                 RETURNING *`,
                [title, skills_offered, description, updatedScreenshots, offerId]
            );

            res.json({
                message: 'Offer successfully updated!',
                offer: result.rows[0]
            });

        } catch (err) {
            console.error('Error updating offer:', err);

            // NETTOYAGE EN CAS D'ERREUR : supprimer les nouvelles images uploadées
            if (newImages.length > 0) {
                const fs = require('fs');
                newImages.forEach(file => {
                    const filePath = file.path;
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
            }
            res.status(500).json({ error: 'Server Error' });
        }
    }
);

// PATCH /api/offers/:id/status - Mettre à jour le statut d'une offre
router.patch('/:id/status', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    const validStatuses = ['pending', 'in progress', 'resolved'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be: ${validStatuses.join(', ')}` });
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
            return res.status(403).json({ error: 'Only the owner can update the status' });
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
