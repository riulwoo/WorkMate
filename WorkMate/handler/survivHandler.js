const howmany = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
module.exports = (io, socket, room) => {
  function getIndex(id) {
    return room.findIndex((e) => e.userid.includes(id));
  }

  const cycle = (index) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let obstacle = obstacleXYV();
        io.to(room[index].roomCode).emit(
          "장애물 생성하거라", obstacle);
        resolve();
      }, 12000);
    });
  };
  
  const sendAsteroid = async (index) => {
    for await (var i of howmany) {
      await cycle(index);
    }
  };

  function obstacleXYV() {
    let XYV = [];
    for(let i = 0; i < 10; i++) {
      XYV.push({x : Math.floor(Math.random() * (1500-400)) + 400,
                y : Math.floor(Math.random() * (800-100)) + 100,
                xv : Math.floor(Math.random() * (5 - 1) + 1) * (Math.random() < 0.5 ? 1 : -1),
                yv : Math.floor(Math.random() * (5 - 1) + 1) * (Math.random() < 0.5 ? 1 : -1)
               }) // 난수 설정하는 부분은 나중에 메서드 형식으로 따로 만들어서 관리하는게 좋을듯 하다.
    }
    return XYV;
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
