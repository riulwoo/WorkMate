function ox_renderPlayer() {
  // rendering a player. 플레이어를 렌더링합니다.
  // 모든 플레이어를 그리는 코드
  for (let i = 0; i < playermap.length; i++) {
    let ball = playermap[i];
    ox_ctx.drawImage(ball.player, ball.x, ball.y, 50, 70);
    ox_ctx.beginPath();
    ox_ctx.fillStyle = ball.color;
    ox_ctx.font = "bold 20px DungGeunMo";
    ox_ctx.fillText(ball.nick, ball.x + 25, ball.y - ball.radius + 10);
    // ox_ctx.fillStyle = "white";
    // ox_ctx.font = "20px DungGeunMo";
    // ox_ctx.strokeText(ball.nick, ball.x + 25, ball.y - ball.radius + 10);
    ox_ctx.closePath();
  }
  let curPlayer = players[myId];
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
  if(ballPressed && curPlayer.balldelaysec <= 0 && !is_checking) { //
    console.log(players[myId].y * 100 / Y);
    socket.emit("트랜스볼 생성", {
      x: players[myId].x * 100 / X,
      y: players[myId].y * 100 / Y,
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

  if (players[myId].x < 0) {
    players[myId].x = 0;
  } else if (players[myId].x > X - curPlayer.radius * 2) {
    players[myId].x = X - curPlayer.radius * 2;
  }

  /** 플레이어가 현재 O인지 X인지를 식별하는 조건문 */
  if (players[myId].x + 25 < (X * 40) / 100) {
    players[myId].is_O = true;
    players[myId].is_X = false;
  } else if (players[myId].x + 25 >= (X * 60) / 100) {
    players[myId].is_O = false;
    players[myId].is_X = true;
  }
  else
  {
    players[myId].is_O = false;
    players[myId].is_X = false;
  }
}

function ox_player(id, nick, x, y, color) {
  this.id = id;
  this.nick = nick;
  this.asset = [
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451716855582750/dd_17.png", // 아래
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451526304137217/gg_12.png", // 왼쪽
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451443055607838/gg_05.png", // 위
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451573129367592/gg_13.png", // 오른
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451629450481664/gg_16.png", // 왼아래
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451379939717130/dd_03.png", // 왼위
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451865224884234/gg_18.png", // 오른아래
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451494075125800/gg_07.png", // 오른위
  ];

  this.color = color;
  this.x = x;
  this.y = y;
  this.player = new Image();
  this.player.src = this.asset[0];
  this.score = 0;
  this.radius = 16;
  this.PLAYERSPEED = 6;

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
