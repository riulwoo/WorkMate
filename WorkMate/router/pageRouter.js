const express = require('express');
const router = express.Router();

router.get('/resulting', (req, res) => {
  res.sendFile('views/resultpage/index.html');
});

router.get('/flipover', (req, res) => {
  res.sendFile('game/flipover/index.html');
}); 

router.get('/ox', (req, res) => {
  res.sendFile('game/ox/index.html');
});

router.get('/space', (req, res) => {
  res.sendFile('game/space/index.html');
});

 module.exports = router;