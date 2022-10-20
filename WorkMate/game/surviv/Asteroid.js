function Asteroid(x, y, xv, yv) {
  // 서버랑 같이
  this.x = x;
  this.y = y;
  this.xv = xv;
  this.yv = yv;
  this.radius = 45;

  this.image = new Image();
  this.image.src = this.asset[Math.floor(Math.random() * 3)];
  // 이미지 종류 : 복사기, 문서더미, 노트북
  this.asset = [
    "https://cdn.discordapp.com/attachments/980090904394219562/1026420114792386560/60a40c6de0adf37b.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026421335607488572/7.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026201836232913006/card_laptop.png",
  ];
}
