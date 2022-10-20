function Item(x, y, xv, yv) {
  this.radius = 20;
  this.x = x;
  this.y = y;
  this.xv = xv;
  this.yv = yv;
  this.type = Math.floor(Math.random() * 3);

  this.effect = () => {
    if (this.type == 0) {
      /** 특수 장애물 생성 */
      socket.emit("특수 장애물 생성해줘", myId);
    } else if (this.type == 1) {
      /** 기절 */
      myplayer.stunning = true;    // 기절 효과 넣어주면 됨
    } else if (this.type == 2) {
      /** 아무 효과 X */
    }
  };
  // item type
  // 1 : 특수 장애물 생성
  // 2 : 먹으면 기절
  // 3 : 아무 효과 X
}
