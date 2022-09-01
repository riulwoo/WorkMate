// server.js
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
const path = require('path');
const testRouter = require('./router/test');
const mainHandlers = require('./router/mainHandler');
const oxHandlers = require('./router/oxHandler');
const flipHandlers = require('./router/flipHandler');
const raceHandlers = require('./router/raceHandler');

const Testing = (socket) => {
  testRouter(io, socket);
}

const onConnection = (socket) => {
  console.log(`${socket.id}님이 입장하셨습니다.`);
  mainHandlers(io, socket);
  oxHandlers(io, socket);
  flipHandlers(io, socket);
  raceHandlers(io, socket);
  //   // 나중에 게임 연결 성공하면 to(room)에게 보내주는 형태로 수정
  // socket.on('send_location', function(data) {
  //         socket.broadcast.emit('update_state', {
  //             id: data.id,
  //             x: data.x,
  //             y: data.y,
  //         })
  // })
}

server.listen(5000, ()=> {
  console.log("서버가 대기중입니다.");
});

//app.set('io', io);
app.use(express.static('views'));
app.use(express.static('game'));
app.use('*', testRouter);
io.on('connection', onConnection);