function Asteroid(x, y, xv, yv, type) {
  // 서버랑 같이
  this.x = x;
  this.y = y;
  this.xv = xv;
  this.yv = yv;
  this.radius = 45;
  this.image = new Image();
  
  // 이미지 종류 : 복사기, 문서더미, 노트북
  this.asset = [
    "https://cdn.discordapp.com/attachments/980090904394219562/1026420114792386560/60a40c6de0adf37b.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026421335607488572/7.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026201836232913006/card_laptop.png",
  ];

  this.image.src = this.asset[type];
  // 클라이언트마다 이미지 에셋이 다르게 출력됨.
  // 매개변수에 asset을 추가하고, 서버에서 인덱스를 지정해 뿌려줘야 할듯.
}

/** 장애물을 그림 */
function renderObs()
{
  for (let i = 0; i < roids.length; i++) {
    let R = roids[i];
    // rendering a Asteroid. 장애물을 화면에 출력합니다.

    ctx.beginPath();
    ctx.drawImage(
      R.image,
      R.x - R.radius,
      R.y - R.radius,
      90,
      90
    ); // 크기는 90, 90

    ctx.closePath();
  }
}

/** 장애물을 움직임 */
function moveObs()
{
  for (let i = 0; i < roids.length; i++) {
    let R = roids[i];
    // Asteroid will move in field.

      R.x += R.xv;
      R.y += R.yv;
    
    if (R.x < -100 || R.x > 1900 || R.y < -100 || R.y > 1000){
      Rs.splice(i,1);
    } // roids.splice 화면 밖으로 나간 장애물 삭제
  }
  
}

/** 장애물에 충돌하면 플레이어가 기절함 */
function distObs()
{
  if (player.stunsec <= 0)
  {
    let px = myplayer.x;
    let py = myplayer.y;
    let ax;
    let ay;

    for (let i = 0; i < roids.length; i++) {
      ax = roids[i].x + roids[i].radius;
      ay = roids[i].y + roids[i].radius;

      if (distBetweenPoints(px, py, ax, ay) < roids[i].radius + myplayer.radius) {
        myplayer.stunsec = Math.ceil(PLAYER_STUN_DUR * FPS);
      }
    }
  }
}
