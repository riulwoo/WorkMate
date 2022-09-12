const express = require('express');
const router = express.Router();

router.get('/ox', (req, res) => {
  res.sendFile('game/ox/index.html');
});

router.get('/space', (req, res) => {
  res.sendFile('game/space/index.html');
});

router.get('/flipOver', (req, res) => {
  res.sendFile('views/gamebase.html');
});

module.exports = router;