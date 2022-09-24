function renderPlayer() {
    // rendering a player. 플레이어를 렌더링합니다.
    let direction;
    // 모든 플레이어를 그리는 코드
    for (let i = 0; i < playermap.length; i++) {
        let ball = playermap[i];
        ctx.drawImage(ball.currentImage, ball.x, ball.y);
        ctx.beginPath();
        ctx.fillStyle = ball.color;
        ctx.font = '15px Arial';
        ctx.textAlign = 'left';
        // ctx.fillText(ball.nick, ball.x + 15, ball.y - radius + 10);
        ctx.fillText(ball.x, ball.x + 15, ball.y - radius + 10);
        ctx.closePath();
    }
    let curPlayer = players[myId];
    // 플레이어 이동 
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

    // collision detection of player. 플레이어가 문제 출력 영역으로 이동하지 못하도록 충돌을 감지합니다.
    // 게임 해상도가 변경될 시 조건 값 수정해줄 것
    if (players[myId].y < 0 + radius)
    {
        players[myId].y = 0 + radius;
    }
    else if (players[myId].y > 900)
    {
        players[myId].y = 900;
    }
    
    if (players[myId].x < 500)
    {
        players[myId].x = 500;
    }
    else if (players[myId].x > 1390)
    {
        players[myId].x = 1390;
    }
}

/*function player(nick)
{
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
}*/