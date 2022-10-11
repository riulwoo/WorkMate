let canvas = document.getElementById("flip_canvas");
let ctx = canvas.getContext('2d');
let myfont = new FontFace('DungGeunMo', 'url(ox/assets/fonts/DungGeunMo.otf)');

myfont.load().then(function(font){
    document.fonts.add(font);
});

// 게임의 프레임은 60fps.
const FPS = 60;
// 화면 크기
// 캔버스의 크기 속성값을 클라이언트의 화면 크기와 같게 바꿔줌
canvas.width = document.body.clientWidth;
canvas.height = Math.ceil(document.body.clientHeight);
// X와 Y는 캔버스의 width와 height를 저장하는데 사용.
let X = canvas.width;
let Y = canvas.height;
// 플레이어 관련
const PLAYER_STUN_TIME = 1.5; // 플레이어가 폭탄을 맞으면 1.5초간 기절에 걸린다. 그 기절 시간을 상수에 저장해줌
var radius = 16;
var playerSpeed = (X * 0.3) / 100;

// 플레이어 이동
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
// 그려질 카드
var card_asset_index =[
    "https://cdn.discordapp.com/attachments/980090904394219562/1026178038003662969/card_back.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026201806897938573/card_coffee.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026201836232913006/card_laptop.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026745172316389446/card_files_2.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026745172001820722/card_print_2.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026203173796446339/card_money.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026201898967126097/card_boom.png",
    "https://cdn.discordapp.com/attachments/980090904394219562/1026370795670347816/card_matched.png" ];
var card_margin = (X * 0.25) / 100; // 카드와 카드 사이의 간격
var card_width = (X * 7.5) / 100; // 카드의 가로 길이
var card_height = (Y * 13) / 100; // 카드의 세로 길이
var firstX = (X * 10) / 100; // 카드가 처음 그려질 x 좌표
var firstY = (Y * 15) / 100; // 카드가 처음 그려질 y 좌표
var deck = []; // 카드가 들어갈 배열

// 게임 흐름 관련
const CHECK_DUR_TIME = 0.5;
/*
    CHECK_DUR_TIME :
    카드가 두장이 뒤집혔을 시 0.5초 동안 멈춘 채 맞는지 틀린지 확인할 때
    0.5초를 세기 위해 선언한 상수이다.

    근데 모르겠다 이걸 구현할 수 있을까
*/
const PER_SEC = 0.1;
var check_tick = Math.ceil(PER_SEC * FPS);
/*
    tick = Math.ceil(0.1 * FPS); // 0.1 * 60 = 6

    update는 setInterval()에 의해 1000 / 60. 즉 16.66666666666667ms에 한번씩 실행된다.

    그래서 tick은 16.666666.. ms 마다 한번씩 줄어든다.
    6번 줄어드는데 총 100ms가 걸리며 이건 0.1초를 의미
*/
var check_sec = Math.ceil(CHECK_DUR_TIME / PER_SEC);
/*
    sec = Math.ceil(설정한 시간 * 0.1);  ex) 15초 * 0.1 = 150
    ex) check_sec = Math.ceil(CHECK_DUR_TIME / PER_SEC);

    sec는 tick이 0이 되면 1씩 줄어든다.

    즉 0.1초 마다 1씩 줄어들고, sec가 10이 줄어들려면 1초가 걸린다.

    즉 sec이 10이면 1초를 뜻하는 것이고, 150이면 15초, 300이면 30초가 걸리게 된다.
*/

// Game Flow 관련
var is_loading; 

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
}

/** 게임 맵을 그리는 메서드 */
function field_draw(){
    // canvas.width = document.body.clientWidth;
    // canvas.height = document.body.clientHeight;

    ctx.beginPath();
    ctx.fillStyle = "#7092BE";
    ctx.fillRect(0, 0, X, Y);
    ctx.closePath();
}

/** 게임 시작 전 로딩창을 띄우는 메서드 */
function func_lding()
{
  return new Promise((r1, r2) => {
    document.body.style.backgroundImage =
    "url('https://media.discordapp.net/attachments/980090904394219562/1021799584667803839/GIF_2022-09-21_12-06-13.gif?width=1266&height=636')"; // 나중에 카드 로딩창으로 수정하기.
    for (let i = 0; i < playerinfo.length; i++) {
        let player = new flip_player(playerinfo[i].id, playerinfo[i].nick);
        playermap[i] = player;
        players[playerinfo[i].id] = player;
      }
    setTimeout(()=>{
      socket.emit('뒤집기쥰비완료쓰', (myId));
        r1();
    }, 3000);
  })
}

