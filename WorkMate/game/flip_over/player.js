function flip_renderPlayer() {
  // rendering a player. 플레이어를 렌더링합니다.
  console.log("랜더링중");
  // 모든 플레이어를 그리는 코드
  for (let i = 0; i < playermap.length; i++) {
    let ball = playermap[i];
    flip_ctx.drawImage(ball.player, ball.x, ball.y, 50, 70);
    flip_ctx.beginPath();
    flip_ctx.fillStyle = ball.color;
    flip_ctx.font = "15px DungGeunMo";
    flip_ctx.fillText(ball.nick, ball.x + 15, ball.y - ball.radius + 10);
    flip_ctx.closePath();
  }
  let curPlayer = players[myId];
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
  if (players[myId].y <= 0 + curPlayer.radius) {
    players[myId].y = 0 + curPlayer.radius;
  }

  if (players[myId].y > Y - curPlayer.radius * 2) {
    players[myId].y = Y - curPlayer.radius * 2;
  }

  if (players[myId].x < 0 + curPlayer.radius) {
    players[myId].x = 0 + curPlayer.radius;
  } else if (players[myId].x > X - curPlayer.radius * 2) {
    players[myId].x = X - curPlayer.radius * 2;
  }
}

function flip_player(id, nick, x, y, color) {
  this.id = id;
  // 플레이어 닉네임 설정
  this.nick = nick;
  this.asset = [
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451716855582750/dd_17.png", // 아래
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451526304137217/gg_12.png", // 왼쪽
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451443055607838/gg_05.png", // 위
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451573129367592/gg_13.png", // 오른
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451629450481664/gg_16.png", // 왼아래
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451379939717130/dd_03.png", // 왼위
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451865224884234/gg_18.png", // 오른아래
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451494075125800/gg_07.png",
  ];

  this.color = color;
  this.x = x;
  this.y = y;
  this.radius = 16;
  this.PLAYERSPEED = 5;
  this.player = new Image();
  this.player.src = this.asset[0];
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
