// server.js
const app = require('http').createServer(handler);
const io = require('socket.io')(app);
const fs = require('fs');
const express = require('express');

var port = process.env.PORT || 3000; // 1
app.listen(port, function () {
  
});

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
    this.player1 = {
      id : null,
      x : null,
      y : null,
      nick : null,
      score : null,
      color : null
    };
    this.player2 = {
      id : null,
      x : null,
      y : null,
      nick : null,
      score : null,
      color : null
    };
    this.player3 = {
      id : null,
      x : null,
      y : null,
      nick : null,
      score : null,
      color : null
    };
    this.player4 = {
      id : null,
      x : null,
      y : null,
      nick : null,
      score : null,
      color : null
    };
    this.player5 = {
      id : null,
      x : null,
      y : null,
      nick : null,
      score : null,
      color : null
    };
    this.player6 = {
      id : null,
      x : null,
      y : null,
      nick : null,
      score : null,
      color : null};
  }
  // 라운드별로 userroom 객체내의 탈락한 player들을 null 입력
  get userid(){      // 최종 우승자 판별
    
    let players = [];
    players[0] = this.player1;
    players[1] = this.player2;
    players[2] = this.player3;
    players[3] = this.player4;
    players[4] = this.player5;
    players[5] = this.player6;
    return players;
  }

  // 매칭시 player1~6까지 null이 있는지 체크, null이 없다면 false반환
  set userid(data){
    if(this.player1 == null)
    {
      this.player1.id = data.id;
      this.player1.x = data.x;
      this.player1.y = data.y;
      this.player1.score = data.score;
      this.player1.color = data.color;
      this.player1.nick = data.nick;
      return true;
    }
    else if(this.player2 == null) 
    {
      this.player2.id = data.id;
      this.player2.x = data.x;
      this.player2.y = data.y;
      this.player2.score = data.score;
      this.player2.color = data.color;
      this.player2.nick = data.nick;
    }
      return true;
    else if(this.player3 == null)
    {
      this.player3.id = data.id;
      this.player3.x = data.x;
      this.player3.y = data.y;
      this.player3.score = data.score;
      this.player3.color = data.color;
      this.player3.nick = data.nick;
    }
      return true;
    else if(this.player4 == null)
    {
      this.player1.id = data.id;
      this.player1.x = data.x;
      this.player1.y = data.y;
      this.player1.score = data.score;
      this.player1.color = data.color;
      this.player1.nick = data.nick;
    }
      return true;
    else if(this.player5 == null)
    {
      this.player1.id = data.id;
      this.player1.x = data.x;
      this.player1.y = data.y;
      this.player1.score = data.score;
      this.player1.color = data.color;
      this.player1.nick = data.nick;
    }
      return true;
    else if(this.player6 == null)
    {
      this.player1.id = data.id;
      this.player1.x = data.x;
      this.player1.y = data.y;
      this.player1.score = data.score;
      this.player1.color = data.color;
      this.player1.nick = data.nick;
    }
      return true;
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
let roomcnt = 0;
let room = new Array();
room[0] = new userroom();
// id 값 받아서 비교해서 userinfo의 값을 userroom에 넣자

function joinGame(socket){    // id
    let player = new Player(socket);  // x,y, nickname

    userpool.push(player);
    matchinguser.push(player);
    userinfo[socket.id] = player;

    return player;
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
  winner = userroom.userid();
  return winner  // 정보
}

let test = new userroom();
console.log(test.userid());

io.on('connection', function(socket) {
  console.log(`${socket.id}님이 입장하셨습니다.`);

  socket.on('disconnect', function(reason){
    console.log(`${socket.id}님이 %{reason}의 이유로 퇴장하셨습니다.`)
    exitGame(socket);
    socket.broadcast.emit('leave_user',socket.id);    
  });
  
  let newplayer = joinGame(socket);
  socket.emit('user_id', socket.id);
  
  // 클라이언트에서 매칭을 할 시 첫번째로 넘어오는 유저 정보 정보는 방 객체에 저장  
  socket.on('matchStart', function(data) {  // data = 클라이언트에서 넘어오는 유저정보
        // 클라에서 보낸 정보들 = id, nickname, score, x, y, color등 
        // 받아온 data 값을 userroom.userid 안에서 null값을 체크해 값을 넣는다 
        // id x y null -> 

        if(!room[roomcnt].userid(a))
        { 
          roomcnt++
          room[roomcnt] = new userroom();
          room[roomcnt].userid(data);
        }
  });
  
  // 여유 있으면 6명이 되자마자 matchsuccess넘겨주기
  // 두번째로 넘어오는 메세지 > 매칭 타임 종료가 되었다는 메시지
  // 메시지와 함께 넘어온 유저정보(socket)이 들어있는 방을 체크해서 1명이면 fail주고 
  // 2명에서 6명이라면 그 방 유저들에게 success 메시지와 게임화면 전환)

  // 각 클라이언트마다 mto메시지를 보낸다 이걸 어떻게 처리해야하나
  socket.on('matchtimeover', function(data) { //매칭 종료버튼, 매칭 타이머 초과 시 받는 정보
    // 클라이언트에서 emit data {socket.id}
    // 받는 정보는 타이머 종료 신호, 해당 유저 정보
    // 1. 유저의 id가 유저룸에 들어가 있는가
    // 2. 
    let clientSocket = io.sockets.connected[data.id];
    let data = [];
    let cnt = false;
    let roomcnt = 0;
    let a = 0;
    for ( i = 0 ; i < room.length ; i++)  //유저의 id를 몇번 방에 있는 지 확인 하는 for문
      {
        for( j = 0 ; j < 6 ; j++) 
          {
            // room안에 있는 socket.id를 하나하나 확인하기 위한 변수
            data[j] = room[i][j].id;
            // 방안에 유저의 정보가 있다면 확인 변수를 설정
            if(clientSocket == data[j]) 
            {
              // 
              cnt = true;
              roomcnt = i;
              break;
             }
          }
        if(cnt) //방안에 유저가 있는 게 확인 되었을 때 그 방안의 인원을 체크하는 if문
        {
          room[roomcnt].userid()
          for(a = 0 ; a < 6 ; a++)
            {
              
            }
        }
      }
      // 누구한테 보낼지 > 단일이 아닌 방 단위로 소켓들의 배열을 만들면 좋을거같음
      clientSocket.emit('matchsuccess', function () {
        fs.readFile(__dirname + '/views/index.html', function(err, data) {
          if(err){
            res.writeHead(500);
            return res.end('Error!!');
          }
          res.writeHead(200);
          res.end(data);
        });
      });
    else
    {
      emit('matchfail') // 클라이언트에서 다시 매칭하라고 해야함
      
    }
    
  })

  socket.on('matchingover', function (data) { // 매칭 종료 버튼을 눌렀을 때 받는 정보
    
  })
  


  

  


  socket.on('send_location', function(data) {
    socket.to(ㅁㄴㅇ).emit('update_state', {
      id: data.id,
      x: data.x,
      y: data.y
    })
  })

});




