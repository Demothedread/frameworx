require('dotenv').config({
  path: [
    '.env.development.local',
    '.env.local',
    '.env.development',
    '.env'
  ]
});

const { startServer } = require('./core/server');
startServer();
