module.exports = function(app) {
  app.get('/', (request, response) => {
    response.sendFile('view/main_page/index.html', {root : '.'});
  });
  
  app.get('/result', (request, response) => {
    response.sendFile('view/result_page/result.html', {root : '.'});
  });

  app.get('/flip_over', (request, response) => {
    response.sendFile('game/flip_over/index.html', {root : '.'});
  }); 

  app.get('/ox_quiz', (request, response) => {
    response.sendFile('game/ox_quiz/index.html', {root : '.'});
  });

  app.get('/survival', (request, response) => {
    response.sendFile('game/survival/index.html', {root : '.'});
  });
}