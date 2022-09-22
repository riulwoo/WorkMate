let canvas = document.getElementById("card_canvas");
let ctx = canvas.getContext('2d');
let myfont = new FontFace('DungGeunMo', 'url(assets/fonts/DungGeunMo.otf)');

myfont.load().then(function(font){
    document.fonts.add(font);
    console.log('font loaded.');
});

// 게임의 프레임은 60fps.
const FPS = 60;
// 화면 크기
// 캔버스의 크기 속성값을 클라이언트의 화면 크기와 같게 바꿔줌
canvas.width = document.body.clientWidth;
canvas.height = Math.ceil(document.body.clientHeight);
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
// 플레이어 관련
var radius = 16;
var playerSpeed = 5;
// 플레이어 이동 관련
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
// 그려질 카드
var card_asset = new Image();
card_asset.src = 'https://cdn.discordapp.com/attachments/980090904394219562/1017440775522492477/card_back.png';
var firstX = (WIDTH/2 - 450) + 10;
var firstY = (HEIGHT/2 - 450) + 10;
var card_margin = 10;
var card_width = 168;
var card_height = 168;
var deck = [];

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e){
    if (e.code == 'ArrowRight'){
        rightPressed = true;
    }
    if (e.code == 'ArrowLeft'){
        leftPressed = true;
    }
    if(e.code == "ArrowDown"){
        downPressed = true;
    }
    if(e.code == "ArrowUp"){
        upPressed = true;
    }
}

function keyUpHandler(e){
    if (e.code == "ArrowRight"){
        rightPressed = false;
    }
    if (e.code == "ArrowLeft"){
        leftPressed = false;
    }
    if(e.code == "ArrowDown"){
        downPressed = false;
    }
    if(e.code == "ArrowUp"){
        upPressed = false;
    }
}

function updateState(id,x,y,direction){
    let ball = players[id];
    if(!ball){
        return;
    }
    ball.x = x;
    ball.y = y;
    ball.currentImage.src = ball.asset[direction];
} socket.on('update_state', function(data){
    updateState(data.id, data.x, data.y, data.direction);
})

function sendData(curPlayer, direction) {
    let data = {};
    data = {
        id : curPlayer.id,
        x: curPlayer.x,
        y: curPlayer.y,
        direction : direction
    };
    if(data){
        socket.emit("send_location", data);
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
    var aCard;
    var bCard;
    var cx = firstX;
    var cy = firstY;

    for (var j = 1; j <= 2; j++)
    {
        for (i = 1; i <= 5; i++)
        {
            aCard = new Card(cx, cy, i + (j - 1) * 5);
            deck.push(aCard);
            bCard = new Card(cx, cy + card_height + card_margin, i + (j - 1) * 5);
            deck.push(bCard);
            cx = cx + card_width + card_margin;
        }

        cx = firstX;
        cy = cy + card_height * 2 + card_margin * 2;
    }

    for (i = 1; i <= 5; i++)
    {
        aCard = new Card(cx, cy, 11);
        deck.push(aCard);
        cx = cx + card_width + card_margin;
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

function field_draw()
{
    ctx.beginPath();
    ctx.fillStyle = "orange";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.lineJoin = "round";
    ctx.lineWidth = 20;

    ctx.strokeStyle = "#CFA31A";
    ctx.fillStyle = "#CFA31A";

    ctx.strokeRect((WIDTH/2 - 450), (HEIGHT/2 - 450), 900, 900);
    ctx.fillRect((WIDTH/2 - 450), (HEIGHT/2 - 450), 900, 900);
    ctx.closePath();
}

/*function renderPlayer()
{
    let direction;
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(player_1.player, player_1.x, player_1.y);
    ctx.beginPath();
    ctx.fillStyle = player_1.color;
    ctx.font = '15px DungGeunMo';
    ctx.textAlign = "center";
    // ctx.fillText(player_1.nick, player_1.x - 10, player_1.y - radius + 10);
    ctx.fillText("x : " + player_1.x + ", y : " + player_1.y, player_1.x, player_1.y - radius + 10);
    ctx.closePath();

    // let curPlayer = ballMap[myId];
      
    if (rightPressed){
      direction = 3;
      player_1.player.src = player_1.asset[direction];
      player_1.x += playerSpeed;
    // curPlayer.player.src = curPlayer.asset[direction];
    // curPlayer.x += playerSpeed;
    // sendData(curPlayer, direction);
    }
    else if (leftPressed){
      direction = 1;
      player_1.player.src = player_1.asset[direction];
      player_1.x -= playerSpeed;
    // curPlayer.player.src = curPlayer.asset[direction];
    // curPlayer.x -= playerSpeed;
    // sendData(curPlayer, direction);
    }

    if(upPressed){
      direction = 2;
      player_1.player.src = player_1.asset[direction];
      player_1.y -= playerSpeed;
    // curPlayer.player.src = curPlayer.asset[direction];
    // curPlayer.y -= playerSpeed;
    // sendData(curPlayer, direction);
    }
    else if(downPressed){
      direction = 0;
      player_1.player.src = player_1.asset[direction];
      player_1.y += playerSpeed;
    // curPlayer.player.src = curPlayer.asset[direction];
    // curPlayer.y += playerSpeed;
    // sendData(curPlayer, direction);
    }

    // collision detection of player. 플레이어가 문제 출력 영역으로 이동하지 못하도록 충돌을 감지합니다.
    if (player_1.y < 0)
    {
        player_1.y = 0;
    }
    else if (player_1.y > 900)
    {
        player_1.y = 900;
    }
    
    if (player_1.x < 500)
    {
        player_1.x = 500;
    }
    else if (player_1.x > 1390)
    {
        player_1.x = 1390;
    }
}*/



function update()
{
    field_draw();
    draw_Deck();
    renderPlayer();
}

make_Deck();
console.log(deck.info);
setInterval(update, 1000 / FPS);