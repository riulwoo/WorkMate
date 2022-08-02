// server.js
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
const path = require('path');

server.listen(process.env.PORT || 3000, ()=> {
  console.log("서버가 대기중입니다.");
});
app.use(express.static(path.join(__dirname, 'views')));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/game/space_race/space_race.html');
});

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
function joinGame(socket){    // id
    let player = new Player(socket);  // x,y, nickname

    userpool.push(player);
    userinfo[socket.id] = player;

    return player;
}

class userroom {  // 클라이언트 코드에도 작성해야함 : 같이 플레이하는 유저의 정보도 알아야 게임이 됨
  constructor(){
    this.check = '';              // 생성된 방이 matching 인지 private인지 체크
    this.roomCode = null;         // 방 코드
    this.roundCheck = -1;         // 라운드 구별 변수
    this.gameName;                // 게임배열 
    this.players = [];          // 플레이어 1~6명의 정보
    for (let i = 0; i < 6; i++) {
      this.players.push({ id: null, nick: null, score: null });
    }
  }
  deleteUser(id, j) {
    let a = 0;
      if(this.players[j].id === id)
        this.players.splice(j, 1, { id: null, nick: null, score: null });
    this.players.forEach((player, index) => { if(player.id == null) a++;  });
        if(a == 6) return true;
  }
  // 라운드별로 userroom 객체내의 탈락한 player들을 null 입력
  get userid() {
    const playersId = this.players.map((players) => players.id);
    return playersId;
  }
  // 매칭시 player1~6까지 null이 있는지 체크, null이 없다면 false반환
  insertuserid(data) {
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
var userpool = []; //페이지 접속한 총인원
var userinfo = {}; //유저들의 정보모음집

// 목적이나 용도 따로 작성 필요
let roomcnt = 0;  // 매칭 전용 카운트
let room = new Array();
room[0] = new userroom();

io.on('connection', function(socket) {
  console.log(`${socket.id}님이 입장하셨습니다.`);

  socket.emit('user_id', socket.id);

  socket.on('disconnect', function(reason){
    console.log(`${socket.id}님이 %{reason}의 이유로 퇴장하셨습니다.`)
    roomout(socket.id);
    for( let i = 0; i < room.length; i++) {
      console.log('[matchcancel] leave 후 조인 방 정보 : ' + i + ' [ ' + room[i].roomCode + ' ] ');
      console.log('[matchcancel] 유저 정보삭제 후 정보 : '+ i + ' [ ' + room[i].userid + ' ] ');
      console.log('[matchcancel]  : '+ i + ' [ ' + room[i].check + ' ] ');
    }

    socket.broadcast.emit('leave_user',socket.id);
  });
  
  let newplayer = joinGame(socket);
  socket.emit('user_id', socket.id);

  function CreateRoom(key) { //방의 조건을 확인해서 방을 만들어주는 함수
    const check = room[room.length - 1].check;
    const data = room[room.length - 1].userid.filter((_null) => {
      if(_null != null) return _null;
    }) 
    check == '' || (data.length != 6 && check == 'm' && key)  ?  return true; : room[room.length] = new userroom();
    // 방만들기로 방에 데이터를 넣으려는 사람의 조건은 없다 => 0번에 매칭 , 새로운 사람이 방만들기로 데이터 입력하려고 createroom(); 이 조건이 없다
  }

  function getRoomIndex(Id) { //현재 내가 어떤 방에 들어가있는지 체크하는 함수
    const index = room.filter((ele_room, index) => {
      ele_room.userid.filter((ele_userid)=> ele_userid == id) return index;
    });
    return index;
  }  
  
  function roomout(id) { // 데이터 삭제 함수
    const index = getRoomIndex(id);
    socket.leave(room[index].roomCode);
    if(room[index].deleteUser(id, j)) {
      const temproom = room.filter((room, index) => {
        if(index !== i) return room;
      })
    room = temproom;
    }
  }

  function gamestart(id) {
    let userroomcnt = getRoomIndex(id);
    const array = room[userroomcnt].userid.filter((id) => id != null);
    if(array.length >= 2 && room[userroomcnt].check != 's') //방안에 유저가 있는 게 확인 되었을 때 그 방안의 인원을 체크하는 코드
    {
      console.log('유저 인원체크 완료');
      io.sockets.to(room[userroomcnt].roomCode).emit('gamestart');
      for(let t = 0 ; t < checkid.length ; t++) {
      //io.sockets.to(room[i].roomCode).emit('join_user', {
          io.emit('join_user', {
            id: checkid[t],
            x: 1024/2,
            y: 768/2,
            color : getPlayerColor()
          });
          console.log('유저 데이터 전송완료');
        }
      room[userroomcnt].check = 's';
      CreateRoom();
    }
    else if(array.length < 2){
      socket.emit('matchfail', roomout(id));
    }
  }

  socket.on('matchStart', function(data) {  // 매칭 하기 버튼
    for (let i = 0; i < room.length; i++) {
      if(room[i].check == 'm') {
        roomcnt = i;                
        }
      else if(room[i].check == '') {
        roomcnt = i;
        }
      else {
        roomcnt = room.length - 1;
      }
    
      if(room[roomcnt].roomCode == null && room[roomcnt].check == '')
        {
          room[roomcnt].check = 'm';
          room[roomcnt].insertuserid(data)
          room[roomcnt].roomCode = data.roomid;
          socket.join(room[roomcnt].roomCode);
          console.log('처음 방이 만들어졌습니다.  //' + '  방코드 : ' + room[roomcnt].roomCode);
          console.log('[matchStart] 들어간 유저 정보 : ' + room[roomcnt].userid);
          break;
        }
        else if(room[roomcnt].insertuserid(data) && room[roomcnt].check == 'm')
        {
          socket.join(room[roomcnt].roomCode);
          console.log('매칭 유저가 추가되었습니다.  //' + '  방코드 : ' + room[roomcnt].roomCode);
          console.log('[matchStart] 들어간 유저 정보 : ' + room[roomcnt].userid);
          break;
        }
      // 방에 6명이 있고 방이 없을 경우 방을 생성하는 if문
      else if(!(room[roomcnt].insertuserid(data)) && room[roomcnt].check == 'm' && room[roomcnt].alreadyUser == false)  //6명 매칭 중일때 // match time over는 게임중일때만 온다
        {
          roomcnt = room.length;
          room[roomcnt] = new userroom(); // boolean = createroom return true 
          room[roomcnt].check = 'm';
          room[roomcnt].roomCode = data.roomid;
          socket.join(room[roomcnt].roomCode);
          room[roomcnt].insertuserid(data);
          console.log('다음 방이 만들어졌습니다.  //' + '  방코드 : ' + room[roomcnt].roomCode);
          console.log('[matchStart] 들어간 유저 정보 : ' + room[roomcnt].userid);
          break;
        }
      
    }
  });


  socket.on('matchtimeover', function(id) { //매칭 종료버튼, 매칭 타이머 초과 시 받는 정보
    gamestart(id);
          console.log('타이머 종료 완료');
  })


  socket.on('matchcancel', function (id) { //매칭 중일 때 나가기 버튼
    roomout(id);
  })

  socket.on('createroom', function (data) { // data {id, roomid, nick, score}
    const {id, roomid, nick, score} = data;
    CreateRoom(false); // false > 방 생성
    room[room.length - 1].check = 'p';
    room[room.length - 1].roomCode = roomid;
    socket.join(room[room.length - 1].roomCode);
    room[room.length - 1].insertuserid(data);
    console.log('방 생성 완료' + id + ' / ' + roomid);
    console.log(socket.rooms);
    console.log('[createroom] 들어간 유저 정보 : ' + room[room.length - 1].userid);
  })
  
  socket.on('joinroom', function (data) {    // data {id, roomid, nick, score}
    for(let i = 0; i < room.length ; i++) {
      console.log('들어갈려는 방 코드 : ' + room[i].roomCode + ' / ' + '입력받은 방 코드 : ' + data.roomid);
        if(room[i].roomCode == data.roomid) {
          socket.join(data.roomid);
          room[i].insertuserid(data);
          console.log(socket.rooms);
          console.log('[joinroom] 들어간 유저 정보 : ' + room[i].userid);
          break;
        }
        else socket.emit('joinfail');
      }
  })

  socket.on('startgame', function(id) { // 방안에서 게임 시작 버튼
    gamestart(id);
          console.log('게임시작 버튼 실행');
  })

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


      