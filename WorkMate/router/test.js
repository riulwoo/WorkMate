const express = require('express');
const router = express.Router();

router.get('/ox', (req, res) => {
  res.sendFile(__dirname + '/game/ox/index.html');
});

router.get('/space', (req, res) => {
  res.sendFile(__dirname + '/game/space/index.html');
});

router.get('/filpOver', (req, res) => {
  res.sendFile(__dirname + '/gamebase.html');
});

module.exports = router;