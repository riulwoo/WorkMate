/** server.js */
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

/** Import Router */
const Router = require('./router/pageRouter');

/** Import SocketHandler */
const init = require('./model/func_conn');
const mainHandlers = require('../socketHandler/mainHandler');
const oxHandlers = require('../socketHandler/oxHandler');
const flipHandlers = require('../socketHandler/flipHandler');
const raceHandlers = require('../socketHandler/raceHandler');

/** Set Middleware */
app.use(express.static('views'));
app.use(express.static('game'));

/** Set Routers */
app.use('*', Router);

function onConnection(socket, room) {
  console.log(`${socket.id}님이 입장하셨습니다.`);
  mainHandlers(io, socket, room);
  oxHandlers(io, socket, room);
  flipHandlers(io, socket, room);
  raceHandlers(io, socket, room);
  //   // 나중에 게임 연결 성공하면 to(room)에게 보내주는 형태로 수정
  // socket.on('send_location', function(data) {
  //         socket.broadcast.emit('update_state', {
  //             id: data.id,
  //             x: data.x,
  //             y: data.y,
  //         })
  // })
}

let room = init();
io.on('connection', onConnection(room));

server.listen(5000, ()=> {
  console.log("서버가 대기중입니다.");
});