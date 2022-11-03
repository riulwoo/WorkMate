// 트랜스 볼
/* 준비물
1. 발사체 (총알)
2. 버튼
3. 재사용 시간 
4. 바라보는 방향으로 쏘는 기준
5. 맞았을 때 좌표 변경
6. 트랜스볼 갯수
*/

//트랜스볼 객체
function transBall(x, y, direction, id) {
  // 처음에 쏜 사람의 위치.
  this.initX = x;
  this.initY = y;
  this.x = x + 25;
  this.y = y + 35;
  this.direction = direction;
  this.radius = 3;
  
  switch (direction) {
    case 0: // 아래
      this.xv = 0;
      this.yv = 8;
      break;
    case 1: // 왼쪽
      this.xv = -8;
      this.yv = 0;
      break;
    case 2: // 위
      this.xv = 0;
      this.yv = -8;
      break;
    case 3: // 오른쪽
      this.xv = 8;
      this.yv = 0;
      break;
    case 4: // 왼 아래
      this.xv = -8;
      this.yv = 8;
      break;
    case 5: // 왼위
      this.xv = -8;
      this.yv = -8;
      break;
    case 6: // 오른 아래
      this.xv = 8;
      this.yv = 8;
      break;
    case 7: // 오른 위
      this.xv = 8;
      this.yv = -8;
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
      ox_ctx.drawImage(ball.image, ball.x - ball.radius, ball.y - ball.radius, 30, 20); // 크기는 65, 65

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
        x: players[myId].x,
        y: players[myId].y,
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
  balls.push(new transBall(data.x, data.y, data.direction, data.id));
});

socket.on("맞춘 사람의 위치2", (data) => {
  console.log("맞춘 사람의 좌표 값 : " + data.x + " / " + data.y);
  console.log("내 좌표 값 : " + players[myId].x + " / " + players[myId].y);
  players[myId].x = data.x;
  players[myId].y = data.y;
  console.log("맞춘 사람 좌표로 이동 후 좌표 값 : " + players[myId].x + " / " + players[myId].y);
})

// 쏜 사람과 맞은 사람의 좌표를 바꿔 줌
socket.on("트랜스볼 맞춤", (data) => {
  // 맞은 사람의 좌표를 받아 내 좌표가 바뀜
  // data > x, y
  console.log("맞은 사람의 좌표 값 : " + data.x + " / " + data.y);
  console.log("내 좌표 값 : " + players[myId].x + " / " + players[myId].y);
  socket.emit("맞춘 사람의 위치1", {
    x: players[myId].x,
    y: players[myId].y,
    id: myId
  })
  players[myId].x = data.x;
  players[myId].y = data.y;
  console.log("맞은 사람 좌표로 이동 후 좌표 값 : " + players[myId].x + " / " + players[myId].y);
});

