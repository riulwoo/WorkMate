const userroom = require("./class_room");
const quizIndex = require("./handler_ox");

module.exports = (io, socket, room) => {
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
    return index;
  }
  
  function roomout(id) { // 데이터 삭제 함수
    const index = getRoomIndex(id);
    console.log(index);
    if(index !== -1) {
      const uIndex = room[index].userid.findIndex(e => e == id);      
      socket.leave(room[index].roomCode);
      socket.broadcast.emit('leave_user', id);
      if(room[index].deleteUser(id, uIndex)) room.splice(index, 1);
      for(let i = 0; i < room.length; i++) {
        console.log('[matchcancel] leave 후 조인 방 정보 : ' + i + ' [ ' + room[i].roomCode + ' ] ');
        console.log('[matchcancel] 유저 정보삭제 후 정보 : '+ i + ' [ ' + room[i].userid + ' ] ');
        console.log('[matchcancel]  : '+ i + ' [ ' + room[i].check + ' ] ');
      }
    }
  }

  function gamestart(id) {
    let userroomcnt = getRoomIndex(id);
    console.log(userroomcnt);
    if(userroomcnt !== -1) {
      let array = room[userroomcnt].userid.filter((id) => id != null);
      if(array.length >= 2 && room[userroomcnt].check != 's') {//방안에 유저가 있는 게 확인 되었을 때 그 방안의 인원을 체크하는 코드
        console.log('유저 인원체크 완료');
        io.to(room[userroomcnt].roomCode).emit('playerinit', room[userroomcnt].pushplayers()); //객체 변수
        io.to(room[userroomcnt].roomCode).emit('gamestart', {
          game : room[userroomcnt].game()
        }); //객체 변수
        room[userroomcnt].check = 's';
        CreateRoom(false);
      }
      else if(array.length < 2) {
        socket.emit('matchfail', roomout(id));
      }//else if
    }else {
      socket.emit('matchfail', roomout(id));
    }
  }

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
          if(key == 'j') {
            io.to(room[Index].roomCode).emit('joinsuccess', {
              usernick : room[Index].usernick,
              roomcode : room[Index].roomCode,
              userid : room[Index].userid
            });
            socket.emit('readyUpdate', room[Index].readyIndex);
          }
        }
      } catch {
        socket.emit('joinfail');
        console.log(`[조인실패]`)
      } 
  }

  function disconnect(reason) {
    console.log(`${socket.id}님이 %{reason}의 이유로 퇴장하셨습니다.`)
    roomout(socket.id);
    console.log(`업뎃 후의 룸 정보 : ${room}`);
  }

  function gameover(id) {
    let index = getRoomIndex(id);
    if (index !== -1) {
        room[index].cnt += 1;
        if (room[index].cnt == room[index].players.length) {
          io.to(room[index].roomCode).emit('gamestart', {
              game : room[index].game()
          }); //객체 변수
          room[index].cnt = 0;
        }
    }
  }
  
  socket.emit('user_id', socket.id);

  socket.on('disconnect', (reason) => disconnect(reason));

  socket.on('matchStart', (data)=> insert('m', data));
  
    //매칭 종료버튼, 매칭 타이머 초과 시 받는 정보
  socket.on('matchtimeover', (id)=> gamestart(id));  

  //매칭 중일 때 나가기 버튼
  socket.on('matchcancel', (id)=> roomout(id));  

  // data {id, roomid, nick, score}
  socket.on('createroom',(data)=> insert('p', data)); 
  
  socket.on('joinroom', (data)=> insert('j', data));   

  // 방안에서 게임 시작 버튼
  socket.on('startgame', (id)=> gamestart(id));

  // 게임 종료시 다음 라운드로 넘어갈 지 결과페이지로 넘길지
  socket.on('gameover', (id)=> gameover(id));
  
  socket.on('calc-score', (data)=>{
    const {id, score} = data;
    const index = getRoomIndex(id);
    room[index].score(id, score);
    console.log("점수 데이터 : "+ score + " 내 아이디 : " + id);
    if (index !== -1) {
      room[index].cnt += 1;
      if (room[index].cnt == room[index].players.length) {
        console.log(room[index].players);
        io.to(room[index].roomCode).emit('go-result', room[index].players);
        room[index].cnt = 0;
      }
    }
  });

  socket.on('ready', (id) => {
    const index = getRoomIndex(id);
    io.to(room[index].roomCode).emit('readyUser', id);
  })

  socket.on('readyIndex', (id) => {
    const index = getRoomIndex(id);
    room[index].readyIndex.push(id);
    console.log("삽입 후 레디 인덱스 : " + room[index].readyIndex);
  })

  socket.on('CancelReadyIndex', (id) => {
    const index = getRoomIndex(id);
    room[index].rIndexUpdate(id);
    console.log("삭제 후 레디 인덱스 : " + room[index].readyIndex);
  })
};