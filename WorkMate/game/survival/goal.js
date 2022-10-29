function Goal(x, y) { // id, x, y
  // 서버랑 같이
  this.radius = 20;
  // this.id = id; // id 값이 꼭 있어야해?????
  this.x = x;
  this.y = y;
  this.image = new Image();
  this.image.src =
    "https://cdn.discordapp.com/attachments/980090904394219562/1025853774016811058/293546e0e809970.png";

  // 돈 먹으면 서버에 먹었다고 보내고 서버는 이 돈의 고유번호를 보내서 모든 플레이어 화면에서 해당 id의 돈을 삭제
  this.blink = () => {};
}

function renderGoal()
{
  if(goal.length > 0)
  {
    for (let i = 0; i < goal.length; i++) {
      let G = goal[i];
      // rendering a money. 골인지점을 렌더링합니다.
  
      surv_ctx.beginPath();
      surv_ctx.drawImage(
        G.image,
        G.x - G.radius,
        G.y - G.radius,
        65,
        65
      ); // 크기는 65, 65
  
      surv_ctx.closePath();
    }
  }
  else
  {
    socket.emit("돈 생성해달래요", myId);
  }
}

function distGoal()
{
  let px = curPlayer.x;
  let py = curPlayer.y;
  let gx;
  let gy;

  for (let i = 0; i < goal.length; i++) {
    gx = goal[i].x + goal[i].radius;
    gy = goal[i].y + goal[i].radius;

    if (distBetweenPoints(px, py, gx, gy) < goal[i].radius + curPlayer.radius) {
      socket.emit("돈 먹었대요", {
        id : myId,
        i : i
      })
      goal.splice(i, 1);
      curPlayer.score += 50;
    }
  }
}
socket.on("돈 먹었대", (i)=>{
  goal.splice(i, 1);
})