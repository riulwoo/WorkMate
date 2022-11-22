let enemyInterval;

module.exports = (io, socket, room) => {
  function getIndex(id) {
    return room.findIndex((e) => e.userid.includes(id));
  }

  function sendAsteroid(index) {
    let time = 0;
    enemyInterval = setInterval(() => {
      obstacle(index);
      time += 3.5; 
      if (time >= 90) { 
        clearInterval(enemyInterval);
        io.to(room[index].roomCode).emit("survival_end"); // 살아남기 게임끝
      }
    }, 3500); 
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
    io.to(room[index].roomCode).emit("create_obs", {
      // 장애물 생성하거라
      x: 100,
      y: Math.floor(Math.random() * 100),
      xv: (Math.random() * (0.4 - 0.2) + 0.2).toFixed(1) * -1,
      yv:
        (Math.random() * (0.4 - 0.2) + 0.2).toFixed(1) *
        (Math.random() < 0.5 ? 1 : -1),
      type: Math.floor(Math.random() * 4),
    });
  }

  function upObastacle(index) {
    io.to(room[index].roomCode).emit("create_obs", {
      // 장애물 생성하거라
      x: Math.floor(Math.random() * 100),
      y: 0,
      xv:
        (Math.random() * (0.4 - 0.2) + 0.2).toFixed(1) *
        (Math.random() < 0.5 ? 1 : -1),
      yv: (Math.random() * (0.4 - 0.2) + 0.2).toFixed(1),
      type: Math.floor(Math.random() * 4),
    });
  }

  function leftObastacle(index) {
    io.to(room[index].roomCode).emit("create_obs", {
      // 장애물 생성하거라
      x: 0,
      y: Math.floor(Math.random() * 100),
      xv: (Math.random() * (0.4 - 0.2) + 0.2).toFixed(1),
      yv:
        (Math.random() * (0.4 - 0.2) + 0.2).toFixed(1) *
        (Math.random() < 0.5 ? 1 : -1),
      type: Math.floor(Math.random() * 4),
    });
  }

  function downObastacle(index) {
    io.to(room[index].roomCode).emit("create_obs", {
      // 장애물 생성하거라
      x: Math.floor(Math.random() * 100),
      y: 100,
      xv:
        (Math.random() * (0.4 - 0.2) + 0.2).toFixed(1) *
        (Math.random() < 0.5 ? 1 : -1),
      yv: (Math.random() * (0.4 - 0.2) + 0.2).toFixed(1) * -1,
      type: Math.floor(Math.random() * 4),
    });
  }

  function itemXYV() {
    let item = {
      x: Math.floor(Math.random() * (80 - 20)) + 20,
      y: Math.floor(Math.random() * (80 - 20)) + 20,
      xv:
        (Math.random() * (0.5 - 0.1) + 0.1).toFixed(1) *
        (Math.random() < 0.5 ? 1 : -1),
      yv:
        (Math.random() * (0.5 - 0.1) + 0.1).toFixed(1) *
        (Math.random() < 0.5 ? 1 : -1),
    };
    return item;
  }

  function goalXY() {
    let goal = [];
    for (let i = 0; i < 2; i++) {
      goal.push({
        x: Math.floor(Math.random() * (75 - 25)) + 25,
        y: Math.floor(Math.random() * (75 - 25)) + 25,
      });
    }
    return goal;
  }

  function centerLocation(index, wLC, id) {
    for (let i = 0; i < 3; i++) {
      if (wLC == 0) {
        // 왼쪽 벽에서 생성
        io.to(room[index].roomCode).emit("create_item_obs", {
          // 특수 장애물 생성하거라
          x: 0,
          y: 36.5 + 19.2 * i,
          xv: 0.6,
          yv: 0,
          id: id,
        });
      } else if (wLC == 1) {
        //오른쪽 벽에서 생성
        io.to(room[index].roomCode).emit("create_item_obs", {
          // 특수 장애물 생성하거라
          x: 100,
          y: 36.5 + 19.2 * i,
          xv: -0.6,
          yv: 0,
          id: id,
        });
      }
    }
    for (let i = 0; i < 6; i++) {
      if (wLC == 2) {
        //위쪽 벽에서 생성
        io.to(room[index].roomCode).emit("create_item_obs", {
          // 특수 장애물 생성하거라
          x: 17 + 12.8 * i,
          y: 0,
          xv: 0,
          yv: 0.8,
          id: id,
        });
      } else if (wLC == 3) {
        // 아래쪽 벽에서 생성
        io.to(room[index].roomCode).emit("create_item_obs", {
          // 특수 장애물 생성하거라
          x: 17 + 12.8 * i,
          y: 100,
          xv: 0,
          yv: -0.8,
          id: id,
        });
      }
    }
  }

  function LRLocation(index, wLC, id) {
    let LR;
    for (let i = 0; i < 4; i++) {
      LR = i < 2 ? 19 : 34;
      if (wLC == 0) {
        // 왼쪽 벽에서 생성
        io.to(room[index].roomCode).emit("create_item_obs", {
          // 특수 장애물 생성하거라
          x: 0,
          y: LR + 19.2 * i,
          xv: 0.6,
          yv: 0,
          id: id,
        });
      } else if (wLC == 1) {
        //오른쪽 벽에서 생성
        io.to(room[index].roomCode).emit("create_item_obs", {
          // 특수 장애물 생성하거라
          x: 100,
          y: LR + 19.2 * i,
          xv: -0.6,
          yv: 0,
          id: id,
        });
      }
    }
    for (let i = 0; i < 6; i++) {
      LR = i < 3 ? 8.6 : 27.4;
      if (wLC == 2) {
        //위쪽 벽에서 생성
        io.to(room[index].roomCode).emit("create_item_obs", {
          // 특수 장애물 생성하거라
          x: LR + 12.8 * i,
          y: 0,
          xv: 0,
          yv: 0.8,
          id: id,
        });
      } else if (wLC == 3) {
        // 아래쪽 벽에서 생성
        io.to(room[index].roomCode).emit("create_item_obs", {
          // 특수 장애물 생성하거라
          x: LR + 12.8 * i,
          y: 100,
          xv: 0,
          yv: -0.8,
          id: id,
        });
      }
    }
  }

  function specialObastable(index, id, type) {
    // 생성 위치를 랜덤으로 판별한 뒤 그 위치별로 좌표 전송
    let wLocation = Math.floor(Math.random() * 4); // 장애물이 생성될 벽의 방향
    if (type == 0)
      centerLocation(index, wLocation, id); // 장애물이 생성될 좌표 위치
    else if (type == 1) LRLocation(index, wLocation, id); // 장애물이 생성될 좌표 위치
  }

  socket.on("survival_ready", (id) => {
    // 레이스쥰비완료쓰
    let index = getIndex(id);
    if(index < 0) return;
      room[index].cnt += 1;
      let player = room[index].players;
      if (room[index].cnt == player.length) {
        io.to(room[index].roomCode).emit("survival_start", {
          // 게임수타투
          /** 초반 돈, 아이템 좌표 전달*/
          goal: goalXY(),
          item: itemXYV(),
        });
        sendAsteroid(index);
        room[index].cnt = 0;
      }
  });

  // 아이템 먹으면 30초 뒤에 다시 생성
  socket.on("get_item", (id) => {
    // 아이템 먹었대요
    let index = getIndex(id);
    if(index < 0) return;
      io.to(room[index].roomCode).emit("have_a_item"); // 아이템먹었음
      setTimeout(() => {
        io.to(room[index].roomCode).emit("create_item", itemXYV()); // 아이템생성하거라
      }, 4000); //8000
  });

  // 아이템 효과 중 특수장애물 요청이 들어오면 화면 중앙 or 양쪽 끝에 특수장애물이 지나감
  socket.on("create_spc_obs", (data) => {
    // 특수장애물이래요
    const { id, type } = data;
    let index = getIndex(id);
    if(index < 0) return;
    specialObastable(index, id, type);
  });

  socket.on("get_money", (data) => {
    // 돈 먹었대요
    const { id, i } = data;
    let index = getIndex(id);
    if(index < 0) return;
    io.to(room[index].roomCode).emit("have_a_money", i); // 돈 먹었대
  });

  socket.on("create_money", (id) => {
    // 돈 생성해달래요
    let index = getIndex(id);
    if(index < 0) return;
    io.to(room[index].roomCode).emit("need_some_money", goalXY()); // 돈을 생성하거라
  });
};
