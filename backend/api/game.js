const express = require('express');
const router = express.Router();

router.get('/highscore', (req, res) =>
  res.json({ highscore: 42 })
);

module.exports = router;
