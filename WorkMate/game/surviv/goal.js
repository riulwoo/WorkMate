function Goal(id, x, y) {
  // 서버랑 같이
  this.radius = 13;
  this.id = id;
  this.x = x;
  this.y = y;
  this.image = new Image();
  this.image.src =
    "https://cdn.discordapp.com/attachments/980090904394219562/1025853774016811058/293546e0e809970.png";

  // 돈 먹으면 서버에 먹었다고 보내고 서버는 이 돈의 고유번호를 보내서 모든 플레이어 화면에서 해당 id의 돈을 삭제
  this.blink = () => {};
}

function renderGoal()
{
  for (let i = 0; i < goal.length; i++) {
    let G = goal[i];
    // rendering a money. 골인지점을 렌더링합니다.

    ctx.beginPath();
    ctx.drawImage(
      G.image,
      G.x - G.radius,
      G.y - G.radius,
      40,
      40
    );

    ctx.closePath();
  }
}