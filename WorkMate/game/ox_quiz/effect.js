//트랜스볼 객체
function transBall(_x, _y, direction, id) {
  // 처음에 쏜 사람의 위치.
  console.log(_x, _y)
  this.x = (_x * X) / 100 + 25;
  this.y = (_y * Y) / 100 + 35;
  this.direction = direction;
  this.radius = 3;
  
  switch (direction) {
    case 0: // 아래
      this.xv = 0;
      this.yv = 15;
      break;
    case 1: // 왼쪽
      this.xv = -15;
      this.yv = 0;
      break;
    case 2: // 위
      this.xv = 0;
      this.yv = -15;
      break;
    case 3: // 오른쪽
      this.xv = 15;
      this.yv = 0;
      break;
    case 4: // 왼 아래
      this.xv = -15;
      this.yv = 15;
      break;
    case 5: // 왼위
      this.xv = -15;
      this.yv = -15;
      break;
    case 6: // 오른 아래
      this.xv = 15;
      this.yv = 15;
      break;
    case 7: // 오른 위
      this.xv = 15;
      this.yv = -15;
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
      
      ox_ctx.drawImage(ball.image, ball.x - 25, ball.y - 35, 30, 20); // 크기는 65, 65

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
      distBetweenPoints(px, py, sx, sy) <
        balls[i].radius + 35 &&
      players[myId].id != balls[i].id
    ) {
      // 좌표랑 좌표를 서로 바꿔주는 effect효과를 넣어야 함
      // 내 좌표만 그 사람의 좌표로 바뀌고
      socket.emit("트랜스볼 맞음", {
        x: (players[myId].x * 100) / X,
        y: (players[myId].y * 100) / Y,
        id: balls[i].id
      });
      
      socket.emit("트랜스볼 없어짐", {
        id : myId,
        i : i
      });
    }
  }
}
socket.on("트랜스볼 삭제", (i) => balls.splice(i, 1));

//메시지 처리 구역
socket.on("트랜스볼 씀", (data) => {
  //data = x, y, direction, id
  console.log("클라로 넘어온 값 : " + dat)
  balls.push(new transBall(data.x, data.y, data.direction, data.id));
});

socket.on("맞춘 사람의 위치2", (data) => {
  console.log("-----------------------------------------");
  console.log("맞춘 사람의 좌표 값 : " + data.x + " / " + data.y);
  console.log("내 좌표 값 : " + players[myId].x + " / " + players[myId].y);
  console.log(data.y);
  console.log((data.y * Y) / 100);
  console.log(players[myId].y * 100 / Y);
  players[myId].x = (data.x * X) / 100;
  players[myId].y = (data.y * Y) / 100;
  sendData(players[myId]);
  console.log("맞춘 사람 좌표로 이동 후 좌표 값 : " + players[myId].x + " / " + players[myId].y);
  console.log("-----------------------------------------");
})

// 쏜 사람과 맞은 사람의 좌표를 바꿔 줌
socket.on("트랜스볼 맞춤", (data) => {  // 공을 던진 사람
  // 맞은 사람의 좌표를 받아 내 좌표가 바뀜
  // data > x, y
  console.log("-----------------------------------------");
  console.log("맞은 사람의 좌표 값 : " + data.x + " / " + data.y);
  console.log("내 좌표 값 : " + players[myId].x + " / " + players[myId].y);
  console.log(data.y);
  console.log((data.y * Y) / 100);
  console.log(players[myId].y * 100 / Y);
  socket.emit("맞춘 사람의 위치1", {
    x: (players[myId].x * 100) / X,
    y: (players[myId].y * 100) / Y,
    id: data.id
  })
  players[myId].x = (data.x * X) / 100;
  players[myId].y = (data.y * Y) / 100;
  sendData(players[myId]);
  console.log("맞은 사람 좌표로 이동 후 좌표 값 : " + players[myId].x + " / " + players[myId].y);
  console.log("-----------------------------------------");
});

