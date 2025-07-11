const express = require('express');
const cors = require('cors');
const path = require('path');
const galleryApi = require('./api/gallery');
const gameApi = require('./api/game');
const authApi = require('./api/auth');
const chatbotApi = require('./api/chatbot');
const { getEnv } = require('./utils/env');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Secure CORS for prod
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://your-production-frontend.com' : '*',
    credentials: true
  })
);
app.use(express.json());

// Serve static images for gallery
app.use('/images', express.static(path.join(__dirname, 'images')));

// Register APIs
app.use('/api/gallery', galleryApi);
app.use('/api/game', gameApi);
app.use('/api/auth', authApi);
app.use('/api/chatbot', chatbotApi);
app.get('/api/env', (req, res) => res.json(getEnv()));

// Centralized error handler for all API errors
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
  console.log('Serving images at /images');
});
