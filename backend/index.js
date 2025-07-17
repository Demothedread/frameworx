require('dotenv').config({
  path: [
    '.env.development.local',
    '.env.local', 
    '.env.development',
    '.env'
  ]                                                                                                         
});

const express = require('express');
const cors = require('cors');
const galleryApi = require('./api/gallery');
const gameApi = require('./api/game');
const authApi = require('./api/auth');
const chatbotApi = require('./api/chatbot');
const uploadAndSortChannel = require('./channels/uploadandsort');
const { getEnv } = require('./utils/env');
const adminApi = require('./api/admin');
const errorHandler = require('./middleware/errorHandler');
const app = express();
const path = require('path');

// Define allowed origins for different environments
const devOrigin = 'http://localhost:3000'; // Change if your dev frontend runs elsewhere
const prodOrigin = 'https://your-production-frontend.com';

// Use explicit CORS options for clarity and security
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? prodOrigin : devOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
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
app.use('/api/uploadandsort', uploadAndSortChannel);
app.use('/api/admin', adminApi);
app.get('/api/env', (_req, res) => res.json(getEnv()));

// Centralized error handler for all API errors
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
  console.log('Serving images at /images');
});

