function Item(x, y, xv, yv) {
  this.radius = 27.5;
  this.x = x;
  this.y = y;
  this.xv = xv;
  this.yv = yv;
  this.type = Math.floor(Math.random() * (3 - 1) + 1);

  // item type
  // 1 : 특수 장애물 생성
  // 2 : 먹으면 기절
  // 3 : 아무 효과 X

  this.image = new Image();
  this.image.src =
    "https://cdn.discordapp.com/attachments/980090904394219562/1025853760267890758/673a781ab5dc57b6.png";
}

function Itemeffect(type) {
  if (type == 0) {
    /** 특수 장애물 생성 */
    socket.emit("특수장애물이래요", {
      id: myId,
      type: Math.floor(Math.random() * 1), // 0 - 중앙 생성 1 - 양쪽 생성
    });
  } else if (type == 1) {
    /** 기절 */
    players[myId].stunsec = Math.ceil(PLAYER_STUN_DUR * FPS); // 기절 효과 넣어주면 됨
  } else if (type == 2) {
    /** 아무 효과 X */
  }
}

function renderItem() {
  // 포켓 부분 추가해야함

  if (itemBox != null) {
    // rendering a Item. 장애물을 화면에 출력합니다.
    surv_ctx.beginPath();
    surv_ctx.drawImage(
      itemBox.image,
      itemBox.x - itemBox.radius,
      itemBox.y - itemBox.radius,
      55,
      55
    ); // 크기는 55, 55

    surv_ctx.closePath();

    // item will move in field.

    itemBox.x += itemBox.xv;
    itemBox.y += itemBox.yv;

    // handle edge of screen.
    if (itemBox.x < 0 - itemBox.radius) {
      itemBox.x = WIDTH + itemBox.radius;
    } else if (itemBox.x > WIDTH + itemBox.radius) {
      itemBox.x = 0 - itemBox.radius;
    }

    if (itemBox.y < 0 - itemBox.radius) {
      itemBox.y = HEIGHT + itemBox.radius;
    } else if (itemBox.y > HEIGHT + itemBox.radius) {
      itemBox.y = 0 - itemBox.radius;
    }
  }
}

/* function moveItem()
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
} */

/** 아이템 상자와 플레이어가 닿음을 감지하는 메서드 */
function distItem() {
  if (itemBox != null) {
    let px = players[myId].x;
    let py = players[myId].y;
    let ix = itemBox.x + itemBox.radius;
    let iy = itemBox.y + itemBox.radius;

    if (
      distBetweenPoints(px, py, ix, iy) <
      itemBox.radius + players[myId].radius
    ) {
      players[myId].hasItem = true;
      //players[myId].itemPocket = itemBox.type;
      players[myId].itemPocket = 0;

      socket.emit("아이템 먹었대요", myId);
    }
  }
}
