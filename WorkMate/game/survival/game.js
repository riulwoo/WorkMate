let surv_canvas = document.getElementById("surviv_canvas");
let surv_ctx = surv_canvas.getContext("2d");
let myFont = new FontFace("DungGeunMo", "url(survival/assets/DungGeunMo.otf)");
surv_canvas.width = document.body.clientWidth;
surv_canvas.height = document.body.clientHeight;

myFont.load().then(function (font) {
  document.fonts.add(font);
  //console.log('font loaded.');
});
// 게임의 프레임은 60fps.
const FPS = 60;
const WIDTH = surv_canvas.width;
const HEIGHT = surv_canvas.height;
// 플레이어 관련
const PLAYERSPEED = 6; // 플레이어 이동 속도
// 플레이어 피격 관련
const PLAYER_STUN_DUR = 1; // 플레이어의 장애물 피격시 기절 지속시간
const PLAYER_BLINK_DUR = 2.5; // 플레이어 부활시 깜박임(무적) 지속시간
const PER_SEC = 0.1;
// 장애물 관련
// 골인지점 관련
const SHOW_BOUNDING = true; // 이 상수가 true면 피격 판정이 항시로 켜져있음.
// 이동 관련
// 방향키를 눌렀는지 체크하는 변수
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

var itemPressed = false;
// 게임 흐름 관련
const COUNT_DUR_TIME = 3;
var count_sec = Math.ceil(COUNT_DUR_TIME * FPS);
var is_counting = true;
var is_gaming = false;
var is_end = false;

function func_lding() {
  return new Promise((r1, r2) => {
    for (let i = 0; i < playerinfo.length; i++) {
      let player = new surviv_player(playerinfo[i].id, playerinfo[i].nick);
      playermap[i] = player;
      players[playerinfo[i].id] = player;
    }
    document.body.style.backgroundImage =
      "url('https://media.discordapp.net/attachments/980090904394219562/1021798469670813770/9a0b0a0d08d21b21.gif?width=1316&height=636')";
    setTimeout(() => {
      socket.emit("레이스쥰비완료쓰", myId);
      r1();
    }, 3000);
  });
}

func_lding().then(() => {
  document.body.style.backgroundImage =
    "url('https://media.discordapp.net/attachments/980090904394219562/1020072426308112394/unknown.png')";
  setInterval(update, 1000 / FPS);
});

socket.on("게임수타투", (data) => {
  is_counting = true;
  console.log("골 초기 좌표 : " + data.goal[0].x + " "+ data.goal[1].y);
  console.log(`아이템 초기 좌표 : x: ${data.item.x} y : ${data.item.y} xv : ${data.item.xv} yv : ${data.item.yv}`);
  
  for (let i = 0; i < data.goal.length; i++) {
    goal.push(new Goal(data.goal[i].x, data.goal[i].y));
  }
  itemBox = new Item(data.item.x, data.item.y, data.item.xv, data.item.yv);  // 화면 넘어가면 반대편에 등장
});

socket.on("아이템생성하거라", (data) => {    // 생성은 되지만 그리기는 되지 않았음
  console.log("아이템 좌표 : " + data);
  itemBox = new Item(data.x, data.y, data.xv, data.yv);
});

socket.on("돈을 생성하거라", (data) => {    // 생성은 되지만 그리기는 되지 않았음
  console.log(`돈 좌표 + ${data}`)
  for (let i = 0; i < data.length; i++) {
    goal.push(new Goal(data[i].x, data[i].y));
  }
});

socket.on("장애물 생성하거라", (data) => {    // 생성은 되지만 그리기는 되지 않았음
    roids.push(new Asteroid(data.x, data.y, data.xv, data.yv, data.type));
});

socket.on("특수 장애물 생성하거라", (data) => {
  roids_of_item.push(new ItemAsteroid(data.x, data.y, data.xv, data.yv, id));
});

socket.on("살아남기 게임끝", ()=>{
  is_end = true;
  is_gaming = false;
  let index = getMyIndex(myId);
  playerinfo[index].score += players[myId].score;
  setTimeout(()=>{socket.emit('gameover', myId);}, 3000);
});

// let myplayer = players[myId];

// 게임이 종료가 되면 playerinfo[index].score += myplayer.score;

// 장애물 생성 배열 : 서버에서 일정한 시간 간격으로 좌표 전달
var roids = [];

// 돈(골인지점) 생성 배열 : 돈은 2개씩 생성 2개 중 2개가 다 없어져야 다시 생성
var goal = [];

// 아이템 효과로 생성된 장애물 생성 배열 : 장애물 생성 종류는 2가지 (화면 양쪽, 중앙), 장애물 갯수는 큰사이즈 2개씩
var roids_of_item = [];

// 아이템 상자 : 개수 (1개), 아이템 먹는 순간 서버에서 체크 후 30초 뒤 다시 생성, 효과 (1. 특수장애물, 2. 기절, 3. 아무 효과 X)
var itemBox;
var item_asset = new Image();
item_asset.src = 'https://cdn.discordapp.com/attachments/980090904394219562/1020591795580706816/item_boxxx_2.png';

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

