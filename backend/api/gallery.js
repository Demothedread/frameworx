const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>
  res.json([
    { src: '/images/a.jpg', caption: "Photo A" },
    { src: '/images/b.jpg', caption: "Photo B" },
  ])
);

module.exports = router;
