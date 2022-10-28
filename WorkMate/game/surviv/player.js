function renderPlayer() {
  //console.log(playermap);
  for (let i = 0; i < playermap.length; i++) {
    let player = playermap[i];
    // rendering a player. 플레이어를 렌더링합니다.

    ctx.beginPath();

    if (player.blinksec % 2 == 0) {
      // 플레이어가 무적일 때 깜빡이게 표현
      ctx.drawImage(
        player.player,
        player.x - player.radius,
        player.y - player.radius,
        70,
        70
      );
    }

    ctx.fillStyle = player.color;
    ctx.font = "15px DungGeunMo";
    ctx.textAlign = "center";
    ctx.fillText(player.nick, player.x, player.y - player.radius - 10);

    ctx.closePath();
  } // end of for
  
  let curPlayer = players[myId];
  
  if (curPlayer.blinkNum > 0) {
    // reduce the blink time
    curPlayer.blinkTime--;

    if (curPlayer.blinkTime == 0) {
      curPlayer.blinkTime = Math.ceil(PER_SEC * FPS);
      curPlayer.blinkNum--;
    }
  } //end of if

  // 기절중이 아닐때에만 플레이어가 움직이도록 설정
  if (curPlayer.stunsec <= 0) {
    // 플레이어 이동
      if (rightPressed) {
        curPlayer.direction = 3;
        if (upPressed) {
          curPlayer.direction = 7;
          curPlayer.y -= PLAYERSPEED;
        } else if (downPressed) {
          curPlayer.direction = 6;
          curPlayer.y += PLAYERSPEED;
        }
        curPlayer.ismove = true;
        curPlayer.player.src = moveeffect(curPlayer);
        curPlayer.x += PLAYERSPEED;
        sendData(curPlayer);
      } // 
      else if (upPressed) {
        curPlayer.direction = 2;
        if (rightPressed) {
          curPlayer.direction = 7;
          curPlayer.x += PLAYERSPEED;
        } else if (leftPressed) {
          curPlayer.direction = 5;
          curPlayer.x -= PLAYERSPEED;
        }
        curPlayer.ismove = true;
        curPlayer.player.src = moveeffect(curPlayer);
        curPlayer.y -= PLAYERSPEED;
        sendData(curPlayer);
      } // 
      else if (leftPressed) {
        curPlayer.direction = 1;
        if (upPressed) {
          curPlayer.direction = 5;
          curPlayer.y -= PLAYERSPEED;
        } else if (downPressed) {
          curPlayer.direction = 4;
          curPlayer.y += PLAYERSPEED;
        }
        curPlayer.ismove = true;
        curPlayer.player.src = moveeffect(curPlayer);
        curPlayer.x -= PLAYERSPEED;
        sendData(curPlayer);
      } //
      else if (downPressed) {
        curPlayer.direction = 0;
        if (rightPressed) {
          curPlayer.direction = 6;
          curPlayer.x += PLAYERSPEED;
        } else if (leftPressed) {
          curPlayer.direction = 4;
          curPlayer.x -= PLAYERSPEED;
        }
        curPlayer.ismove = true;
        curPlayer.player.src = moveeffect(curPlayer);
        curPlayer.y += PLAYERSPEED;
        sendData(curPlayer);
      } //
      else {
        curPlayer.player.src = curPlayer.asset[curPlayer.direction];
        curPlayer.ismove = false;
      } //
    } // end of playermove

    // handle use item. 아이템 사용을 구현합니다.
    if (itemPressed) {
      if (curPlayer.itemPocket == 1)
      {
        itemBox.effect();
      }
      curPlayer.itemPocket = 0;
    }

    // handle edge of screen // 플레이어가 화면 밖으로 벗어나지 몬하도록
    if (curPlayer.x < 0) {
      curPlayer.x = 0;
    } else if (curPlayer.x > WIDTH) {
      curPlayer.x = WIDTH;
    }
  

  if (curPlayer.y < 0) {
    curPlayer.y = 0;
  } else if (curPlayer.y > HEIGHT) {
    curPlayer.y = HEIGHT;
  }

  // 플레이어의 점수가 0 미만으로 떨어지면
  if (curPlayer.score < 0) {
    curPlayer.score = 0;
  }
}

function sendData(curPltion) {
  let data = {};
  data = {
    id: curPlayer.id,
    x: curPlayer.x,
    y: curPlay,
    direction: curPlayer.direction,
    ismove: curPlayer.ismove,
    cnt: curPlayer.cntion,
  };
  if (data) {
    socket.emit("send_location", data);
  }
}

function updateState(id, x, y, direction) {
  let player = players[id];
  if (!player) {
    return;
  }
  player.x = x;
  player.y;
  player.direction = direction;
  player.ismove = ismove;
  player.cnt = cnt;
  player.player.src = player.ismove
    ? moveeffect(player)
    : player.asset[player.direction];
}

socket.on("update_state", function (data) {
  updateState(data.id, data.x, data.y, data.direction);
});

function surviv_player(id, nick) {
  this.id = id;
  this.nick = nick;
  this.direction;
  this.asset = [
    // 플레이어로써 출력 될 이미지.
    // 이미지는 총 8개 (회사원 이미지로 대체 예정)
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451716855582750/dd_17.png", // 아래
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451526304137217/gg_12.png", // 왼쪽
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451443055607838/gg_05.png", // 위
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451573129367592/gg_13.png", // 오른
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451629450481664/gg_16.png", // 왼아래
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451379939717130/dd_03.png", // 왼위
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451865224884234/gg_18.png", // 오른아래
    "https://cdn.discordapp.com/attachments/980090904394219562/1026451494075125800/gg_07.png",
  ];

  this.radius = 40; // 반지름
  this.color = "#FF00FF"; // 닉네임 색
  this.x = WIDTH / 2; // x 좌표
  this.y = HEIGHT - this.radius; // y 좌표
  this.player = new Image();
  this.player.src = this.asset[0]; // 플레이어의 현재 이미지. 방향키를 누를때 바뀐다.
  this.score = 0; // 플레이어의 현재 점수
  this.blinksec = 0;

  this.stunsec = -1;
  this.itemImg = new Image();
  this.itemPocket = 0;

  // 이동관련
  this.ismove = false;
  this.cnt = 0;
  this.direction = 0;
}
