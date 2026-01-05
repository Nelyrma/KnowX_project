require('dotenv').config();

// Vérification du JWT
if (!process.env.JWT_SECRET) {
    console.error('❌ FATAL ERROR: JWT_SECRET is not set in .env file!');
    console.error('   → Create a .env file at the root of the backend with:');
    console.error('      JWT_SECRET=your_strong_secret_here');
    process.exit(1);
}
console.log('✅ JWT_SECRET loaded (length:', process.env.JWT_SECRET.length, ')');

// Configuration du serveur
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const offersRoutes = require('./routes/offers');
const messagesRoutes = require('./routes/messages');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/uploads', express.static('uploads'));

app.listen(3001, () => {
    console.log('✅ Server running on http://localhost:3001');
});
