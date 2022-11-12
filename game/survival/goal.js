function Goal(x, y) {
  // id, x, y
  // 서버랑 같이
  this.radius = 20;
  this.x = x;
  this.y = y;
  this.image = new Image();
  this.image.src =
    "https://workmate.s3.ap-northeast-2.amazonaws.com/surviv/surv_money.png";
  this.blink = () => {};
}

function renderGoal() {
  if (goal.length > 0) {
    for (let i = 0; i < goal.length; i++) {
      let G = goal[i];
      // rendering a money. 골인지점을 렌더링합니다.

      surv_ctx.beginPath();
      surv_ctx.drawImage(G.image, G.x - G.radius, G.y - G.radius, 65, 65);

      surv_ctx.closePath();
    }
  } else {
    socket.emit("create_money", myId);
  }
}

function distGoal() {
  let px = players[myId].x - players[myId].radius;
  let py = players[myId].y - players[myId].radius;
  let gx;
  let gy;

  for (let i = 0; i < goal.length; i++) {
    gx = goal[i].x - goal[i].radius;
    gy = goal[i].y - goal[i].radius;

    if (
      distBetweenPoints(px, py, gx, gy) <
      goal[i].radius + players[myId].radius
    ) {
      socket.emit("get_money", {
        id: myId,
        i: i,
      });
      players[myId].score += 30;
    }
  }
}

socket.on("have_a_money", (i) => {
  goal.splice(i, 1);
});
