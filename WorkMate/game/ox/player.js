function renderPlayer() {
  // rendering a player. 플레이어를 렌더링합니다.
    let direction;

    // 모든 플레이어를 그리는 코드
    for (let i = 0; i < players.length; i++) {
          let ball = players[i];
          console.log(ball);
          ctx.drawImage(ball.currentImage, ball.x, ball.y);
          console.log(ball.currentImage);
          ctx.beginPath();
          ctx.fillStyle = ball.color;
          ctx.font = '15px Arial';
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

    if (players[myId].x < 585)
    {
        players[myId].is_O = true;
    }
    else if (players[myId].x >= 585)
    {
        players[myId].is_O = false;
    }
}
