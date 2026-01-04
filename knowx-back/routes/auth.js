const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');
const { error } = require('console');

const pool = new Pool({
    user: 'postgres', // DB user(defined in docker)
    host: 'localhost', // where PostgreSql runs (local machine)
    database: 'knowx',  //DB name
    password: 'knowx',  // Docker container password
    port: 5432,  // PostegreSQL default port
});

// Password validation helper
function validatePassword(password) {
    const minLength = 12;
    const hasMinLength = password.length >= minLength;
    const hasDigit = /\d/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);

    const valid = hasMinLength && hasDigit && hasLower && hasUpper && hasSymbol;
    const reasons = [];
    if (!hasMinLength) reasons.push(`at least ${minLength} characters`);
    if (!hasDigit) reasons.push('one digit');
    if (!hasLower) reasons.push('one lowercase letter');
    if (!hasUpper) reasons.push('one uppercase letter');
    if (!hasSymbol) reasons.push('one symbol (!@#$%^&*()_+-= etc.)');

    return { valid, reasons };
}

// POST /signup (inscription)
// --------------------------
router.post('/signup', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    // Vérifier si tous les champs sont complétés
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate password format
    const pwdValidation = validatePassword(password);
    if (!pwdValidation.valid) {
        return res.status(400).json({
            error: 'Invalid password',
            details: pwdValidation.reasons
        });
    }

    try {
        // Vérifier qu'aucun utilisateur n'existe déjà avec cet email
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Ajouter l'utilisateur
        const result = await pool.query(
            `INSERT INTO users (first_name, last_name, email, password, skills_offered, skills_wanted)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING id, first_name, last_name, email`,
            [first_name, last_name, email, hashedPassword, [], []]
        );

        const newUser = result.rows[0];

        // Générer un token JWT
        const token = jwt.sign(
            { userId: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email
            }
        });

    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Account creation failed' });
    }
});

// POST /auth/login
// -----------------
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // find the user
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Incorrect email or password' });
        }

        // compare the passwords
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Incorrect email or password' });
        }

        // generate a JWT
        const token = jwt.sign(
            { userId: user.rows[0].id },
            process.env.JWT_SECRET || 'fallback_secret', // same key as the one in the middleware
            { expiresIn: '1h' }
        );
        
        // return the token
        res.json({
            token,
            user: {
                id: user.rows[0].id,
                first_name: user.rows[0].first_name,
                last_name: user.rows[0].last_name,
                email: user.rows[0].email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /profile
//--------------
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await pool.query(`SELECT first_name, last_name, email,
            skills_offered, skills_wanted, notification_preferences, profile_picture,
            created_at FROM users WHERE id = $1`,
            [req.userId]);
        res.json(user.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /profile - Mettre à jour le profil COMPLET
// ----------------------------------------------
router.put('/profile', authenticateToken, async (req, res) => {
    const { first_name, last_name, email, phone_number, skills_offered, skills_wanted, notification_preferences } = req.body;

    try {
        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        if (email) {
            const emailCheck = await pool.query(
                'SELECT id FROM users WHERE email = $1 AND id != $2',
                [email, req.userId]
            );
            if (emailCheck.rows.length > 0) {
                return res.status(400).json({ error: 'Email already in use' });
            }
        }

        const result = await pool.query(
            `UPDATE users
             SET first_name = COALESCE($1, first_name),
                 last_name = COALESCE($2, last_name),
                 email = COALESCE($3, email),
                 phone_number = COALESCE($4, phone_number),
                 skills_offered = COALESCE($5, skills_offered),
                 skills_wanted = COALESCE($6, skills_wanted),
                 notification_preferences = COALESCE($7, notification_preferences)
             WHERE id = $8
             RETURNING id, first_name, last_name, email, phone_number, skills_offered, skills_wanted, notification_preferences`,
            [first_name, last_name, email, phone_number, skills_offered, skills_wanted, notification_preferences, req.userId]
        );

        res.json({ 
            message: 'Profile updated successfully', 
            user: result.rows[0] 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /change-password - Changer le mot de passe
// ----------------------------------------------
router.put('/change-password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        // 1. Récupérer le mot de passe actuel
        const user = await pool.query('SELECT password FROM users WHERE id = $1', [req.userId]);
        
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 2. Vérifier l'ancien mot de passe
        const isValid = await bcrypt.compare(currentPassword, user.rows[0].password);
        if (!isValid) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Validate new password format
        const pwdValidation = validatePassword(newPassword);
            if (!pwdValidation.valid) {
                return res.status(400).json({
                    error: 'Invalid new password',
                    details: pwdValidation.reasons
                });
            }

        // 3. Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // 4. Mettre à jour
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.userId]);

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /account - Supprimer le compte (soft delete)
// ---------------------------------------------------
router.delete('/account', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        
        // Soft delete: on garde les données mais on rend le compte inaccessible
        await pool.query(
            `UPDATE users 
             SET email = NULL, 
                 password = NULL,
                 deleted = true,
                 deleted_at = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [userId]
        );

        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
