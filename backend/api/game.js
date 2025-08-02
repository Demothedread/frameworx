const express = require('express');
const router = express.Router();

/** In-memory scoreboard, persisted while process runs. */
let gameScores = [{ name: 'AAA', score: 42 }];

/**
 * Get the highest score.
 * @route GET /highscore
 */
router.get('/highscore', (_req, res) => {
  const top = gameScores.reduce((max, s) => (s.score > max ? s.score : max), 0);
  res.json({ highscore: top });
});

/**
 * Return the full scoreboard sorted by score desc.
 * @route GET /scoreboard
 */
router.get('/scoreboard', (_req, res) => {
  const sorted = [...gameScores].sort((a, b) => b.score - a.score).slice(0, 10);
  res.json({ scores: sorted });
});

/**
 * Submit a new score. Body: { name, score }
 * @route POST /submit
 */
router.post('/submit', (req, res) => {
  const { name, score } = req.body || {};
  if (!name || typeof score !== 'number') {
    return res.status(400).json({ error: 'name and numeric score required' });
  }
  gameScores.push({ name, score });
  gameScores = gameScores.sort((a, b) => b.score - a.score).slice(0, 10);
  res.json({ success: true });
});

module.exports = router;