/** 키를 눌렀을 때 실행되는 메서드 */
function keyDownHandler(e){
    if (e.keyCode == 68){ // 'ArrowRight'
        rightPressed = true;
    }
    if (e.keyCode == 65){ // 'ArrowLeft'
        leftPressed = true;
    }
    if (e.keyCode == 83){ // "ArrowDown"
        downPressed = true;
    }
    if (e.keyCode == 87){ // "ArrowUp"
        upPressed = true;
    }
    if (e.keyCode == 74){
        itemPressed = true;
    }
}

/** 키를 뗐을 때 실행되는 메서드 */
function keyUpHandler(e){
    if (e.keyCode == 68){ // 'ArrowRight'
        rightPressed = false;
    }
    if (e.keyCode == 65){ // 'ArrowLeft'
        leftPressed = false;
    }
    if (e.keyCode == 83){ // "ArrowDown"
        downPressed = false;
    }
    if (e.keyCode == 87){ // "ArrowUp"
        upPressed = false;
    }
    if (e.keyCode == 74){
        itemPressed = false;
    }
}

// 플레이어와 다른 오브젝트(장애물, 아이템상자, 골인지점)간의 거리를 계산하는 메서드
function distBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// 맵 그리는 메서드
function field_draw() {
  surv_canvas.width = document.body.clientWidth;
  surv_canvas.height = document.body.clientHeight;
  surv_ctx.beginPath();
  surv_ctx.fillStyle = "black";
  surv_ctx.fillRect(0, 0, WIDTH, HEIGHT);
  // surv_ctx.drawImage(MAP, 0, 0);
  surv_ctx.closePath();
}

function end_draw(){
  if(is_end)
  {
    surv_ctx.fillStyle = "#90DBA2";
    surv_ctx.font = '200px DungGeunMo';
    surv_ctx.textAlign = "center";
    surv_ctx.fillText("GAME OVER", WIDTH / 2, HEIGHT / 2);
  }
}

function count_draw()
{
  surv_ctx.fillStyle = "#90DBA2";
  surv_ctx.font = '200px DungGeunMo';
  surv_ctx.textAlign = "center";
  surv_ctx.fillText(Math.ceil(count_sec / 60), WIDTH / 2, HEIGHT / 2);
}

/** 게임 스코어와 아이템 보유 현황을 그리는 메서드 */
function score_draw() {
    surv_ctx.beginPath();
    surv_ctx.fillStyle = "black";
    surv_ctx.font = "55px DungGeunMo";
    surv_ctx.textAlign = "center";
    surv_ctx.fillText(
      "score : " + players[myId].score,
      (WIDTH * 10) / 100,
      (HEIGHT * 7) / 100
    );

    surv_ctx.font = '30px DungGeunMo';
    surv_ctx.textAlign = 'left';
    surv_ctx.fillStyle = "white";
    surv_ctx.fillText('ITEM',
                 (WIDTH * 5) / 100,
                 (HEIGHT * 3) / 100
                );

    if (players[myId].itemPocket != 0)
    {
      surv_ctx.drawImage(
                  item_asset,
                  (WIDTH * 7.2) / 100,
                  (HEIGHT * 5.2) / 100,
                );
    }
  
    surv_ctx.strokeStyle = "white";
    surv_ctx.lineWidth = 5;
    surv_ctx.strokeRect(
                    (WIDTH * 7) / 100,
                    (HEIGHT * 5) / 100,
                    80,
                    80
                  );
  
    surv_ctx.closePath();
}

/** 플레이어가 기절에 걸렸을 때, 지속시간이 감소되도록 하는 메서드. */
function stunAndBlink_flow()
{
	if (players[myId].stunsec > 0)	
  {
    surv_ctx.fillStyle = "red";
    surv_ctx.font = '120px DungGeunMo';
    surv_ctx.textAlign = "center";
    surv_ctx.fillText("stuned!!", WIDTH / 2, HEIGHT / 2 - 160);
    players[myId].stunsec--;
  }
  else if (players[myId].stunsec == 0)
  {
    players[myId].blinksec = Math.ceil(PLAYER_BLINK_DUR * FPS);
    players[myId].stunsec = -1;
  }

  if (players[myId].blinksec > 0)
  {
    players[myId].blinksec--;
  }
}

function update() {
  field_draw();    // 바닥
  // edge_draw();     // 벽
  score_draw();
  if(is_counting)
  {
    count_sec--;
    
    count_draw();
        
    // handle countdown
    if (count_sec == 0)
    {
      is_counting = false;
      is_gaming = true;
    }
  }
  if(is_gaming)
  {
    renderItem();    // 아이템
    distItem();
    // moveItem();      // 아이템이 지속적으로 이동
    renderGoal();    // 돈
    distGoal();
    renderObs();     // 장애
    // moveObs();       // 장애물이 지속적으로 이동
    distObs();
    renderSpecObs();
    distSpecObs();
    renderPlayer();  // 플레이어
    
    stunAndBlink_flow();
  }
  end_draw();
}

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
