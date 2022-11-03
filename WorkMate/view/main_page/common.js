var socket = io();

/* 3개 게임에서 공통적으로 사용하는 변수 및 함수는 이곳에 정의한다. */

/** 사용할 폰트*/
let myfont = new FontFace("DungGeunMo", "url(../game_asset/DungGeunMo.otf)");

myfont.load().then(function (font) {
  document.fonts.add(font);
});

/** 게임 canvas의 Width와 Height */
let X;
let Y;

/** 플레이어 닉네임 색깔 배열*/
// 빨 주 초 파 보 핑
let colorNick = [
  "rgb(237, 28, 36)",
  "rgb(255, 127, 39)",
  "rgb(34, 177, 76)",
  "rgb(63, 72, 204)",
  "rgb(163, 73, 164)",
  "rgb(255, 106, 200)"
]

/** card, surviv에서 사용하는 게임의 프레임 */
const FPS = 60;

/** 캐릭터가 움직이는 동작을 감지하는 boolean형 변수 */
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

/** 게임 도중에 플레이어가 나가고, 플레이어의 동작을 지속적으로 갱신하는 메서드
  socket.on도 공통적인 부분인 것 같아서 작성함.
*/
function leaveUser(id) {
  for (var i = 0; i < playermap.length; i++) {
    if (playermap[i].id == id) {
      playermap.splice(i, 1);
      break;
    }
  }
  delete players[id];
}
socket.on("leave_user", function (data) {
  leaveUser(data);
});
function updateState(id, x, y, direction, ismove, cnt) {
  let ball = players[id];
  if (!ball) {
    return;
  }
  ball.x = x;
  ball.y = y;
  ball.direction = direction;
  ball.ismove = ismove;
  ball.cnt = cnt;
  ball.player.src = ball.ismove ? moveeffect(ball) : ball.asset[ball.direction];
}
socket.on("update_state", function (data) {
  updateState(data.id, data.x, data.y, data.direction, data.ismove, data.cnt);
});

function sendData(curPlayer) {
  let data = {};
  data = {
    id: curPlayer.id,
    x: curPlayer.x,
    y: curPlayer.y,
    direction: curPlayer.direction,
    ismove: curPlayer.ismove,
    cnt: curPlayer.cnt,
  };
  if (data) {
    socket.emit("send_location", data);
  }
}

/** flip, surv에서 카운트다운에 쓰이는 변수. */
const COUNT_DUR_TIME = 3;
var count_sec;

// 플레이어와 다른 오브젝트(장애물, 아이템상자, 골인지점)간의 거리를 계산하는 메서드
function distBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
