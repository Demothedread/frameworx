const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

/**
 * Return image metadata for a gallery album.
 * Reads files from `backend/images/<album>` and maps them to src/caption pairs.
 */
router.get('/:album', (req, res) => {
  const { album } = req.params;
  const dir = path.join(__dirname, '..', 'images', album);
  fs.readdir(dir, (err, files = []) => {
    if (err) return res.json([]);
    res.json(
      files.map((name) => ({
        src: `/images/${album}/${name}`,
        caption: `${album} ${name}`,
      }))
    );
  });
});

module.exports = router;
