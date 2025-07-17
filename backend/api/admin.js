// Admin API: Secure LLM/model/env/feature config for UI and backend settings
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { getEnv } = require('../utils/env');
const jwt = require('jsonwebtoken');

// DEMO ONLY: Save/load config in a persistable .env.demo file (edit for prod)
const ENV_FILE = path.join(__dirname, '../.env.demo');
const SENSITIVE_KEYS = [
  'LLM_PROVIDER',
  'OPENAI_API_KEY', 'OPENAI_API_MODEL',
  'GOOGLE_API_KEY','GOOGLE_VISION_REGION',
  'DEEPSEEK_API_KEY',
  'EMBEDDING_ENABLE'
];

function requireAdminJWT(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.replace(/^Bearer\s+/,'');
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    if (!decoded.isAdmin) return res.status(403).json({ error: 'Admin only' });
    req.user = decoded;
    next();
  } catch(e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// GET: Get current env and sensitive config for admin UI
router.get('/env', requireAdminJWT, (req, res) => {
  let envs = getEnv();
  // Attempt to obfuscate sensitive keys by default
  SENSITIVE_KEYS.forEach(k => {
    if (envs[k]) envs[k+'_OBFUSCATED'] = envs[k].slice(0,5)+'***'+(envs[k].slice(-3)||'');
    delete envs[k];
  });
  res.json({ env: envs });
});

// POST: Update env vars (safe subset only)
router.post('/env', requireAdminJWT, (req, res) => {
  const updates = req.body || {};
  let changed = {};
  // Load file (or create)
  let currEnvString = '';
  try { currEnvString = fs.readFileSync(ENV_FILE, 'utf-8'); } catch{ currEnvString=''; }
  let currLines = currEnvString.split('\n');
  let envMap = {};
  currLines.forEach(line => { const m = line.match(/^(\w+)=(.*)$/); if (m) envMap[m[1]] = m[2]; });
  // Only allow updating allowed keys:
  SENSITIVE_KEYS.forEach(k => {
    if (updates[k]) { envMap[k] = updates[k]; changed[k] = updates[k]; }
  });
  // Save
  let outLines = Object.keys(envMap).map(k => `${k}=${envMap[k]}`);
  fs.writeFileSync(ENV_FILE, outLines.join('\n'));
  res.json({ ok:true, changed });
});

module.exports = router;
