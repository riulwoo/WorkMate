// server.js
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
const path = require('path');
const testRouter = require('./router/test');
const Testing = (socket) => {
  testRouter(io, socket);
}
const { CreateRoom, getRoomIndex, roomout, gamestart, insert } = require("router/matching")(io);
server.listen(5000, ()=> {
  console.log("서버가 대기중입니다.");
});

//app.set('io', io);
app.use(express.static('views'));
app.use(express.static('game'));
app.use('/ox', testRouter);
app.use('/space', testRouter);
app.use('/filpOver', testRouter);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});



io.on('connection', function(socket) {
  console.log(`${socket.id}님이 입장하셨습니다.`);

  socket.emit('user_id', socket.id);

  socket.on('disconnect', (reason) => disconnect(reason));
 
  socket.emit('user_id', socket.id);

  socket.on('matchStart', (data)=>insert('m', data));
  
    //매칭 종료버튼, 매칭 타이머 초과 시 받는 정보
  socket.on('matchtimeover', (id)=> gamestart(id));  

  //매칭 중일 때 나가기 버튼
  socket.on('matchcancel', (id)=>roomout(id));  

  // data {id, roomid, nick, score}
  socket.on('createroom',(data)=> insert('p', data)); 
  
  socket.on('joinroom', (data)=>insert('j', data))   

  // 방안에서 게임 시작 버튼
  socket.on('startgame', (id)=> gamestart(id))  

  // 나중에 게임 연결 성공하면 to(room)에게 보내주는 형태로 수정
  socket.on('send_location', function(data) {
          socket.broadcast.emit('update_state', {
              id: data.id,
              x: data.x,
              y: data.y,
          })
  })
//-----------------------------------------------index-------------------------------------------------------------
});



      