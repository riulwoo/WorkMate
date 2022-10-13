function renderPlayer() {
  // rendering a player. 플레이어를 렌더링합니다.
    let direction;
    // 모든 플레이어를 그리는 코드
    for (let i = 0; i < playermap.length; i++) {
          let ball = playermap[i];
          ctx.drawImage(ball.player, ball.x, ball.y);
          ctx.beginPath();
          ctx.fillStyle = ball.color;
          ctx.font = '15px DungGeunMo';
          ctx.fillText(ball.nick ,ball.x+15, ball.y-radius+10);
          ctx.closePath();
    }
    let curPlayer = players[myId];
    // 플레이어 이동 
    if (players[myId].stun_sec <= 0)
    {
      if (rightPressed) {
        direction = 3;
        curPlayer.player.src = curPlayer.asset[direction];
        curPlayer.x += playerSpeed;
        sendData(curPlayer, direction);
      }

    if (leftPressed) {
        direction = 1;
        curPlayer.player.src = curPlayer.asset[direction];
        curPlayer.x -= playerSpeed;
        sendData(curPlayer, direction);
    }

    if (upPressed) {
        direction = 2;
        curPlayer.player.src = curPlayer.asset[direction];
        curPlayer.y -= playerSpeed;
        sendData(curPlayer, direction);
    }
    if (downPressed) {
        direction = 0;
        curPlayer.player.src = curPlayer.asset[direction];
        curPlayer.y += playerSpeed;
        sendData(curPlayer, direction);
    }
    if (keyPressed && !players[myId].delay){
      choose(curPlayer);
      keyPressed = false;
    }
  }
  
    // collision detection of player. 플레이어가 문제 출력 영역으로 이동하지 못하도록 충돌을 감지합니다.
    if (players[myId].y <= 0 + radius)
    {
        players[myId].y = 0 + radius;
    }

    if (players[myId].y > Y - (radius * 2))
    {
        players[myId].y = Y - (radius * 2);
    }

    if (players[myId].x < 0 + radius)
    {
        players[myId].x = 0 + radius;
    }
    else if (players[myId].x > X - (radius * 2))
    {
        players[myId].x = X - (radius * 2);
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

function flip_player(id, nick)
{
  this.id = id;
  // 플레이어 닉네임 설정
  this.nick = nick;
  this.asset = [ // 플레이어 이동 시 출력 될 이미지.
      // 순서대로 정면(방향키 아래), 좌측, 후면(방향키 위), 우측 
      'https://cdn.discordapp.com/attachments/980090904394219562/1004271208226881606/1.png',
      'https://cdn.discordapp.com/attachments/980090904394219562/1004271240271376385/4.png',
      'https://cdn.discordapp.com/attachments/980090904394219562/1004271284735193139/4.png',
      'https://cdn.discordapp.com/attachments/980090904394219562/1004271430722146345/3.png'
  ];
  this.color = "#FF00FF";
  this.x = X / 2;
  this.y = Y / 2;
  this.player = new Image();
  this.player.src = this.asset[0];
  this.score = 0;
  this.first_delay_sec = 0;  // 첫번째 카드가 choose되고 3초 뒤에 다시 원상태 복귀하게 하는 변수 firstpick = false; → first_delay_sec = 180; 
  this.delay = false;        // 2번째카드가 맞춰질때 까지 다른 카드를 못 뒤집게 막는 변수        player.secondcard = card_index; → delay = match_flow 실행 후에 풀리는걸로
  this.stun_sec = 0;
  this.firstpick = true; // true면 사용자가 현재 첫번째 선택을 하고 있다는 뜻.
  this.firstcard; // 사용자가 고른 첫 카드
  this.secondcard; // 사용자가 고른 두번째 카드
  // 판정 관련
  this.matched;
}