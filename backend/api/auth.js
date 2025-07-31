const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateInput = require('../middleware/validateInput');
const { requireJWT } = require('../middleware/auth');
const router = express.Router();

// In-memory demo storage: { username, passwordHash, isAdmin }
const users = [
  { username: 'admin', passwordHash: bcrypt.hashSync('admin123', 10), isAdmin: true }
];

function getUser(username) {
  return users.find(u => u.username === username);
}

function createToken(user) {
  return jwt.sign(
    { username: user.username, isAdmin: !!user.isAdmin },
    process.env.JWT_SECRET || 'devsecret',
    { expiresIn: '2h' }
  );
}

// Register
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  if (users.some(u => u.username === username)) return res.status(400).json({ error: 'Exists' });
  users.push({ username, passwordHash: bcrypt.hashSync(password, 10), isAdmin: false });
  res.json({ ok: true });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = getUser(username);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) return res.status(401).json({ error: 'Bad creds' });
  res.json({ token: createToken(user), isAdmin: !!user.isAdmin });
});

// Auth middleware
// Whoami
router.get('/me', requireJWT, (req, res) => {
  res.json({ user: req.user });
});
// Admin: all users
router.get('/users/admin', requireJWT, (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Admin only' });
  res.json(users.map(u => ({ username: u.username, isAdmin: u.isAdmin })));
});
// Grant/revoke admin role
router.post('/users/admin', requireJWT, (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Admin only' });
  const { username, setAdmin } = req.body;
  const user = getUser(username);
  if (!user) return res.status(404).json({ error: 'No user' });
  user.isAdmin = !!setAdmin;
  res.json({ ok: true, username, isAdmin: user.isAdmin });
});

module.exports = router;
