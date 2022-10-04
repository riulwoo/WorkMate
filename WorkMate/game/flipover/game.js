let canvas = document.getElementById("flip_canvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
let ctx = canvas.getContext('2d');
let myfont = new FontFace('DungGeunMo', 'url(ox/assets/fonts/DungGeunMo.otf)');

myfont.load().then(function(font){
    document.fonts.add(font);
});

// 게임의 프레임은 60fps.
const FPS = 60;
// 크기 변수
let X = canvas.width;
let Y = canvas.height;
// 플레이어 관련
var radius = 16;
var playerSpeed = 4;
// 플레이어 이동 관련
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
var card_margin = 10;
var card_width = (X * 7.5) / 100;
var card_height = (Y * 13) / 100;
var firstX = (X * 10) / 100;
var firstY = (Y * 15) / 100;
var deck = [];
// 게임 흐름 관련
const CHECK_DUR_TIME = 1.5;
const PER_SEC = 0.1;
var check_time = Math.ceil(PER_SEC * FPS);
var check_num = Math.ceil(CHECK_DUR_TIME / PER_SEC);
// Game Flow 관련
var is_loading; 

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

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
// 카드를 세차례 섞는 함수
function shuffle()
{
    var i;
    var k;
    var holder;
    var dl = deck.length;

    for (var j = 0; j < dl * 3; j++)
    {
        i = Math.floor(Math.random() * dl);
        k = Math.floor(Math.random() * dl);

        holder = deck[k].info;
        deck[k].info = deck[i].info;
        deck[i].info = holder;
    }
}

// 카드를 그리는 함수
function make_Deck()
{
    var i;
    var j;
    var aCard;
    var cx = firstX;
    var cy = firstY;

    for (i = 1; i <= 5; i++)
    {
        for (j = 1; j <= 10; j++)
        {
            if (j > 8)
            {
                aCard = new Card(cx, cy, 6);
                deck.push(aCard);
            }
            else
            {
                aCard = new Card(cx, cy, i);
                deck.push(aCard);
            }
            cx = cx + card_width + card_margin;
        }

        cy = cy + card_height + card_margin;
        cx = firstX;
    }

    shuffle();
}

function draw_Deck()
{
    for (var i = 0; i < deck.length; i++)
    {
        deck[i].draw();
    }
}

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

// 카드를 선택하는 메서드
function choose(player)
{
    var px;
    var py;

    px = player.x;
    py = player.y;

    for (i = 0; i < deck.length; i++)
    {
        var card = deck[i];

        if (card.x >= 0)
        {
            if ((px >= card.x) && (px <= card.x + card_width) && (py >= card.y) && (py <= card.y + card_height))
            {
                if ((player.firstpick) || (i != player.firstcard))
                {
                    break;
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
    }
}

function field_draw(){
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    X = canvas.width;
    Y = canvas.height;

    ctx.beginPath();
    ctx.fillStyle = "#7092BE";
    ctx.fillRect(0, 0, X, Y);
    ctx.closePath();
}

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
      socket.emit('쥰비완료쓰', (myId));
        r1();
    }, 3000);
  })
}

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

function update()
{
    field_draw();
    draw_Deck();

    renderPlayer();

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