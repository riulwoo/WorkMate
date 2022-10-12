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
    if (keyPressed){
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
    /** 플레이어가 기절했을 때 이 변수의 값들이 초기화됨. */
    /*
    this.stun_tick = 0;
        tick = Math.ceil(0.1 * FPS); // 0.1 * 60 = 6

        update는 setInterval()에 의해 1000 / 60. 즉 16.66666666666667ms에 한번씩 실행된다.

        그래서 tick은 16.666666.. ms 마다 한번씩 줄어든다.
        6번 줄어드는데 총 100ms가 걸리며 이건 0.1초를 의미
    
    this.stun_sec = 0;
        sec = Math.ceil(설정한 시간 / 0.1); // ex) 15초 / 0.1 = 150
        sec는 tick이 0이 되면 1씩 줄어든다.

        즉 0.1초 마다 1씩 줄어들고, sec가 10이 줄어들려면 1초가 걸린다.

        즉 sec이 10이면 1초를 뜻하는 것이고, 150이면 15초, 300이면 30초가 걸리게 된다.
    */

  this.stun_sec = 0;
  /*
    sec = Math.ceil(설정한 시간 * FPS) // ex) 설정한 시간이 3초, FPS가 60이면, 3 * 60 = 180;
  */
    this.firstpick = true; // true면 사용자가 현재 첫번째 선택을 하고 있다는 뜻.
    this.firstcard; // 사용자가 고른 첫 카드
    this.secondcard; // 사용자가 고른 두번째 카드
    // 판정 관련
    this.matched;
}