module.exports = function(app)
{
  app.get('/result', (req, res) => {
    res.sendFile('views/resultpage/index.html', {root : '.'});
  });

  app.get('/flipover', (req, res) => {
    res.sendFile('game/flipover/index.html', {root : '.'});
  }); 

  app.get('/ox', (req, res) => {
    res.sendFile('game/ox/index.html', {root : '.'});
  });

  app.get('/surviv', (req, res) => {
    res.sendFile('game/surviv/index.html', {root : '.'});
  });
}