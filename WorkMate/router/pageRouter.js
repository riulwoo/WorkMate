// const express = require('express');
// const router = express.Router();

// router.get('/result', (req, res) => {
//   res.sendFile('resultpage/index.html');
// });

// router.get('/flipover', (req, res) => {
//   res.sendFile('game/flipover/index.html');
// }); 

// router.get('/ox', (req, res) => {
//   res.sendFile('game/ox/index.html');
// });

// router.get('/space', (req, res) => {
//   res.sendFile('game/space/index.html');
// });

 // module.exports = router;
module.exports = function(app)
{
app.get('/result', (req, res) => {
  res.sendFile(__dirname + '../views/resultpage/index.html');
});

app.get('/flipover', (req, res) => {
  res.sendFile(__dirname + '../game/flipover/index.html');
}); 

app.get('/ox', (req, res) => {
  res.sendFile(__dirname + '../game/ox/index.html');
});

app.get('/space', (req, res) => {
  res.sendFile(__dirname + '../game/space/index.html');
});
}