/** 유저가 떠나는 이벤트 발생 시 실행되는 메서드 */
function leaveUser(id){
    for(var i = 0 ; i < playermap.length; i++){
      if(playermap[i].id == id){
        playermap.splice(i,1);
        break;
      }
    }
    delete players[id];
}
socket.on('leave_user', function(data){
  leaveUser(data);
})

/** 유저 정보가 업데이트 */
function updateState(id, x, y, direction) {
    let ball = players[id];
    if (!ball) {
      return;
    }
    ball.x = x;
    ball.y = y;
    ball.player.src = ball.asset[direction];
}
socket.on('update_state', function (data) {
  updateState(data.id, data.x, data.y, data.direction);
})

socket.on('뒤집기수타투', (data) =>{
  for (let i = 0; i < data.length; i++) {
    
    if(i % 10 == 0)
    {
      make_Deck(firstX, firstY, data[i])
      cy = cy + card_height + card_margin;
      cx = firstX;
    }
    else
    {
      make_Deck(firstX, firstY, data[i])
      cx = cx + card_width + card_margin;
    }
  }
    
})
/** 카드덱을 만드는 함수. 끝에 shuffle 메서드를 실행시켜 덱을 섞어준다. */
function make_Deck(x, y, info)
{
    let card = new Card(x, y, info);
    deck.push(card);
}

/** 카드를 한장씩 화면에 그리는 메서드 */
function draw_Deck()
{
    for (var i = 0; i < deck.length; i++)
    {
        deck[i].draw();
    }
}

/** 플레이어가 기절에 걸렸을 때, 지속시간이 감소되도록 하는 메서드. */
function stun_flow()
{
	if (players[myId].stun_sec > 0)
	{
		players[myId].stun_sec--;
	}
}

/** 플레이어가 두 장의 카드를 뒤집으면 맞는지 틀린지 최종 판별하는 메서드 */
function flip(player)
{
    if (!player.matched)
    {
        deck[player.firstcard].poly = 0;
        deck[player.secondcard].poly = 0;
    }
    else
    {
        deck[player.firstcard].untouchable = 1;
        deck[player.secondcard].untouchable = 1;
        player.score += 1;
    }
}

/** 카드를 선택하는 메서드 */
function choose(player)
{
    var px;
    var py;

    px = player.x;
    py = player.y;

  // 
    for (i = 0; i < deck.length; i++)
    {
        var card = deck[i]; // 반복문을 돌리면서 카드를 한 장씩 변수에 넣는다.

        if (card.x >= 0)
        {
            if ((px >= card.x) && (px <= card.x + card_width) && (py >= card.y) && (py <= card.y + card_height))
            { // 플레이어의 좌표가 카드의 영역 안에 정상적으로 들어가 있고,
                if ((player.firstpick) || (i != player.firstcard))
                { // 플레이어가 첫번째 선택이라면 혹은, 플레이어기 처음에 고른 카드와 다른 카드라면
                    break; // 변수 card에 고른 카드를 저장한 채 반복문을 종료한다.
                }
            }
        }
    }

    if (i < deck.length) // 사용자가 카드를 고름
    {
        if (player.firstpick) {
            player.firstcard = i;
            player.firstpick = false;

            deck[i].poly = 1;
            // deck[i].draw();
        }
        else {
            player.secondcard = i;

            deck[i].poly = 1;
            // deck[i].draw();

            if (deck[i].info == deck[player.firstcard].info) {
                player.matched = true;
            }
            else {
                player.matched = false;
            } 

            player.firstpick = true;
            flip(player);
        }

        if (deck[i].info == 6)
        {
            deck[i].untouchable = true;
            player.firstpick = true;
            player.score -= 3;
            // 플레이어를 기절 상태로 만듬.
            player.stun_sec = Math.ceil(PLAYER_STUN_TIME * FPS);
        }
    }
}

function update()
{ 
    field_draw();
    draw_Deck();
    renderPlayer();
    stun_flow();

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.font = "55px DungGeunMo";
    ctx.textAlign = "center";
    ctx.fillText("score : " + players[myId].score, (X * 10) / 100, (Y * 7) / 100);
    ctx.closePath();
} // end of update


make_Deck();

func_lding().then
( () => {
  document.body.style.backgroundImage = "url('https://media.discordapp.net/attachments/980090904394219562/1020072426308112394/unknown.png')";
  setInterval(update, 1000 / FPS);
} )