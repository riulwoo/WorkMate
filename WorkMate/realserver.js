// server.js
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');

const mysql = require('mysql')
var connection =mysql.createConnection({
  host : 'localhost',    // 호스트 주소
  user : 'workmate',
  password : 'workmate123',
  database : 'workmate'
})

// connection.connect();

server.listen(process.env.PORT || 3000, ()=> {
  console.log("서버가 대기중입니다.");
})

app.use(express.static('views'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.get('/gamebase', (req, res) => {
  res.sendFile(__dirname + '/views/gamebase.html')
})

function getPlayerColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);  
}

const startX = 1024/2;
const startY = 768/2;

class PlayerBall{
    constructor(socket){
        this.socket = socket;
        this.x = startX;
        this.y = startY;
        this.score = 0;
        this.nick = "player";
        this.color = getPlayerColor(); // 백그라운드 이미지로 대체
    }

    get id() {
        return this.socket.id;
    }
}


class userroom {  // 클라이언트 코드에도 작성해야함 : 같이 플레이하는 유저의 정보도 알아야 게임이 됨
  constructor(){
  // 방안에 유저가 들어가 있는지 체크
  this.alreadyUser = false;

  // 방 코드
  this.roomCode = null;

  // 라운드 구별 변수
  this.roundCheck = -1;

  // 게임배열 
  this.gameName;

  // 플레이어 1~6명의 정보
    this.players = [];
    for (let i = 0; i < 6; i++) {
      this.players.push({ id: null, nick: null, score: null });
    }
  }

  deleteUser(id, j) {
    //this.players.forEach((players, index) => {
      if(this.players[j].id === id)
        this.players.splice(j, 1, { id: null, nick: null, score: null });
      if(this.players == null)
        return true;
    //});
  }
  
  // 라운드별로 userroom 객체내의 탈락한 player들을 null 입력
  get userid() {
    const playersId = this.players.map((players) => players.id);    
    return playersId;
  }

  
  // 매칭시 player1~6까지 null이 있는지 체크, null이 없다면 false반환
  set userid(data) {
    const { id, roomid, nick, score } = data;
    for(let i = 0 ; i < 6 ; i++) {
      if(this.roomCode != null && this.players[5].id != null) {
        console.log('여기 들어왔다구');
        return false;
      }else if (this.roomCode != null && this.players[i].id == null) {
        this.players.splice(i, 1, { id: id, nick: nick, score: score });
        return true;
      }else if (this.roomCode == null) {
        this.players.splice(i, 1, { id: id, nick: nick, score: score });
        return true;
      }
    }
  }
}


//-------------------------- 지역 변수 --------------------------------



// 목적이나 용도 따로 작성 필요
let roomcnt = 0;
let room = new Array();
let cnt = true;
room[0] = new userroom();



// id 값 받아서 비교해서 userinfo의 값을 userroom에 넣자

var userpool = [];  // 총 인원
var matchinguser = [];                    // 게임참여인원은 빠짐 입장대기방
var userinfo = {};

function joinGame(socket){
    let player = new PlayerBall(socket);

    userpool.push(player);
    matchinguser.push(player); 
    userinfo[socket.id] = player;

    return player;
}

function exitGame(socket){
    for( var i = 0 ; i < userpool.length; i++){
        if(userpool[i].id == socket.id){
            userpool.splice(i,1);
            break
        }
    }
    delete userinfo[socket.id];
}


