function ItemAsteroid(x, y, xv, yv, id) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.xv = xv;
  this.yv = yv;
  this.radius = 25;
  this.image = new Image();
  // 커피
  this.image.src =
    "https://cdn.discordapp.com/attachments/980090904394219562/1025853759902990366/3ebfc342f3bcb6ca.png";
}

// 아이템은 움직이기 때문에 화면 밖으로 나가면 반대편에서 다시 나오게 설정
