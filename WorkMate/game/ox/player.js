function renderPlayer() {
  // rendering a player. 플레이어를 렌더링합니다.
    ctx.clearRect(0, 0, X, Y / 4);
    let direction;
    // 모든 플레이어를 그리는 코드
    for (let i = 0; i < playermap.length; i++) {
          let ball = playermap[i];
          ctx.drawImage(ball.currentImage, ball.x, ball.y);
          ctx.beginPath();
          ctx.fillStyle = ball.color;
          ctx.font = '15px DungGeunMo';
          ctx.fillText(ball.nick ,ball.x+15, ball.y-radius+10);
          ctx.closePath();
    }
    let curPlayer = players[myId];
      // 플레이어 이동 
    if (!is_checking)
    {
        if (rightPressed) {
            direction = 3;
            curPlayer.currentImage.src = curPlayer.asset[direction];
            curPlayer.x += playerSpeed;
            sendData(curPlayer, direction);
        }
          
        else if (leftPressed) {
            direction = 1;
            curPlayer.currentImage.src = curPlayer.asset[direction];
            curPlayer.x -= playerSpeed;
            sendData(curPlayer, direction);
        }

        if (upPressed) {
            direction = 2;
            curPlayer.currentImage.src = curPlayer.asset[direction];
            curPlayer.y -= playerSpeed;
            sendData(curPlayer, direction);
        }
        else if (downPressed) {
            direction = 0;
            curPlayer.currentImage.src = curPlayer.asset[direction];
            curPlayer.y += playerSpeed;
            sendData(curPlayer, direction);
        }
      }
  
    // collision detection of player. 플레이어가 문제 출력 영역으로 이동하지 못하도록 충돌을 감지합니다.
    if (players[myId].y <= 200)
    {
        players[myId].y = 200;
    }

    if (players[myId].y > Y - (radius * 2))
    {
        players[myId].y = Y - (radius * 2);
    }

    if (players[myId].x < 0)
    {
        players[myId].x = 0;
    }
    else if (players[myId].x > X - (radius * 2))
    {
        players[myId].x = X - (radius * 2);
    }

    if (players[myId].x < X / 2)
    {
        players[myId].is_O = true;
    }
    else if (players[myId].x >= X / 2)
    {
        players[myId].is_O = false;
    }
}

function sendData(curPlayer, direction) {
    let data = {};
    data = {
        id : curPlayer.id,
        x: curPlayer.x,
        y: curPlayer.y,
        direction : direction
    };
    if(data){
        socket.emit("send_location", data);
    }
}

function ox_player(id, nick)
{
    this.id = id;
    // 플레이어 닉네임 설정
    if (nick == null)
    {
        this.nick = "player " + Math.floor(Math.random() * 100);
    }
    else
    {
        this.nick = nick;
    }

    this.asset = [ // 플레이어 이동 시 출력 될 이미지.
        // 순서대로 정면(방향키 아래), 좌측, 후면(방향키 위), 우측 
        'https://cdn.discordapp.com/attachments/980090904394219562/1004271208226881606/1.png',
        'https://cdn.discordapp.com/attachments/980090904394219562/1004271240271376385/4.png',
        'https://cdn.discordapp.com/attachments/980090904394219562/1004271284735193139/4.png',
        'https://cdn.discordapp.com/attachments/980090904394219562/1004271430722146345/3.png'
    ];

    this.color = "#FF00FF";
    this.x = WIDTH / 2;
    this.y = HEIGHT / 2;
    this.player = new Image();
    this.player.src = this.asset[0];
    this.score = 0;

    // 판정 관련
    this.is_O;
}