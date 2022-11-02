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
  this.initX = x;
  this.initY = y;
  this.x = x;
  this.y = y;
  this.direction = direction;
  swith(direction) {
    case 0:  // 아래
      this.xv = 0;
      this.yv = 8;
      break;
    case 1:  // 왼쪽
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
  this.id = id;            // 발사한 사람
  this.image = new Image();
  this.image.src = "https://cdn.discordapp.com/attachments/980090904394219562/1035889079222554724/Untitled_10-29-2022_09-10-45.png"
}

// 트랜스볼 그리기
function drawBall() {
  // 그리기
  for(let i = 0; i < balls.length ; i++)
    {
      let ball = balls[i];
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

// 트랜스볼 충돌 시
function distBall() {
  let px = players[myId].x - players[myId].radius;
  let py = players[myId].y - players[myId].radius;
  let sx;
  let sy;

  for (let i = 0; i < roids_of_item.length; i++) {
    sx = roids_of_item[i].x - roids_of_item[i].radius;
    sy = roids_of_item[i].y - roids_of_item[i].radius;

    if (distBetweenPoints(px, py, sx, sy) < roids_of_item[i].radius + players[myId].radius && players[myId].id != roids_of_item[i].id) {
      // 좌표랑 좌표를 서로 바꿔주는 effect효과를 넣어야 함
      // 내 좌표만 그 사람의 좌표로 바뀌고 
      
      socket.emit("트랜스볼 맞음", {
        x : players[myId].x, 
        y : players[myId].y, 
        id : ball.id
      })
      socket.emit("트랜스볼 없어짐", i) // > on > io.emit  
      // > socket.to(id).emit(트랜스볼 맞춤, {x: x , y: y})
      // io.sockets.socket(id).send(메시지);
      players[myId].x = ball.initX;
      players[myId].y = ball.initY;
    }
}

let balls = [];

socket.on("트랜스볼 삭제", (i) => balls.splice(i, 1))
  
//메시지 처리 구역
socket.on("트랜스볼 씀", (data)=> {
  //data = x, y, direction, id
  balls.push(new transBall(data.x, data.y, data.direction, data.id))
})

// 쏜 사람과 맞은 사람의 좌표를 바꿔 줌
socket.on("트랜스볼 맞춤", (data) => {
  // 맞은 사람의 좌표를 받아 내 좌표가 바뀜
  // data > x, y
  players[myId].x = data.x;
  players[myId].y = data.y;
})


//renderPlayer > keyPressed > 
socket.emit("트랜스볼 생성", {
  x : players[myId].x, 
  y : players[myId].y, 
  direction : player[myId].direction, 
  id : myId
} // > io.to().emit("트랜스볼 씀")