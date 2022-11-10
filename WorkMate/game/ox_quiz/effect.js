//트랜스볼 객체
function transBall(x, y, direction, id) {
  // 처음에 쏜 사람의 위치.
  this.initX = x;
  this.initY = y;
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.radius = 25;

  switch (direction) {
    case 0: // 아래
      this.xv = 0;
      this.yv = 30;
      break;
    case 1: // 왼쪽
      this.xv = -30;
      this.yv = 0;
      break;
    case 2: // 위
      this.xv = 0;
      this.yv = -30;
      break;
    case 3: // 오른쪽
      this.xv = 30;
      this.yv = 0;
      break;
    case 4: // 왼 아래
      this.xv = -30;
      this.yv = 30;
      break;
    case 5: // 왼위
      this.xv = -30;
      this.yv = -30;
      break;
    case 6: // 오른 아래
      this.xv = 30;
      this.yv = 30;
      break;
    case 7: // 오른 위
      this.xv = 30;
      this.yv = -30;
      break;
  }
  this.id = id; // 발사한 사람
  this.image = new Image();
  this.image.src =
    "https://cdn.discordapp.com/attachments/980090904394219562/1035889079222554724/Untitled_10-29-2022_09-10-45.png";
}

// 트랜스볼 그리기
function drawBall() {
  // 그리기
  if (balls.length > 0) {
    for (let i = 0; i < balls.length; i++) {
      let ball = balls[i];
      ox_ctx.beginPath();
      ox_ctx.drawImage(
        ball.image,
        ball.x + ball.radius,
        ball.y + ball.radius,
        30,
        20
      ); // 크기는 65, 65

      ox_ctx.closePath();
      //draw
    }

    // move
    for (let i = 0; i < balls.length; i++) {
      let ball = balls[i];
      // Asteroid will move in field.

      ball.x += ball.xv;
      ball.y += ball.yv;

      // 볼이 화면밖
      if (ball.x < -100 || ball.x > 1900 || ball.y < -100 || ball.y > 1100) {
        balls.splice(i, 1);
      }
    }
  }
}

// 트랜스볼 충돌 시 실행 함수 > 충돌 여부 체크는 ?
function distBall() {
  let px = players[myId].x + players[myId].radius;
  let py = players[myId].y + players[myId].radius;
  let sx;
  let sy;

  for (let i = 0; i < balls.length; i++) {
    sx = balls[i].x + balls[i].radius;
    sy = balls[i].y + balls[i].radius;

    if (
      distBetweenPoints(px, py, sx, sy) < balls[i].radius + players[myId].radius &&
      players[myId].id != balls[i].id
    ) {
      // 좌표랑 좌표를 서로 바꿔주는 effect효과를 넣어야 함
      // 내 좌표만 그 사람의 좌표로 바뀌고
      console.log("1. 트랜스볼 맞음");
      socket.emit("ox_transBall_hit", {
        x: (players[myId].x * 100) / X,
        y: (players[myId].y * 100) / Y,
        id: balls[i].id,
      });

      console.log("ex. 트랜스볼 없어짐");
      socket.emit("ox_transBall_remove", {
        id: myId,
        i: i,
      });
    }
  }
}
socket.on("ox_transBall_del", (i) => balls.splice(i, 1));

//메시지 처리 구역
socket.on("ox_transBall_use", (data) => {
  //data = x, y, direction, id
  balls.push(new transBall((data.x * X) / 100, (data.y * Y) / 100, data.direction, data.id));
});

socket.on("ox_return_XY", (data) => {
  console.log("3. 트랜스볼 맞아서 내 좌표 바뀜");
  players[myId].x = (data.x * X) / 100;
  players[myId].y = (data.y * Y) / 100;
  sendData(players[myId]);
});

// 쏜 사람과 맞은 사람의 좌표를 바꿔 줌
socket.on("ox_hit_XY", (data) => {
  console.log("2. 트랜스볼 맞춰서 그 사람의 좌표로 이동");
  // 공을 던진 사람
  // 맞은 사람의 좌표를 받아 내 좌표가 바뀜
  // data > x, y
  socket.emit("ox_hit_return", {
    x: (players[myId].x * 100) / X,
    y: (players[myId].y * 100) / Y,
    id: data.id,
  });
  players[myId].x = (data.x * X) / 100;
  players[myId].y = (data.y * Y) / 100;
  sendData(players[myId]);
});
