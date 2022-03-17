// server.js
const app = require('http').createServer(handler);
const io = require('socket.io')(app);
const fs = require('fs');

app.listen(5500);

function handler(req, res) 
{
  fs.readFile(__dirname + '/views/index.html', function(err, data) {
    if(err){
      res.writeHead(500);
      return res.end('Error!!');
    }
    res.writeHead(200);
    res.end(data);
  });
}

function getPlayerColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);  
}

const startX = 1024/2;
const startY = 768/2;

class Player {
  constructor(socket){
    this.socket = socket;
    this.x = startX;
    this.y = startY;
    this.score = 0;
    this.nick = "player";
    this.color = getPlayerColor();
  }

  get id() {
    return this.socket.id;
  }
}

class userroom {
  constructor(){
    this.player1 = null;
    this.player2 = null;
    this.player3 = null;
    this.player4 = null;
    this.player5 = null;
    this.player6 = null;
  }
  
  get userid(){
    for(let i=0; i < 6 ; i++)
      {
        if()          // player1~6 null player4 = socket.id
      }
    return 
  }

  set userid(socket)
    for()
      if(!null)
        
}


//------------------

var userpool = []; //페이지 접속한 총인원
var matchinguser = []; // 게임 참여인원은 빠진 페이지접속 인원
var userinfo = {}; //유저들의 정보모음집
let matchuser; //매칭중인 유저 인원 카운터 변수

let room = new Array();
let newroom = new userroom();
matching , function(data) {
  for(let a = 0 ; a < b ; a++){
    
   for(let i= 0 ; i=6; i++)
     if(newroom[i] == null)
      newroom[i] = data
     else
       room = new userroom();
       room[0] = data
  
  }
}
win (socket.id)
newroom[i] == socket.id
win.html

function joinGame(socket) {
  
  
}

function exitGame(socket) {
  
}

function endGame(socket) {
  
}



io.on('connection'function (socket) {
  console.log(`${socket.id}님이 입장하셨습니다.`);

  socket.on('disconnect', function(reason){
    console.log(`${socket.id}님이 %{reason}의 이유로 퇴장하셨습니다.`)
    exitGame(socket);
    socket.broadcast.emit('leave_user',sockt.id);    
  });

  socket.on('matchingfail' function (a) {

            socket.emit('exitMatching', )
    
  })

  let newplayer = joinGame(socket);
  socket.emit('user_id', socket.id);

  socket.broadcast.emit('join_user',{
    id: socket.id,
    x: newplayer.x,
    y: newplayer.y
  });

  socket.on('send_location', function(data) {
    socket.broadcast.emit('update_state', {
      id: data.id,
      x: data.x,
      y: data.y
    })
  })



});




