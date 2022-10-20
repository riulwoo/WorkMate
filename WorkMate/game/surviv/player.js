function renderPlayer() {
  //console.log(playermap);
  for (let i = 0; i < playermap.length; i++) {
    let player = playermap[i];
    // rendering a player. 플레이어를 렌더링합니다.

    ctx.beginPath();
    ctx.drawImage(
      player.player,
      player.x - player.radius,
      player.y - player.radius
    );

    ctx.fillStyle = player.color;
    ctx.font = "15px DungGeunMo";
    ctx.textAlign = "center";
    ctx.fillText(player.nick, player.x, player.y - player.radius - 10);

    ctx.closePath();
  }

  if (myplayer.blinkNum > 0) {
    // reduce the blink time
    myplayer.blinkTime--;

    if (myplayer.blinkTime == 0) {
      myplayer.blinkTime = Math.ceil(PER_SEC * FPS);
      myplayer.blinkNum--;
    }
  }

  // 기절중이 아닐때에만 플레이어가 움직이도록 설정
  if (!myplayer.stunning) {
    // player thrusting. 플레이어의 가속력을 구현하는 파트라 생각하면 편합니다.
    if (upPressed) {
      // 위쪽 방향키
      myplayer.direction = 2;
      // 를 누른채로 좌 or 우를 입력시
      if (rightPressed) {
        myplayer.direction = 7;
        myplayer.x += PLAYERSPEED;
      } else if (leftPressed) {
        myplayer.direction = 5;
        myplayer.x -= PLAYERSPEED;
      }

      myplayer.player.src = myplayer.asset[myplayer.direction];
      myplayer.y -= PLAYERSPEED;
      sendData(myplayer, myplayer.direction);
    }

    if (downPressed) {
      myplayer.direction = 0;

      if (rightPressed) {
        myplayer.direction = 6;
        myplayer.x += PLAYERSPEED;
      } else if (leftPressed) {
        myplayer.direction = 4;
        myplayer.x -= PLAYERSPEED;
      }

      myplayer.player.src = myplayer.asset[myplayer.direction];
      myplayer.y += PLAYERSPEED;
      sendData(myplayer, myplayer.direction);
    }

    if (leftPressed) {
      myplayer.direction = 1;

      if (upPressed) {
        myplayer.direction = 5;
        myplayer.y -= PLAYERSPEED;
      } else if (downPressed) {
        myplayer.direction = 4;
        myplayer.y += PLAYERSPEED;
      }

      myplayer.player.src = myplayer.asset[myplayer.direction];
      myplayer.x -= PLAYERSPEED;
      sendData(myplayer, myplayer.direction);
    }

    if (rightPressed) {
      myplayer.direction = 3;

      if (upPressed) {
        myplayer.direction = 7;
        myplayer.y -= PLAYERSPEED;
      } else if (downPressed) {
        myplayer.direction = 6;
        myplayer.y += PLAYERSPEED;
      }

      myplayer.player.src = myplayer.asset[myplayer.direction];
      myplayer.x += PLAYERSPEED;
      sendData(myplayer, myplayer.direction);
    }
  }

  // handle use item. 아이템 사용을 구현합니다.
  if (itemPressed) {
    if (myplayer.itemPocket == 1) {
      itemBox.effect();
    }

    myplayer.itemPocket = 0;
  }

  // handle edge of screen // 플레이어가 화면 밖으로 벗어나지 몬하도록
  if (myplayer.x < 0) {
    myplayer.x = 0;
  } else if (myplayer.x > WIDTH) {
    myplayer.x = WIDTH;
  }

  if (myplayer.y < 0) {
    myplayer.y = 0;
  } else if (myplayer.y > HEIGHT) {
    myplayer.y = HEIGHT;
  }

  // 플레이어의 점수가 0 미만으로 떨어지면
  if (myplayer.score < 0) {
    myplayer.score = 0;
  }
}

function sendData(curPlayer, direction) {
  let data = {};
  data = {
    id: curPlayer.id,
    x: curPlayer.x,
    y: curPlayer.y,
    direction: direction,
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
  player.y = y;
  player.direction = direction;
  player.player.src = player.asset[player.direction];
}

socket.on("update_state", function (data) {
  updateState(data.id, data.x, data.y, data.direction);
});

function race_player(id, nick) {
  this.id = id;
  this.nick = nick;
  this.direction;
  this.asset = [
    // 플레이어로써 출력 될 이미지.
    // 이미지는 총 8개 (회사원 이미지로 대체 예정)
    "https://cdn.discordapp.com/attachments/980090904394219562/1010125156905132062/nothrust_roc_down.png", // down
    "https://cdn.discordapp.com/attachments/980090904394219562/1010125157253251122/nothrust_roc_left.png", // left
    "https://cdn.discordapp.com/attachments/980090904394219562/1010125159811780698/nothrust_roc_up.png", // up
    "https://cdn.discordapp.com/attachments/980090904394219562/1010125158326992936/nothrust_roc_right.png", // right
    "https://cdn.discordapp.com/attachments/980090904394219562/1010125157597192302/nothrust_roc_leftdown.png", // leftdown
    "https://cdn.discordapp.com/attachments/980090904394219562/1010125157957914634/nothrust_roc_leftup.png", // leftup
    "https://cdn.discordapp.com/attachments/980090904394219562/1010125158779998239/nothrust_roc_rightdown.png", // rightdown
    "https://cdn.discordapp.com/attachments/980090904394219562/1010125159203602492/nothrust_roc_rightup.png", // rightup
  ];

  this.radius = 40; // 반지름
  this.color = "#FF00FF"; // 닉네임 색
  this.x = WIDTH / 2; // x 좌표
  this.y = HEIGHT - this.radius; // y 좌표
  this.player = new Image();
  this.player.src = this.asset[2]; // 플레이어의 현재 이미지. 방향키를 누를때 바뀐다.
  this.score = 0; // 플레이어의 현재 점수
  this.blinkTime = 0;
  this.blinkNum = 0;

  this.stunTime = 0;
  this.stunNum = 0;

  this.itemImg = new Image();
  this.itemPocket = 0;
}
