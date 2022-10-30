let enemyInterval;

module.exports = (io, socket, room) => {
  function getIndex(id) {
    return room.findIndex((e) => e.userid.includes(id));
  }

  function sendAsteroid(index) {
    let time = 0;
    enemyInterval = setInterval(() => {
      obstacle(index);
      time += 5;
      if (time >= 180) {
        clearInterval(enemyInterval);
        io.to(room[index].roomCode).emit("살아남기 게임끝");
      }
    }, 5000);
  }

  function obstacle(index) {
    leftObastacle(index);
    rightObastacle(index);
    upObastacle(index);
    downObastacle(index);
    leftObastacle(index);
    rightObastacle(index);
    upObastacle(index);
    downObastacle(index);
  }
  // 보낼 좌표값 : x y 시작좌표 , xv yv 이동 속도 , 이미지 타입 0~2번
  function rightObastacle(index) {
    io.to(room[index].roomCode).emit("장애물 생성하거라", {
      x: 1500,
      y: Math.floor(Math.random() * 900),
      xv: Math.floor(Math.random() * (3 - 1) + 1) * -1,
      yv:
        Math.floor(Math.random() * (3 - 1) + 1) *
        (Math.random() < 0.5 ? 1 : -1),
      type: Math.floor(Math.random() * 2),
    });
  }

  function upObastacle(index) {
    io.to(room[index].roomCode).emit("장애물 생성하거라", {
      x: Math.floor(Math.random() * (1400 - 200)) + 200,
      y: -100,
      xv:
        Math.floor(Math.random() * (3 - 1) + 1) *
        (Math.random() < 0.5 ? 1 : -1),
      yv: Math.floor(Math.random() * (3 - 1) + 1),
      type: Math.floor(Math.random() * 2),
    });
  }

  function leftObastacle(index) {
    io.to(room[index].roomCode).emit("장애물 생성하거라", {
      x: 100,
      y: Math.floor(Math.random() * 800),
      xv: Math.floor(Math.random() * (3 - 1) + 1),
      yv:
        Math.floor(Math.random() * (3 - 1) + 1) *
        (Math.random() < 0.5 ? 1 : -1),
      type: Math.floor(Math.random() * 2),
    });
  }

  function downObastacle(index) {
    io.to(room[index].roomCode).emit("장애물 생성하거라", {
      x: Math.floor(Math.random() * (1400 - 200)) + 200,
      y: 900,
      xv:
        Math.floor(Math.random() * (3 - 1) + 1) *
        (Math.random() < 0.5 ? 1 : -1),
      yv: Math.floor(Math.random() * (3 - 1) + 1) * -1,
      type: Math.floor(Math.random() * 2),
    });
  }

  function itemXYV() {
    let item = {
      x: Math.floor(Math.random() * (1300 - 400)) + 400,
      y: Math.floor(Math.random() * (700 - 100)) + 100,
      xv:
        Math.floor(Math.random() * (5 - 1) + 1) *
        (Math.random() < 0.5 ? 1 : -1),
      yv:
        Math.floor(Math.random() * (5 - 1) + 1) *
        (Math.random() < 0.5 ? 1 : -1),
    };
    return item;
  }

  function goalXY() {
    let goal = [];
    for (let i = 0; i < 2; i++) {
      goal.push({
        x: Math.floor(Math.random() * (1300 - 400)) + 400,
        y: Math.floor(Math.random() * (700 - 100)) + 100,
      });
    }
    return goal;
  }

  function centerLocation(index, wLC, id) {
    for (let i = 0; i < 3; i++) {
      if (wLC == 0) {
        // 왼쪽 벽에서 생성
        io.to(room[index].roomCode).emit("특수 장애물 생성하거라", {
          x: 0,
          y: 270 + 180 * i,
          xv: 5,
          yv: 0,
          id: id,
        });
      } else if (wLC == 1) {
        //오른쪽 벽에서 생성
        io.to(room[index].roomCode).emit("특수 장애물 생성하거라", {
          x: 1600,
          y: 270 + 180 * i,
          xv: 5 * -1,
          yv: 0,
          id: id,
        });
      }
    }
    for (let i = 0; i < 5; i++) {
      if (wLC == 2) {
        //위쪽 벽에서 생성
        io.to(room[index].roomCode).emit("특수 장애물 생성하거라", {
          x: 650 + 180 * i,
          y: -200,
          xv: 0,
          yv: 5,
          id: id,
        });
      } else if (wLC == 3) {
        // 아래쪽 벽에서 생성
        io.to(room[index].roomCode).emit("특수 장애물 생성하거라", {
          x: 650 + 180 * i,
          y: 1000,
          xv: 0,
          yv: 5 * -1,
          id: id,
        });
      }
    }
  }

  function LRLocation(index, wLC, id) {
    let LR;
    for (let i = 0; i < 4; i++) {
      LR = i < 2 ? 90 : 170;
      if (wLC == 0) {
        // 왼쪽 벽에서 생성
        io.to(room[index].roomCode).emit("특수 장애물 생성하거라", {
          x: 0,
          y: LR + 180 * i,
          xv: 5,
          yv: 0,
          id: id,
        });
      } else if (wLC == 1) {
        //오른쪽 벽에서 생성
        io.to(room[index].roomCode).emit("특수 장애물 생성하거라", {
          x: 1600,
          y: LR + 180 * i,
          xv: 5 * -1,
          yv: 0,
          id: id,
        });
      }
    }
    for (let i = 0; i < 6; i++) {
      LR = i < 3 ? 290 : 410;
      if (wLC == 2) {
        //위쪽 벽에서 생성
        io.to(room[index].roomCode).emit("특수 장애물 생성하거라", {
          x: LR + 180 * i,
          y: -200,
          xv: 0,
          yv: 5,
          id: id,
        });
      } else if (wLC == 3) {
        // 아래쪽 벽에서 생성
        io.to(room[index].roomCode).emit("특수 장애물 생성하거라", {
          x: LR + 180 * i,
          y: 1000,
          xv: 0,
          yv: 5 * -1,
          id: id,
        });
      }
    }
  }

  function specialObastable(index, id, type) {
    // 생성 위치를 랜덤으로 판별한 뒤 그 위치별로 좌표 전송
    let wLocation = Math.floor(Math.random() * 4); // 장애물이 생성될 벽의 방향
    console.log(type);
    if (type == 0)
      centerLocation(index, wLocation, id); // 장애물이 생성될 좌표 위치
    else if (type == 1) LRLocation(index, wLocation, id); // 장애물이 생성될 좌표 위치
  }

  socket.on("레이스쥰비완료쓰", (id) => {
    let index = getIndex(id);
    if (index !== -1) {
      room[index].cnt += 1;
      let player = room[index].players;
      if (room[index].cnt == player.length) {
        io.to(room[index].roomCode).emit("게임수타투", {
          /** 초반 돈, 아이템 좌표 전달*/
          goal: goalXY(),
          item: itemXYV(),
        });
        sendAsteroid(index);
        room[index].cnt = 0;
      }
    }
  });

  // 아이템 먹으면 30초 뒤에 다시 생성
  socket.on("아이템 먹었대요", (id) => {
    let index = getIndex(id);
    io.to(room[index].roomCode).emit("아이템먹었음");
    setTimeout(() => {
      io.to(room[index].roomCode).emit("아이템생성하거라", itemXYV());
    }, 30000);
  });

  // 아이템 효과 중 특수장애물 요청이 들어오면 화면 중앙 or 양쪽 끝에 특수장애물이 지나감
  socket.on("특수장애물이래요", (data) => {
    const { id, type } = data;
    let index = getIndex(id);
    specialObastable(index, id, type);
  });

  socket.on("돈 먹었대요", (data) => {
    const { id, i } = data;
    let index = getIndex(id);
    io.to(room[index].roomCode).emit("돈 먹었대", i);
  });

  socket.on("돈 생성해달래요", (id) => {
    let index = getIndex(id);
    io.to(room[index].roomCode).emit("돈을 생성하거라", goalXY());
  });
};
