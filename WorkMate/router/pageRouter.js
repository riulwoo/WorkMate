const express = require('express');
const router = express.Router();

router.get('/result', (req, res) => {
  res.sendFile('views/resultpage/index.html');
  console.log('result 전송완료');
});

router.get('/flipover', (req, res) => {
  res.sendFile('game/flipover/index.html');
  console.log('flipover 전송완료');
}); 

router.get('/ox', (req, res) => {
  res.sendFile('game/ox/index.html');
  console.log('ox 전송완료')
});

router.get('/space', (req, res) => {
  res.sendFile('game/space/index.html');
  console.log('space 전송완료')
});





module.exports = router;