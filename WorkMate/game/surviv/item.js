function Item(x, y, xv, yv) {
  this.radius = 27.5;
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

  this.image = new Image();
  this.image.src =
    "https://cdn.discordapp.com/attachments/980090904394219562/1025853760267890758/673a781ab5dc57b6.png";
}

function renderItem()
{
  // rendering a Item. 장애물을 화면에 출력합니다.

  ctx.beginPath();
  ctx.drawImage(
    itemBox.image,
    itemBox.x - itemBox.radius,
    itemBox.y - itemBox.radius,
    55,
    55
  ); // 크기는 55, 55

  ctx.closePath();

}

function moveItem()
{
  // item will move in field.

  itemBox.x += itemBox.xv;
  itemBox.y += itemBox.yv;

  // handle edge of screen.
  if (itemBox.x < 0 - itemBox.radius) {
    itemBox.x = WIDTH + itemBox.radius;
  }
  else if (itemBox.x > WIDTH + itemBox.radius) {
    itemBox.x = 0 - itemBox.radius;
  }

  if (itemBox.y < 0 - itemBox.radius) {
    itemBox.y = HEIGHT + itemBox.radius;
  }
  else if (itemBox.y > HEIGHT + itemBox.radius) {
    itemBox.y = 0 - itemBox.radius;
  }
}
