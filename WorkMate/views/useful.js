// 코드 마켓
//코드 백업
 //match start 부분
    for (let i = 0; i < room.length; i++) { //모든방의 빈자리를 체크하는 for문
      if(room[i].check == 'm') {            //ex) m 2번방 p 4번방 일때 2번방을 찾아 들어가야한다
        roomcnt = i;                        //createroom은 모든 방을 확인하지 않는다
        }                                   //createroom이 모든 방을 확인하게 된다면 매 체크마다 반환된다
      else if(room[i].check == '') {        //그걸 수정하고 이 for문을 넣기 위해선 조건을 세세하게 넣어야한다
        roomcnt = i;
        }
      else {
        roomcnt = room.length - 1;
      }
      
      if(room[roomcnt].roomCode == null && room[roomcnt].check == '') //체크만 가능
        {
          room[roomcnt].check = 'm';
          room[roomcnt].insertuserid(data)
          room[roomcnt].roomCode = data.roomid;
          socket.join(room[roomcnt].roomCode);
          console.log('처음 방이 만들어졌습니다.  //' + '  방코드 : ' + room[roomcnt].roomCode);
          console.log('[matchStart] 들어간 유저 정보 : ' + room[roomcnt].userid);
          break;
        }
        else if(room[roomcnt].insertuserid(data) && room[roomcnt].check == 'm') // createroom 함수 가능
        {
          socket.join(room[roomcnt].roomCode);
          console.log('매칭 유저가 추가되었습니다.  //' + '  방코드 : ' + room[roomcnt].roomCode);
          console.log('[matchStart] 들어간 유저 정보 : ' + room[roomcnt].userid);
          break;
        }
      // 방에 6명이 있고 방이 없을 경우 방을 생성하는 if문
      else if(!(room[roomcnt].insertuserid(data)) && room[roomcnt].check == 'm')  // createroom 가능
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


//  createroom 부분

    room[room.length - 1].check = 'p';
    room[room.length - 1].roomCode = roomid;
    socket.join(room[room.length - 1].roomCode);
    room[room.length - 1].insertuserid(data);
    console.log('방 생성 완료' + id + ' / ' + roomid);
    console.log(socket.rooms);
    console.log('[createroom] 들어간 유저 정보 : ' + room[room.length - 1].userid);


// joinroom 부분
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