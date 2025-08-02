const express = require('express');
const cors = require('cors');
const path = require('path');
const galleryApi = require('../api/gallery');
const gameApi = require('../api/game');
const authApi = require('../api/auth');
const chatbotApi = require('../api/chatbot');
const uploadAndSortChannel = require('../channels/uploadandsort');
const adminApi = require('../api/admin');
const errorHandler = require('../middleware/errorHandler');
const { getEnv } = require('../utils/env');

function createApp() {
  const app = express();
  const devOrigin = 'http://localhost:3000';
  const prodOrigin = 'https://your-production-frontend.com';
  app.use(
    cors({
      origin: process.env.NODE_ENV === 'production' ? prodOrigin : devOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );
  app.use(express.json());
  app.use('/images', express.static(path.join(__dirname, '..', 'images')));
  app.use('/api/gallery', galleryApi);
  app.use('/api/game', gameApi);
  app.use('/api/auth', authApi);
  app.use('/api/chatbot', chatbotApi);
  app.use('/api/uploadandsort', uploadAndSortChannel);
  app.use('/api/admin', adminApi);
  app.get('/api/env', (_req, res) => res.json(getEnv()));
  app.use(errorHandler);
  return app;
}

function startServer(port = process.env.PORT || 4000) {
  const app = createApp();
  app.listen(port, () => {
    require("../../shared/utils/logger").info(`Backend listening on port ${port}`);
    require('../../shared/utils/logger').info('Serving images at /images');
  });
}

module.exports = { createApp, startServer };
