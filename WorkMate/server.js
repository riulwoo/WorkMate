/** server.js */
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

/** Import Router */
const router = require('./router/page_router')(app);

/** Import SocketHandler */
const init = require('./handler/func_conn');
const mainHandler = require('./handler/handler_main');
const oxHandler = require('./handler/handler_ox');
const flipHandler = require('./handler/handler_flip');
const survivHandler = require('./handler/handler_survival');

/** Set Middleware */
app.use(express.static('view'));
app.use(express.static('game'));
app.use(express.json());
app.use(express.urlencoded( {extended : false } ));

/** Set Routers */
//app.use('*', Router);

const onConnection = (socket) => {
  console.log(`${socket.id}님이 입장하셨습니다.`);
  mainHandler(io, socket, room);
  oxHandler(io, socket, room);
  flipHandler(io, socket, room);
  survivHandler(io, socket, room);
  
  socket.on('send_location', function(data) {
          socket.broadcast.emit('update_state', {
              id: data.id,
              x: data.x,
              y: data.y,
              direction: data.direction,
              ismove : data.ismove,
              cnt : data.cnt
          })
  })
}

let room = init();

io.on('connection', onConnection);

server.listen(5000, ()=> {
  console.log("서버가 대기중입니다.");
});