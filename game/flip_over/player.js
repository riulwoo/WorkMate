function flip_renderPlayer() {
  // rendering a player. 플레이어를 렌더링합니다.
  // 모든 플레이어를 그리는 코드
  for (let i = 0; i < playermap.length; i++) {
    let ball = playermap[i];
    flip_ctx.drawImage(ball.player, ball.x, ball.y, 50, 70);
    flip_ctx.beginPath();
    flip_ctx.fillStyle = ball.color;
    flip_ctx.font = "bold 20px DungGeunMo";
    flip_ctx.textAlign = "center";
    flip_ctx.fillText(ball.nick, ball.x + 25, ball.y - ball.radius + 10);
    // ball.x - 23
    flip_ctx.closePath();
  }
  let curPlayer = players[myId];

  // 현재 플레이어만 그릴 수 있게 화살표는 이곳에서 그린다.
  flip_ctx.beginPath();

  flip_ctx.drawImage(
    curPlayer.arrow,
    curPlayer.x + 5,
    curPlayer.y - 42,
    32,
    32
  );

  flip_ctx.closePath();

  // 플레이어 이동
  if (players[myId].stun_sec <= 0) {
    if (rightPressed) {
      curPlayer.direction = 3;
      if (upPressed) {
        curPlayer.direction = 7;
        curPlayer.y -= curPlayer.PLAYERSPEED;
      } else if (downPressed) {
        curPlayer.direction = 6;
        curPlayer.y += curPlayer.PLAYERSPEED;
      }
      curPlayer.ismove = true;
      curPlayer.player.src = moveeffect(curPlayer);
      curPlayer.x += curPlayer.PLAYERSPEED;
      sendData(curPlayer);
    } else if (upPressed) {
      curPlayer.direction = 2;
      if (rightPressed) {
        curPlayer.direction = 7;
        curPlayer.x += curPlayer.PLAYERSPEED;
      } else if (leftPressed) {
        curPlayer.direction = 5;
        curPlayer.x -= curPlayer.PLAYERSPEED;
      }
      curPlayer.ismove = true;
      curPlayer.player.src = moveeffect(curPlayer);
      curPlayer.y -= curPlayer.PLAYERSPEED;
      sendData(curPlayer);
    } else if (leftPressed) {
      curPlayer.direction = 1;
      if (upPressed) {
        curPlayer.direction = 5;
        curPlayer.y -= curPlayer.PLAYERSPEED;
      } else if (downPressed) {
        curPlayer.direction = 4;
        curPlayer.y += curPlayer.PLAYERSPEED;
      }
      curPlayer.ismove = true;
      curPlayer.player.src = moveeffect(curPlayer);
      curPlayer.x -= curPlayer.PLAYERSPEED;
      sendData(curPlayer);
    } else if (downPressed) {
      curPlayer.direction = 0;
      if (rightPressed) {
        curPlayer.direction = 6;
        curPlayer.x += curPlayer.PLAYERSPEED;
      } else if (leftPressed) {
        curPlayer.direction = 4;
        curPlayer.x -= curPlayer.PLAYERSPEED;
      }
      curPlayer.ismove = true;
      curPlayer.player.src = moveeffect(curPlayer);
      curPlayer.y += curPlayer.PLAYERSPEED;
      sendData(curPlayer);
    } else {
      curPlayer.player.src = curPlayer.asset[curPlayer.direction];
      curPlayer.ismove = false;
      sendData(curPlayer);
    }
    if (keyPressed && !players[myId].delay) {
      choose(curPlayer);
      keyPressed = false;
    }
  }

  // collision detection of player. 플레이어가 문제 출력 영역으로 이동하지 못하도록 충돌을 감지합니다.
  if (players[myId].y <= (Y * 9) / 100 + curPlayer.radius) {
    players[myId].y = (Y * 9) / 100 + curPlayer.radius;
  } else if (players[myId].y > (Y * 98) / 100 - curPlayer.radius * 2) {
    players[myId].y = (Y * 98) / 100 - curPlayer.radius * 2;
  }
  if (players[myId].x < (X * 4) / 100 + curPlayer.radius) {
    players[myId].x = (X * 4) / 100 + curPlayer.radius;
  } else if (players[myId].x > (X * 96) / 100 - curPlayer.radius * 2) {
    players[myId].x = (X * 96) / 100 - curPlayer.radius * 2;
  }
}

function flip_player(id, nick, x, y, color) {
  this.id = id;
  // 플레이어 닉네임 설정
  this.nick = nick;
  this.asset = [
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/down.png", // 아래
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/left.png", // 왼쪽
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/up.png", // 위
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/right.png", // 오른
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/leftdown.png", // 왼아래
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/leftup.png", // 왼위
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/rightdown.png", // 오른아래
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player/asset/rightup.png", // 오른위
  ];

  this.color = color;
  this.x = x;
  this.y = y;
  this.radius = 16;
  this.PLAYERSPEED = 5;
  this.player = new Image();
  this.player.src = this.asset[0];
  this.arrow = new Image(); // 플레이어 위치를 가리킬 화살표.
  this.arrow.src =
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player_arrow.png"; // 화살표 이미지 링크.
  this.score = 0;
  this.first_delay_sec = 0; // 첫번째 카드가 choose되고 3초 뒤에 다시 원상태 복귀하게 하는 변수 firstpick = false; → first_delay_sec = 180;
  this.delay = false; // 2번째카드가 맞춰질때 까지 다른 카드를 못 뒤집게 막는 변수        player.secondcard = card_index; → delay = match_flow 실행 후에 풀리는걸로
  this.stun_sec = 0;
  this.firstpick = true; // true면 사용자가 현재 첫번째 선택을 하고 있다는 뜻.
  this.firstcard; // 사용자가 고른 첫 카드
  this.secondcard; // 사용자가 고른 두번째 카드

  // 판정 관련
  this.matched;

  // 이동 관련
  this.ismove = false;
  this.cnt = 0;
  this.direction = 0;
}
