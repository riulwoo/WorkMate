const express = require('express');
const router = express.Router();

router.get('/ox', (req, res) => {
  res.sendFile('game/ox/index.html');
});

router.get('/space', (req, res) => {
  res.sendFile('game/space/index.html');
});

router.get('/filpOver', (req, res) => {
  res.sendFile('views/gamebase.html');
});

router.get('/', (req, res) => {
  res.sendFile('views/index.html');
});

module.exports = router;