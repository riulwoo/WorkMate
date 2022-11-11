function Asteroid(x, y, xv, yv, type) {
  // 서버랑 같이
  this.x = x;
  this.y = y;
  this.xv = xv;
  this.yv = yv;

  if (type == 2 || type == 3) {
    this.radius = 35;
  } else {
    this.radius = 45;
  }

  this.image = new Image();

  // 이미지 종류 : 문서더미, 복사기, 노트북
  this.asset = [
    "https://workmate.s3.ap-northeast-2.amazonaws.com/surviv/surv_documents.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/surviv/surv_printer.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/surviv/surv_laptop.png",
    "https://workmate.s3.ap-northeast-2.amazonaws.com/surviv/surv_calculer.png",
  ];

  this.image.src = this.asset[type];
  // 클라이언트마다 이미지 에셋이 다르게 출력됨.
  // 매개변수에 asset을 추가하고, 서버에서 인덱스를 지정해 뿌려줘야 할듯.
}

/** 장애물을 그림 */
function renderObs() {
  for (let i = 0; i < roids.length; i++) {
    let R = roids[i];
    // rendering a Asteroid. 장애물을 화면에 출력합니다.

    surv_ctx.beginPath();
    surv_ctx.drawImage(
      R.image,
      R.x - R.radius,
      R.y - R.radius,
      R.radius * 2,
      R.radius * 2
    ); // 크기는 90, 90

    surv_ctx.closePath();

    // 장애물의 피격 판정을 그립니다.
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

  for (let i = 0; i < roids.length; i++) {
    let R = roids[i];
    // Asteroid will move in field.

    R.x += R.xv;
    R.y += R.yv;

    if (R.x < -100 || R.x > 1900 || R.y < -100 || R.y > 1100) {
      roids.splice(i, 1);
    } // roids.splice 화면 밖으로 나간 장애물 삭제
  }
}

/** 장애물에 충돌하면 플레이어가 기절함 */
function distObs() {
  if (players[myId].stunsec < 0) {
    let px = players[myId].x - players[myId].radius;
    let py = players[myId].y - players[myId].radius;
    let ax;
    let ay;

    for (let i = 0; i < roids.length; i++) {
      ax = roids[i].x - roids[i].radius;
      ay = roids[i].y - roids[i].radius;

      if (
        distBetweenPoints(px, py, ax, ay) <
        roids[i].radius + players[myId].radius
      ) {
        players[myId].stunsec = Math.ceil(PLAYER_STUN_DUR * FPS);
      }
    }
  }
}
