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

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
