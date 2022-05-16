// server.js
const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const fs = require('fs');
const express = require('express');
//var http = require('http');
//var server = http.createServer();
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
  this.alreadyuser = false;
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
      this.player1.score = data.score;
      //this.player1.color = data.color;
      this.player1.nick = data.nick;
      return true;
    }
    else if(this.player2 == null) 
    {
      this.player2.id = data.id;
      this.player2.score = data.score;
      //this.player2.color = data.color;
      this.player2.nick = data.nick;
      return true;
    }
    else if(this.player3 == null)
    {
      this.player3.id = data.id;
      this.player3.score = data.score;
      //this.player3.color = data.color;
      this.player3.nick = data.nick;
      return true;
    }
      
    else if(this.player4 == null)
    {
      this.player1.id = data.id;
      this.player1.score = data.score;
      //this.player1.color = data.color;
      this.player1.nick = data.nick;
      return true;
    }
      
    else if(this.player5 == null)
    {
      this.player1.id = data.id;
      this.player1.score = data.score;
      //this.player1.color = data.color;
      this.player1.nick = data.nick;
      return true;
    }
      
    else if(this.player6 == null)
    {
      this.player1.id = data.id;
      this.player1.score = data.score;
      //this.player1.color = data.color;
      this.player1.nick = data.nick;
      return true;
    }
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
let cnt = true;
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
        // 받아온 data 값을 userroom.userid 안에서 null값을 체크해 값을 넣는다 
        // data = {id : id, nick : nickname, score : 0}
        if(!room[roomcnt].userid(data)) // 방에 6명이 찼을 경우 방을 생성하는 if문
        { 
          roomcnt++
          room[roomcnt] = new userroom();
          room[roomcnt].userid(data);
          // 처음 matchtimeover 메세지를 보낸 유저기준으로 방의 인원을 체크하여 matchsuccess를 중복하여 보내지 않기 위한 변수 
          cnt = true;
        }
  });
  // 각 클라이언트마다 mto메시지를 보낸다 이걸 어떻게 처리해야하나
  // 1번째 사람의 mto메시지만 받고 나머지는 무시한다.
  
  socket.on('matchtimeover', function(data) { //매칭 종료버튼, 매칭 타이머 초과 시 받는 정보
    // 클라이언트에서 emit data {socket.id}
    // 받는 정보는 타이머 종료 신호, 해당 유저 정보
    // 1. 유저의 id가 유저룸에 들어가 있는가
    // 2. 

    // 받아온 id값을 어느방에 있는지 체크하고 > 이미 있음
    // 그 방의 유저수를 체크하는 userid를 실행 > 배열.length가 1 이면 userroom.asd = true;
    // 2번째 사람이 왔음 > 근데 해당하는 userroom.asd가 true이면 그냥 넘어감
    let clientSocket = io.sockets.connected[data.id];
    let checkdata = [];
    let userroomcnt = 0;
    let a = 0;
    
    for ( i = 0 ; i < room.length ; i++)  //유저의 id를 몇번 방에 있는 지 확인 하는 for문
      {
        for( j = 0 ; j < 6 ; j++) 
          {
            // room안에 있는 socket.id를 하나하나 확인하기 위한 변수
            checkdata[j] = room[i][j].id;
            // 방안에 유저의 정보를 체크하여 방의 위치 확인
            if(clientSocket == checkdata[j]) 
            {
              userroomcnt = i;
              break;
             }
          }
      }
    //방안에 유저가 있는 게 확인 되었을 때 그 방안의 인원을 체크하는 코드
    let array = room[userroomcnt].userid()
    if(array>2 && cnt == true)
    {
      room[userroomcnt].alreadyuser = true;
    }
    else
    {
      // 클라이언트에서 다시 매칭하라고 해야함
      clientSocket.emit('matchfail');
    }
        
    if(room[userroomcnt].alreadyuser) 
    {
        // roomusers에게만 보내도록 추후 
        clientSocket.emit('matchsuccess', function () {         
          








          
          fs.readFile(__dirname + '/views/index.html', function(err, data) {
          if(err){
            res.writeHead(500);
            return res.end('Error!!');
          }
          res.writeHead(200);
          res.end(data);
          
          room[userroomcnt].alreadyuser = false;
          cnt = false;
          roomcnt++;
          room[roomcnt] = new userroom();
          });
        });
    }
  }) // end of mto

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




