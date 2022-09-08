// server.js
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

/** Import Router */
const testRouter = require('./router/pageRouter');

/** Import SocketHandler */
const mainHandlers = require('./router/mainHandler');
const oxHandlers = require('./router/oxHandler');
const flipHandlers = require('./router/flipHandler');
const raceHandlers = require('./router/raceHandler');
const userroom = require("./model/userroom");


/** Set Middleware */
app.use(express.static('views'));
app.use(express.static('game'));

/** Set Routers */
app.use('*', testRouter);

let room = new Array();
room[0] = new userroom();

const onConnection = (socket) => {
  
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

io.on('connection', onConnection);

server.listen(5000, ()=> {
  console.log("서버가 대기중입니다.");
});