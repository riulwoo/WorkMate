/** server.js */
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

/** Import Router */
const Router = require('./router/pageRouter')(app);

/** Import SocketHandler */
const init = require('./handler/func_conn');
const mainHandlers = require('./handler/mainHandler');
const oxHandlers = require('./handler/oxHandler');
const flipHandlers = require('./handler/flipHandler');
const raceHandlers = require('./handler/raceHandler');

/** Set Middleware */
app.use(express.static('views'));
app.use(express.static('game'));
app.use(express.json());
app.use(express.urlencoded( {extended : false } ));

/** Set Routers */
//app.use('*', Router);

const onConnection = (socket) => {
  console.log(`${socket.id}님이 입장하셨습니다.`);
  mainHandlers(io, socket, room);
  oxHandlers(io, socket, room);
  flipHandlers(io, socket, room);
  raceHandlers(io, socket, room);
  
  socket.on('send_location', function(data) {
          socket.broadcast.emit('update_state', {
              id: data.id,
              x: data.x,
              y: data.y,
              direction: data.direction
          })
  })
}

let room = init();

io.on('connection', onConnection);

server.listen(5000, ()=> {
  console.log("서버가 대기중입니다.");
});