io.on('connection', function(socket) {
  console.log(`${socket.id}님이 입장하셨습니다.`);

  socket.on('disconnect', function(reason){
    console.log(`${socket.id}님이 %{reason}의 이유로 퇴장하셨습니다.`)
    let checkdata = [];
    for(let i = 0; i < room.length ; i++)
      {
        checkdata = room[i].userid;
        console.log('[matchingover] 들어간 정보 : ' + room[i].userid);

        for(let j = 0 ; j < checkdata.length ; j++)
          {
            if(socket.id == checkdata[j])
            {
              socket.leave(room[i].roomCode);
              room[i].deleteUser(socket.id, j); 
              console.log('[matchingover] leave 후 조인 방 정보 : ' + room[i].roomCode);
              console.log('[matchingover] 유저 정보삭제 후 정보 : ' + room[i].userid);
              console.log('');
            }
          }
        
      }


    
    exitGame(socket);
    socket.broadcast.emit('leave_user',socket.id);    
  });
  
  let newplayer = joinGame(socket);
  socket.emit('user_id', socket.id);
  
  // 클라이언트에서 매칭을 할 시 첫번째로 넘어오는 유저 정보 정보는 방 객체에 저장  
  socket.on('matchStart', function(data) {  // data = 클라이언트에서 넘어오는 유저정보
    // 받아온 data 값을 userroom.userid 안에서 null값을 체크해 값을 넣는다 
    // data = {id : id, nick : nickname, score : 0}
    // 방은 있으되 방에 사람이 아무도 없는 경우
    if(room[roomcnt].roomCode == null)
      {
        room[roomcnt].userid = data;
        room[roomcnt].roomCode = data.roomid;
        socket.join(room[roomcnt].roomCode);
        console.log('처음 방이 만들어졌습니다.  //' + '  방코드 : ' + room[roomcnt].roomCode);
        console.log('[matchStart] 들어간 유저 정보 : ' + room[roomcnt].userid);
              console.log('');
      }
    // 방에 6명이 있고 방이 없을 경우 방을 생성하는 if문
    else if(room[roomcnt].userid = data) == false)
      { 
        console.log('여기 들어왔당');
        roomcnt++;
        room[roomcnt] = new userroom();
        room[roomcnt].roomCode = data.roomid;
        socket.join(room[roomcnt].roomCode);
        room[roomcnt].userid = data;
        // 처음 matchtimeover 메세지를 보낸 유저기준으로 방의 인원을 체크하여
        // matchsuccess를 중복하여 보내지 않기 위한 변수 
        cnt = true;
      }
    else
      {
        socket.join(room[roomcnt].roomCode);
        console.log('매칭 유저가 추가되었습니다.  //' + '  방코드 : ' + room[roomcnt].roomCode);
        console.log('[matchStart] 들어간 유저 정보 : ' + room[roomcnt].userid);
              console.log('');
      }    
  });
  // 각 클라이언트마다 mto메시지를 보낸다 이걸 어떻게 처리해야하나
  // 1번째 사람의 mto메시지만 받고 나머지는 무시한다.
  
  socket.on('matchtimeover', function(userId) { //매칭 종료버튼, 매칭 타이머 초과 시 받는 정보
    // 클라이언트에서 emit data {socket.id}
    // 받는 정보는 타이머 종료 신호, 해당 유저 정보
    // 1. 유저의 id가 유저룸에 들어가 있는가
    // 2. 

    // 받아온 id값을 어느방에 있는지 체크하고 > 이미 있음
    // 그 방의 유저수를 체크하는 userid를 실행 > 배열.length가 1 이면 userroom.asd = true;
    // 2번째 사람이 왔음 > 근데 해당하는 userroom.asd가 true이면 그냥 넘어감
    let clientSocket = userId;
    let checkdata = [];
    let userroomcnt = 0;
    
    for (let i = 0 ; i < room.length ; i++)  //유저의 id를 몇번 방에 있는 지 확인 하는 for문
      {
        // room안에 있는 socket.id를 하나하나 확인하기 위한 변수
        checkdata = room[i].userid;
        for(let j = 0 ; j < 6 ; j++) 
          {
            // 방안에 유저의 정보를 체크하여 방의 위치 확인 
            if(clientSocket == checkdata[j]) 
            {
              // mto를 보낸 유저의 방 번호를 알 수 있다.
              userroomcnt = i;
              break;
             }
          }
      }
    //방안에 유저가 있는 게 확인 되었을 때 그 방안의 인원을 체크하는 코드
    let array = room[userroomcnt].userid;
    if(array>2 && cnt == true)
    {
      room[userroomcnt].alreadyUser = true;
    }
    else
    {
      // 클라이언트에서 다시 매칭하라고 해야함
      socket.emit('matchfail');
    }
    
    if(room[userroomcnt].alreadyUser) 
    {
      // roomusers에게만 보내도록 추후 
      // 랜덤 방 코드 생성
      // DB에 userid, roomid, score, nick 삽입
      io.to(room[userroomcnt].roomCode).emit('matchsuccess', "views/gamebase.html", function () {
        room[userroomcnt].alreadyUser = false;
        cnt = false;
        roomcnt++;
        room[roomcnt] = new userroom();
        });
    }
  }) // end of mto

  socket.on('matchcancel', function (id) { // 매칭 종료 버튼을 눌렀을 때 받는 정보 data = myId
    // id값에 해당하는 join했던 room과 room객체를 찾아 disconnect와 
    
    let checkdata = [];
    for(let i = 0; i < room.length ; i++)
      {
        checkdata = room[i].userid;
        console.log('[matchcancel] 들어간 정보 : ' + room[i].userid);

        for(let j = 0 ; j < checkdata.length ; j++)
          {
            if(id == checkdata[j])
            {
              socket.leave(room[i].roomCode);
              
              if(room[i].deleteUser(id, j))
              {
                console.log('여기 됐음');
                room[i].roomCode = null;
              }
              console.log('[matchcancel] leave 후 조인 방 정보 : ' + room[i].roomCode);
              console.log('[matchcancel] 유저 정보삭제 후 정보 : ' + room[i].userid);
              console.log('');
            }
          }
        
      }
  })

  socket.on('startgame', function(id) {
    let checkid = [];
    room.forEach((temp, index) => 
      {
        checkid = temp.userid;
      
        for(let i = 0; i< 6; i++) 
        {
          if(checkid[i] === id) 
          {
            //io.to(temp.roomCode)
            io.to(temp.roomCode).emit('gamestart', "/views/gamebase.html");
          }
        }
      });
  })
  for (var i = 0 ; i < userpool.length; i++){
        let player = userpool[i];
        socket.emit('join_user', {
            id: player.id,
            x: player.x,
            y: player.y,
            color: player.color,
        });
    }
  socket.broadcast.emit('join_user',{
        id: socket.id,
        x: newplayer.x,
        y: newplayer.y,
        color: newplayer.color,
    });

  socket.on('send_location', function(data) {
          socket.broadcast.emit('update_state', {
              id: data.id,
              x: data.x,
              y: data.y,
          })
  })
});




