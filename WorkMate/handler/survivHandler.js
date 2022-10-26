let enemyInterval;

module.exports = (io, socket, room) => {
  function getIndex(id) {
    return room.findIndex((e) => e.userid.includes(id));
  }

  function sendAsteroid(userRoomIndex) {
    let time = 0;
    enemyInterval = setInterval((userRoomIndex) => {
      obstacle(userRoomIndex);
      time += 1;
      if(time >= 180) {
        clearInterval(enemyInterval);
        io.to(room[userRoomIndex].roomCode).emit("살아남기 게임끝");
      }
    }, 1000)
  }

  function obstacle(userRoomIndex) {
    leftObastacle(userRoomIndex);
    rightObastacle(userRoomIndex);
    upObastacle(userRoomIndex);
    downObastacle(userRoomIndex);
    leftObastacle(userRoomIndex);
    rightObastacle(userRoomIndex);
    upObastacle(userRoomIndex);
    downObastacle(userRoomIndex);  }
// 보낼 좌표값 : x y 시작좌표 , xv yv 이동 속도 , 이미지 타입 0~2번
  function rightObastacle(userRoomIndex) {
    io.to(room[userRoomIndex].emit("장애물 생성하거라"), {
      x : 1600,
      y : Math.floor(Math.random() * 950),
      xv : Math.floor(Math.random() * (3 - 1) + 1) * (-1),
      yv : Math.floor(Math.random() * (3 - 1) + 1) * (Math.random() < 0.5 ? 1 : -1),
      type : Math.floor(Math.random() * 2)
    })
  }

  function upObastacle(userRoomIndex) {
      io.to(room[userRoomIndex].emit("장애물 생성하거라"), {
      x : Math.floor(Math.random() * (1500 - 100)) + 100,
      y : 0,
      xv : Math.floor(Math.random() * (3 - 1) + 1) * (Math.random() < 0.5 ? 1 : -1),
      yv : Math.floor(Math.random() * (3 - 1) + 1),
      type : Math.floor(Math.random() * 2)
    })
  }
  
  function leftObastacle(userRoomIndex) {
      io.to(room[userRoomIndex].emit("장애물 생성하거라"), {
      x : 1600,
      y : Math.floor(Math.random() * 950),
      xv : Math.floor(Math.random() * (3 - 1) + 1),
      yv : Math.floor(Math.random() * (3 - 1) + 1) * (Math.random() < 0.5 ? 1 : -1),
      type : Math.floor(Math.random() * 2)
    })
  }
  
  function downObastacle(userRoomIndex) {
      io.to(room[userRoomIndex].emit("장애물 생성하거라"), {
      x : Math.floor(Math.random() * (1500 - 100)) + 100,
      y : 950,
      xv : Math.floor(Math.random() * (3 - 1) + 1) * (Math.random() < 0.5 ? 1 : -1),
      yv : Math.floor(Math.random() * (3 - 1) + 1) * (-1),
      type : Math.floor(Math.random() * 2)
    })
  }
  
  function itemXYV () {
    let item = {x : Math.floor(Math.random() * (1500-400)) + 400,
                y :  Math.floor(Math.random() * (800-100)) + 100,
                xv : Math.floor(Math.random() * (5 - 1) + 1) * (Math.random() < 0.5 ? 1 : -1),
                yv : Math.floor(Math.random() * (5 - 1) + 1) * (Math.random() < 0.5 ? 1 : -1)
               }
    return item;
  }

  function goalXY (){
    let goal = [];
    for (let i = 0; i < 2; i++) {
      goal.push({ x: Math.floor(Math.random() * (1500-400)) + 400,
                  y: Math.floor(Math.random() * (800-100)) + 100
                });
    }
    return goal;
  }
  socket.on("레이스쥰비완료쓰", (id) => {
    let userRoomIndex = getIndex(id);
    if (userRoomIndex !== -1) {
      room[userRoomIndex].cnt += 1;
      let player = room[userRoomIndex].players;
      if (room[userRoomIndex].cnt == player.length) {
        io.to(room[userRoomIndex].roomCode).emit("게임수타투", {
          /** 초반 돈, 아이템 좌표 전달*/
          goal : goalXY(),
          item : itemXYV()
        });
        sendAsteroid(userRoomIndex);
        room[userRoomIndex].cnt = 0;
      }
    }
    
  });

  // 아이템 먹으면 30초 뒤에 다시 생성
  socket.on("아이템 먹었대요", (id) => {
    let index = getIndex(id);
    setTimeout(() => {
      io.to(room[index].roomCode).emit("아이템생성하거라", {
        /** 아이템 생성 좌표 전달 */
      });
    }, 30000);
  });

  // 아이템 효과 중 특수장애물 요청이 들어오면 화면 중앙 or 양쪽 끝에 특수장애물이 지나감
  socket.on("특수장애물이래요", (id) => {
    let index = getIndex(id);
    io.to(room[index].roomCode).emit("특수 장애물 생성하거라", {
      /** 특수 장애물 생성 좌표 전달
       *  특수장애물은 2개 생성 > 생성 좌표 2가지 화면 중앙 2개 / 화면 양쪽 끝 2개
       */
    });
  });

  socket.on("돈 생성해달래요", (id) => {
    let index = getIndex(id);
    io.to(room[index].roomCode).emit("돈을 생성하거라", {
      /** 돈 생성 좌표 전달
       *  돈은 이동좌표도 생성
       */
    });
  });
};
