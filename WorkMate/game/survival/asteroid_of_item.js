function ItemAsteroid(x, y, xv, yv, id) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.xv = xv;
  this.yv = yv;
  this.radius = 90; // 반지름
  this.image = new Image();
  // 편지
  this.image.src = "https://workmate.s3.ap-northeast-2.amazonaws.com/mail.png";
}

/** 특수 장애물을 화면에 출력하는 메서드. */
function renderSpecObs() {
  if (roids_of_item.length > 0) {
    //render
    for (let i = 0; i < roids_of_item.length; i++) {
      let R = roids_of_item[i];
      // rendering a Asteroid. 장애물을 화면에 출력합니다.

      surv_ctx.beginPath();
      surv_ctx.drawImage(R.image, R.x - R.radius, R.y - R.radius, 180, 180); // 크기는 180, 180

      surv_ctx.closePath();

      if (SHOW_BOUNDING) {
        surv_ctx.beginPath();
        surv_ctx.strokeStyle = "lime";
        surv_ctx.lineWidth = 3;
        surv_ctx.strokeRect(
          R.x - R.radius,
          R.y - R.radius,
          R.radius * 2,
          R.radius * 2
        );
        // surv_ctx.arc(R.x, R.y, R.radius, Math.PI * 2, false);
        surv_ctx.stroke();
        surv_ctx.closePath();
      }
    }

    // move
    for (let i = 0; i < roids_of_item.length; i++) {
      let R = roids_of_item[i];
      // Asteroid will move in field.
      R.x += R.xv;
      R.y += R.yv;
      // 영역밖으로 나갈 시 삭제
      if (R.x < -200 || R.x > 1900 || R.y < -200 || R.y > 1000)
        roids_of_item.splice(i, 1);
    }
  }
}

/** 특수 장애물과 부딫혔을 때의 동작을 구현한 메서드. */
function distSpecObs() {
  if (players[myId].stunsec < 0) {
    let px = players[myId].x - players[myId].radius;
    let py = players[myId].y - players[myId].radius;
    let sx;
    let sy;

    for (let i = 0; i < roids_of_item.length; i++) {
      sx = roids_of_item[i].x - roids_of_item[i].radius;
      sy = roids_of_item[i].y - roids_of_item[i].radius;

      if (
        distBetweenPoints(px, py, sx, sy) <
          roids_of_item[i].radius + players[myId].radius &&
        players[myId].id != roids_of_item[i].id
      ) {
        players[myId].stunsec = Math.ceil(PLAYER_STUN_DUR * FPS);
      }
    }
  }
}
