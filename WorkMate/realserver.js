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

app.use(express.static('views'));
app.use('/views', express.static(__dirname + 'game'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/gamebase', (req, res) =>{
  res.sendFile(__dirname + '/views/game/' + game)  // game : 랜덤한 게임의 경로를 문자열로 변수화
})

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

function PlayerBall(id, nick){
    this.id = id;
    this.color = "#FF00FF";
    this.x = 1024/2;
    this.y = 768/2;
    if(nick == null)
        this.nick = "player " + Math.floor(Math.random()*100);
    else
        this.nick = nick;
    // // 플레이어의 앞, 뒤, 왼, 오 이미지 => 현재 앞모습 이미지 밖에 없음
    // this.asset = ['https://cdn.discordapp.com/attachments/980090904394219562/1004271208226881606/1.png',
    //               'https://cdn.discordapp.com/attachments/980090904394219562/1004271284735193139/4.png',
    //               'https://cdn.discordapp.com/attachments/980090904394219562/1004271240271376385/4.png',
    //               'https://cdn.discordapp.com/attachments/980090904394219562/1004271430722146345/3.png'];

    // // 키 입력 받을 시 이미지
    // this.currentImage = new Image();
    // this.currentImage.src = this.asset[0];
}



class userroom {  // 클라이언트 코드에도 작성해야함 : 같이 플레이하는 유저의 정보도 알아야 게임이 됨
  constructor(){
    this.check = '';              // 생성된 방이 matching 인지 private인지 체크
    this.roomCode = null;         // 방 코드
    this.roundCheck = -1;         // 라운드 구별 변수
    this.gameName = ['null', 'null', 'null'];                // 게임배열 랜덤으로 게임을 시작하기위한 변수
    this.users = [];          // 플레이어 1~6명의 정보
    for (let i = 0; i < 6; i++) {
      this.users.push({ id: null, nick: null, score: null });
    }
    this.players = [];        // 실제 게임을 할 플레이어 정보
  }
  // room[roomcnt].players.push(room[roomcnt].PlayerBall(id,nick))
  // 변수.players[]
  
  // 플레이어 정보 입력
  pushplayers(){
    this.users.forEach((e, i) => {
      if(e.id !==null) {
        let player = new PlayerBall(e.id, e.nick);
        this.players[e.id] = player;
      }
    });
  }

  // 유저 삭제
  deleteUser(id, i) {
    let a = 0;
      if(this.users[i].id === id)
        this.users.splice(i, 1, { id: null, nick: null, score: null });
    this.users.forEach((player, index) => { if(player.id == null) a++;  });
        if(a == 6) return true;
  }
  // id값 출력
  get userid() {
    const usersId = this.users.map((user) => user.id);
    return usersId;
  }

  // 모든 정보 출력
  get userinfo(){
    return this.users;
  }
  // 매칭시 player1~6까지 null이 있는지 체크, null이 없다면 false반환
  insertuserid(data) {
    const { id, roomid, nick, score } = data;
    for(let i = 0 ; i < 6 ; i++) {
      if(this.roomCode != null && this.users[5].id != null) {
        console.log('여기 들어왔다구');
        return false;
      }else if (this.roomCode != null && this.users[i].id == null) {
        this.users.splice(i, 1, { id: id, nick: nick, score: score });
        return true;
      }else if (this.roomCode == null) {
        this.users.splice(i, 1, { id: id, nick: nick, score: score });
        return true;
      }
    }
  }
}

