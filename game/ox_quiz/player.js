function ox_renderPlayer() {
  // rendering a player. 플레이어를 렌더링합니다.
  // 모든 플레이어를 그리는 코드
  for (let i = 0; i < playermap.length; i++) {
    let ball = playermap[i];
    ox_ctx.drawImage(ball.player, ball.x, ball.y, 50, 70);
    ox_ctx.beginPath();
    ox_ctx.fillStyle = ball.color;
    ox_ctx.font = "bold 20px DungGeunMo";
    ox_ctx.textAlign = "center";
    ox_ctx.fillText(ball.nick, ball.x + 25, ball.y - ball.radius + 10);
    // ox_ctx.fillStyle = "white";
    // ox_ctx.font = "20px DungGeunMo";
    // ox_ctx.strokeText(ball.nick, ball.x + 25, ball.y - ball.radius + 10);
    ox_ctx.closePath();
  }
  let curPlayer = players[myId];

  // 현재 플레이어만 그릴 수 있게 화살표는 이곳에서 그린다.
  ox_ctx.beginPath();

  ox_ctx.drawImage(curPlayer.arrow, curPlayer.x + 5, curPlayer.y - 42, 32, 32);

  ox_ctx.closePath();

  // 플레이어 이동
  if (!is_end && !is_checking) {
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
  }
  if (ballPressed && curPlayer.balldelaysec <= 0 && !is_checking) {
    socket.emit("ox_transBall_create", {
      x: (players[myId].x * 100) / X,
      y: (players[myId].y * 100) / Y,
      direction: players[myId].direction,
      id: myId,
    });
    curPlayer.balldelaysec = 150;
  }
  if (players[myId].y > Y - curPlayer.radius * 2) {
    players[myId].y = Y - curPlayer.radius * 2;
  } else if (players[myId].y < Y / 4) {
    players[myId].y = Y / 4;
  }
  if (players[myId].x < (X * 3) / 100) {
    players[myId].x = (X * 3) / 100;
  } else if (players[myId].x > (X * 97) / 100 - curPlayer.radius * 2) {
    players[myId].x = (X * 97) / 100 - curPlayer.radius * 2;
  }

  /** 플레이어가 현재 O인지 X인지를 식별하는 조건문 */
  if (players[myId].x + 25 < (X * 40) / 100) {
    players[myId].is_O = true;
    players[myId].is_X = false;
  } else if (players[myId].x + 25 >= (X * 60) / 100) {
    players[myId].is_O = false;
    players[myId].is_X = true;
  } else {
    players[myId].is_O = false;
    players[myId].is_X = false;
  }
}

function ox_player(id, nick, x, y, color) {
  this.id = id;
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
  this.player = new Image();
  this.player.src = this.asset[0];
  this.arrow = new Image(); // 플레이어 위치를 가리킬 화살표.
  this.arrow.src =
    "https://workmate.s3.ap-northeast-2.amazonaws.com/player_arrow.png"; // 화살표 이미지 링크.
  this.score = 0;
  this.radius = 16;
  this.PLAYERSPEED = 5;

  // 판정 관련
  this.is_O;
  this.is_X;

  // 이동 관련
  this.ismove = false;
  this.cnt = 0;
  this.direction = 0;

  // 상호작용 관련
  this.balldelaysec = 0;
}
