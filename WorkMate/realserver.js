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
  // 라운드별로 userroom 객체내의 탈락한 player들을 null 입력
  get userid(){      // 최종 우승자 판별
    let players = [];
    players[0] = player1;
    players[1] = player2;
    players[2] = player3;
    players[3] = player4;
    players[4] = player5;
    players[5] = player6;
    return players;
  }

  // 매칭시 player1~6까지 null이 있는지 체크, null이 없다면 false반환
  set userid(socket){
    if(player1 == null)
      player1 = socket;
    else if(player2 == null)
      player2 = socket;
    else if(player3 == null)
      player3 = socket;
    else if(player4 == null)
      player4 = socket;
    else if(player5 == null)
      player5 = socket;
    else if(player6 == null)
      player6 = socket;
    else
      return false;
  }
    
        
}

//------------------

var userpool = []; //페이지 접속한 총인원
var matchinguser = []; // 게임 참여인원은 빠진 페이지접속 인원
var userinfo = {}; //유저들의 정보모음집
let a = false;
let i = 0;
let j = 0;
let room = new Array();
room[0] = new userroom();

function joinGame(socket) {
  
  
}

function exitGame(socket) {
      for( var i = 0 ; i < userpool.length; i++){
        if(userpool[i].id == socket.id){
            userpool.splice(i,1);
            break
        }
    }
    delete userinfo[socket.id];
}

function endGame(socket) {
  let MAX = 0;
  room[i][j].score 비교
  MAX = room[i][j]
  return MAX  // 정보
}

let test = new userroom();
console.log(test.userid());

io.on('connection'function(socket) {
  console.log(`${socket.id}님이 입장하셨습니다.`);

  socket.on('disconnect', function(reason){
    console.log(`${socket.id}님이 %{reason}의 이유로 퇴장하셨습니다.`)
    exitGame(socket);
    socket.broadcast.emit('leave_user',sockt.id);    
  });

  socket.on('matchStart', function(data) {  // data = 클라이언트에서 넘어오는 유저정보
    for( i = 0 ; i < 6 ; i++)
      {
        if(room[j][i] == null)
          room[j][i] = i;
      }
    


     
  });

win (socket.id)
newroom[i] == socket.id
win.html

  socket.on('matchingfail', function(a) { //매칭 종료버튼, 매칭 타이머 초과 시 받는 정보
    let asd = function (socket) {
      for(let i = 0 ;)
    }
    socket.emit('exitMatching', socket.id);
    
  })

socket.on()

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




