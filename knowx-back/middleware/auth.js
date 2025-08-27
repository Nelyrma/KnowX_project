const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Missing token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.userId = decoded.userId; // Injects the ID into the query
        next(); // Move on to the next step
    } catch (err) {
        res.status(403).json({ error: 'Invalid token.' });
    }
};

module.exports = authenticateToken;