//-------------------------- 지역 변수 --------------------------------

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
 
  socket.emit('user_id', socket.id);

  function CreateRoom(key) { //방의 조건을 확인해서 방을 만들어주는 함수
    let check, data;
    try {
      check = room[room.length - 1].check;
      data = room[room.length - 1].userid.filter((_null) => {
        if(_null != null) return _null;
      })
      console.log(`방체크 완료!! ${room}`);
    } catch {
      room[0] = new userroom();
      check = room[room.length - 1].check;
      data = room[room.length - 1].userid.filter((_null) => {
        if(_null != null) return _null;
      })
      if(room[0].check == '')
      console.log(`방생성 완료!! ${room[0].check}`);
    }
    return check == '' || (data.length != 6 && check == 'm' && key)  ?  true : room[room.length] = new userroom();
  }

  function getRoomIndex(Id) { //현재 내가 어떤 방에 들어가있는지 체크하는 함수
    const index = room.findIndex(e => e.userid.includes(Id));
    console.log(`getRoomIndex : ${index}`);
    return index;
  }
  
  function roomout(id) { // 데이터 삭제 함수
    const index = getRoomIndex(id); 
    if(index !== -1) {
      const uIndex = room[index].userid.filter((e, i) => {
        if(id === e) return i;
      })
      socket.leave(room[index].roomCode);
        if(room[index].deleteUser(id, uIndex)) {
          const temproom = room.filter((room, index) => {
            if(index !== uIndex) return room;
          })
          room = temproom;
          break;
        }
    }
  }//function

  function gamestart(id) {
    let userroomcnt = getRoomIndex(id);
    console.log(userroomcnt);
    if(userroomcnt !== -1) {
      let array = room[userroomcnt].userid.filter((id) => id != null);
      if(array.length >= 2 && room[userroomcnt].check != 's') {//방안에 유저가 있는 게 확인 되었을 때 그 방안의 인원을 체크하는 코드
        console.log('유저 인원체크 완료');
        room[userroomcnt].pushplayers();
        // json 객체 변수
        io.sockets.to(room[userroomcnt].roomCode).emit('gamestart');//객체 변수
      
        room[userroomcnt].check = 's';
        CreateRoom(false);
      }
      else if(array.length < 2) {
        socket.emit('matchfail', roomout(id));
      }//else if
    }else {
      socket.emit('matchfail', roomout(id));
    }
  }//function

  function insert(key, data) { //매칭, 방만들기, joinroom 
    let {id, roomid, nick, score} = data; //유저 데이터
    let roomcnt = room.findIndex((e) => e.check === 'm'); //매칭중인 방의 인덱스
    console.log(`[matchstart] 매칭 , 처음 입장 체크 코드 : ${roomcnt}`);
    let ck, Index, roomcode; //삽입될 데이터들
    switch(key) { //함수 실행시 매칭, 방만들기, 방입장 3개중 어떤 것인지 체크
      case 'p':
        CreateRoom(false);
        Index = room.length - 1;
        ck = 'p';
        console.log(`[createroom] 만들어진 방 check 변수 : ${room[Index].check}`);
        break;
      case 'm': //처음들어온 사람은 무조건 index -1
        CreateRoom(true);
        roomcnt = roomcnt == -1 ? room.findIndex((e) => e.check == '') : roomcnt;
        Index = roomcnt;
        ck = 'm';
        console.log(`방만들기 인덱스 코드 : ${Index}`);
        if(room[Index].roomCode !== null) roomid = room[Index].roomCode;
        console.log(`[matchstart] 삽입될 데이터 정보 : ${Index} , ${roomid}`);
        break;
      case 'j':
        Index = room.findIndex((e) => e.roomCode == roomid);
        ck = 'p';
        console.log(`[joinroom] 들어갈 방 코드 확인 여부 : ${Index}`);
        break;
    }
      try {
        if(room[Index].check !== 's') {
          console.log(`[Index 확인 완료]`);
          room[Index].check = ck;
          console.log(`[Check 데이터] : ${room[Index].check}`);
          room[Index].roomCode = roomid;
          console.log(`[roomCode 데이터] : ${room[Index].roomCode}`);
          socket.join(room[Index].roomCode);
          console.log(`[join 데이터] : ${socket.rooms}`);
          room[Index].insertuserid(data);
          console.log(`[insertuserid 데이터] : ${room[Index].userid}`);
        }
      } catch {
        socket.emit('joinfail');
        console.log(`[조인실패]`)
      } 
  }  
  
  socket.on('matchStart', function(data) { 
    insert('m', data);
  });

  socket.on('matchtimeover', function(id) { //매칭 종료버튼, 매칭 타이머 초과 시 받는 정보
    gamestart(id);
    console.log('타이머 종료 완료');
  })


  socket.on('matchcancel', function (id) { //매칭 중일 때 나가기 버튼
    roomout(id);
  })

  socket.on('createroom', function (data) { // data {id, roomid, nick, score}
    insert('p', data);
  })
  
  socket.on('joinroom', function (data) {    // data {id, roomid, nick, score}
    insert('j', data);  
    let index = getRoomIndex();
    io.to(room[index].roomCode).emit('joinsuccess', room[index].userinfo);
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


      