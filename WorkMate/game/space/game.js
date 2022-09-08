let canvas = document.getElementById("space_canvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

let ctx = canvas.getContext('2d');
let myFont = new FontFace('DungGeunMo', 'url(assets/fonts/DungGeunMo.otf)');

myFont.load().then(function(font){
    document.fonts.add(font);
    console.log('font loaded.');
});

// 게임의 프레임은 60fps.
const FPS = 60;
const MAP = new Image();
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
// 플레이어 관련
const PLAYERSPEED = 6; // 플레이어 이동 속도
const FRICTION = 0.7; // 마찰력. 이 마찰력에 의해 방향키 입력을 떼었을 때 속도가 서서히 줄어든다.
let direction; // 플레이어의 이미지 index를 저장.
const STUN = new Image();
// 플레이어 피격 관련
const PLAYER_EXPLODE_DUR = 0.4; // 플레이어의 특수 장애물 피격시 폭발 지속시간
const PLAYER_STUN_DUR = 1; // 플레이어의 장애물 피격시 기절 지속시간
const PLAYER_BLINK_DUR = 2.5; // 플레이어 부활시 깜박임(무적) 지속시간
const PER_SEC = 0.1;
var explode_1 = 20;
var explode_2 = 13;
var explode_3 = 7;
var explode_4 = 3;
// 장애물 관련
const ROIDS_NUM = 7; // starting number of Asteroids
const ROIDS_SIZE = 90; // starting size of Asteroids in pixels
// const ROIDS_JAG = 0.3; // jaggedness of the asteroids (0 = none, 1 = lots)
// const ROIDS_SPD = 50; // max starting speed of Asteroids in pixels per second.
// const ROIDS_VERT = 10; // average number of vertices on each Asteroid
const ROIDS_OF_ITEM_NUM = 5;
// 골인지점 관련
const GOAL_TURN_SPEED = 360; // 골인지점 스프라이트를 초당 360도씩 회전시킴.
const SHOW_BOUNDING = true; // 이 상수가 true면 피격 판정이 항시로 켜져있음.
var size_switch = true; // true면 골인 지점의 크기가 증가, false면 크기가 감소.
// 이동 관련
// 방향키를 눌렀는지 체크하는 변수
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
// 아이템 상자
var itemCode;
var itemBox;
var item_asset = ['https://cdn.discordapp.com/attachments/980090904394219562/1012619683339436042/item_asteroid.png',
                'https://cdn.discordapp.com/attachments/980090904394219562/1012619683825995826/item_stun.png'
                ];
var itemPressed = false;
// 게임 흐름 관련
const COUNT_DUR_TIME = 3;
const LETS_GO = 1;
const ITEM_REGEN_TIME = 6;
var count_time = Math.ceil(PER_SEC * FPS);
var count_num = Math.ceil(COUNT_DUR_TIME / PER_SEC);
var lego_time = Math.ceil(PER_SEC * FPS);
var lego_num = Math.ceil(LETS_GO / PER_SEC);
var item_gen_time = Math.ceil(PER_SEC * FPS);
var item_gen_num = Math.ceil(ITEM_REGEN_TIME / PER_SEC);
var is_counting;
var gogogogo;
var is_gaming;
var is_item_existing;

// set up player.
var player_1 = new player("penson", 1);

// set up asteroids
var roids = [];
createAsteroidBelt();

// set up goal
var goal = new newGoal();

// set up Image asset
MAP.src = 'https://cdn.discordapp.com/attachments/980090904394219562/1010147980902400080/space.png';
STUN.src = 'https://cdn.discordapp.com/attachments/980090904394219562/1014033430075428944/player_stun_2.png';

// set up asteroids.
var roids_of_item = [];

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

    if(e.code == "ControlLeft"){
        itemPressed = true;
    }
}

function keyUpHandler(e){
    if (e.code == "ArrowRight") {
        rightPressed = false;
        player_1.thrusting = false;
    }
    if (e.code == "ArrowLeft") {
        leftPressed = false;
        player_1.thrusting = false;
    }
    if (e.code == "ArrowDown") {
        downPressed = false;
        player_1.thrusting = false;
    }
    if (e.code == "ArrowUp") {
        upPressed = false;
        player_1.thrusting = false;
    }

    if(e.code == "ControlLeft"){
        itemPressed = false;
    }
}

// function newAsteroid(x, y)
// {
//     var roid = {
//         x: x,
//         y: y,
//         xv: Math.random() * ROIDS_SPD / FPS * (Math.random() < 0.5 ? 1 : -1),
//         yv: Math.random() * ROIDS_SPD / FPS * (Math.random() < 0.5 ? 1 : -1),
//         r: ROIDS_SIZE / 2,
//         a: Math.random() * Math.PI * 2, // in radians
//         vert: Math.floor(Math.random() * (ROIDS_VERT + 1) + ROIDS_VERT / 2),
//         offs: []
//     };

//     // create the vertex offsets array
//     for (var i = 0; i < roid.vert; i++) {
//         roid.offs.push(Math.random() * ROIDS_JAG * 2 + 1 - ROIDS_JAG);
//     }

//     return roid;
// }

// calculate length in pixel between player and other objects.
// 플레이어와 다른 오브젝트(장애물, 아이템상자, 골인지점)간의 거리를 계산하는 메서드
function distBetweenPoints(x1, y1, x2, y2)
{
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function explodePlayer() // 플레이어가 특수 장애물에 피격 당하면 폭발하는 메서드.
{
    player_1.explodeTime = Math.ceil(PLAYER_EXPLODE_DUR * FPS);
}

function stunPlayer() // 플레이어가 일반 장애물에 피격당하면 기절하는 메서드.
{
    player_1.stunTime = Math.ceil(PER_SEC * FPS);
    player_1.stunNum = Math.ceil(PLAYER_STUN_DUR / PER_SEC);
}

function createAsteroidBelt() // 장애물 배열을 만드는 메서드
{
    roids = [];

    var x, y;
    for (var i = 0; i < ROIDS_NUM; i++)
    {
        do {
            x = Math.floor(Math.random() * WIDTH);
            y = Math.floor(Math.random() * HEIGHT);
        } while (distBetweenPoints(player_1.x, player_1.y, x, y) < ROIDS_SIZE * 2 + player_1.radius);

        roids.push(new newAsteroid(x, y));
    }
}

function createRoidOfItemBelt() // 특수 장애물 배열을 만드는 메서드. 아이템을 먹었을 때만 실행된다.
{
    var x, y;

    for (var i = 0; i < ROIDS_OF_ITEM_NUM; i++)
    {
        do {
            x = Math.floor(Math.random() * WIDTH);
            y = Math.floor(Math.random() * HEIGHT);
        } while (distBetweenPoints(player_1.x, player_1.y, x, y) < ROIDS_SIZE * 2 + player_1.radius);

        roids_of_item.push(new newAsteroid_of_item(x, y, player_1.num));
    }
}

// 맵 그리는 메서드
function field_draw()
{
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    // ctx.drawImage(MAP, 0, 0);
    ctx.closePath();
}

    

function update()
{
    var blinkOn = player_1.blinkNum % 2 == 0; // 플레이어가 부활 시 blinkOn = true
    var exploding = player_1.explodeTime > 0; // 플레이어가 특수 장애물에 피격시 exploding = true.
    var stunning = player_1.stunNum > 0; // 플레이어가 장애물에 피격시 stunning = true.

    is_counting = count_num > 0;
    is_item_existing = item_gen_num <= 0; // 아이템 리젠 시간이 다 되면 true가 된다. 아이템이 존재하고 있다는 뜻.

    field_draw();

    // 게임 시작 전 카운트 다운 출력
    if (is_counting)
    {
        ctx.fillStyle = "#3561F1";
        ctx.font = '200px DungGeunMo';
        ctx.textAlign = "center";
        ctx.fillText(Math.ceil(count_num / 10), WIDTH / 2, HEIGHT / 2);
        
        // handle countdown
        if (count_num > 0)
        {
            // reduce the count time
            count_time--;

            // reduce the count num
            if (count_time == 0)
            {
                count_time = Math.ceil(PER_SEC * FPS);
                count_num--;
            }
        }

        if (count_num <= 0)
        {
            is_gaming = true;
        }
    }
    // rendering a player. 플레이어를 렌더링합니다.
    if (!exploding)
    {
        if (blinkOn)
        {
            ctx.beginPath();
            ctx.drawImage(player_1.player, player_1.x - player_1.radius, player_1.y - player_1.radius);
        
            ctx.fillStyle = player_1.color;
            ctx.font = '18px DungGeunMo';
            ctx.textAlign = "center";
            ctx.fillText(player_1.nick, player_1.x, player_1.y - player_1.radius - 10);
        
            ctx.closePath();
        }

        if (player_1.blinkNum > 0)
        {
            // reduce the blink time
            player_1.blinkTime--;

            if (player_1.blinkTime == 0)
            {
                player_1.blinkTime = Math.ceil(PER_SEC * FPS);
                player_1.blinkNum--;
            }
        }
    }
    else
    {
        // draw the explosion. 폭발 이펙트를 그립니다.
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(player_1.x, player_1.y, explode_1 /*player_1.radius * 1.5*/, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(player_1.x, player_1.y, explode_2 /*player_1.radius * 1*/, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(player_1.x, player_1.y, explode_3 /*player_1.radius * 0.5*/, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(player_1.x, player_1.y, explode_4 /*player_1.radius * 0.25*/, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
    }
    
    if (is_gaming) // 카운트가 끝나고 게임이 진행.
    {
        // GO!!
        gogogogo = lego_num > 0;

        if (gogogogo)
        {
            ctx.fillStyle = "#3561F1";
            ctx.font = "200px DungGeunMo";
            ctx.textAlign = "center";
            ctx.fillText("GO!!", WIDTH / 2, HEIGHT / 2);

            // handle text
            if (lego_num > 0)
            {
                lego_time--;

                if (lego_time == 0)
                {
                    lego_time = Math.ceil(PER_SEC * FPS);
                    lego_num--;
                }
            }
        }

        // draw collision of player. 플레이어의 피격판정을 그립니다.
        if (SHOW_BOUNDING) {
            ctx.beginPath();
            ctx.strokeStyle = "lime";
            ctx.lineWidth = 3;
            ctx.arc(player_1.x, player_1.y, player_1.radius - 13, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();
        }

        // player thrusting. 플레이어의 가속력을 구현하는 파트라 생각하면 편합니다.
        if (upPressed) { // 위쪽 방향키
            direction = 2;
            player_1.thrusting = true;

            // 를 누른채로 좌 or 우를 입력시
            if (rightPressed) {
                direction = 7;
                // player_1.x += playerSpeed;
            }
            else if (leftPressed) {
                direction = 5;
                // player_1.x -= playerSpeed;
            }

            // player_1.y -= PLAYERSPEED;
            player_1.thrust.y -= PLAYERSPEED * Math.sin(90 / 180 * Math.PI) / FPS;
            player_1.thrust.y *= 0.99;
        }

        if (downPressed) {
            direction = 0;
            player_1.thrusting = true;

            if (rightPressed) {
                direction = 6;
                // player_1.x += playerSpeed;
            }
            else if (leftPressed) {
                direction = 4;
                // player_1.x -= playerSpeed;
            }

            // player_1.y += PLAYERSPEED;
            player_1.thrust.y -= PLAYERSPEED * Math.sin(270 / 180 * Math.PI) / FPS;
            player_1.thrust.y *= 0.99;
        }

        if (leftPressed) {
            direction = 1;
            player_1.thrusting = true;

            if (upPressed) {
                direction = 5;
                // player_1.y -= playerSpeed;
            }
            else if (downPressed) {
                direction = 4;
                // player_1.y += playerSpeed;
            }

            // player_1.x -= PLAYERSPEED;
            player_1.thrust.x += PLAYERSPEED * Math.cos(180 / 180 * Math.PI) / FPS;
            player_1.thrust.x *= 0.99;
        }

        if (rightPressed) {
            direction = 3;
            player_1.thrusting = true;

            if (upPressed) {
                direction = 7;
                // player_1.y -= playerSpeed;
            }
            else if (downPressed) {
                direction = 6;
                // player_1.y += playerSpeed;
            }

            // player_1.x += PLAYERSPEED;
            player_1.thrust.x += PLAYERSPEED * Math.cos(360 / 180 * Math.PI) / FPS;
            player_1.thrust.x *= 0.99;
        }

        // thrusting 할때랑 안할때랑 이미지를 구분해서 출력.
        if (player_1.thrusting) {
            player_1.player.src = player_1.thrustAsset[direction];
        }
        else if (direction >= 0 && !(player_1.thrusting)) {
            player_1.player.src = player_1.asset[direction];

            // 방향키 입력중이 아닐 때, 플레이어의 속도를 지속적으로 감소시킴.
            player_1.thrust.x -= FRICTION * player_1.thrust.x / FPS;
            player_1.thrust.y -= FRICTION * player_1.thrust.y / FPS;
        }

        // handle use item. 아이템 사용을 구현합니다.
        if (itemPressed)
        {
            if (player_1.itemPocket == 1)
            {
                createRoidOfItemBelt();
            }

            player_1.itemPocket = 0;
        }

        // draw item in itemPocket. 현재 소유한 아이템을 그립니다.
        if (player_1.itemPocket == 1)
        {
            ctx.beginPath();
            ctx.drawImage(player_1.itemImg, 25, 85);
            ctx.closePath();
        }

        // draw a Asteroids. 장애물을 그립니다.
        var x, y, radius, a, vert, offs;
        for (var i = 0; i < roids.length; i++) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;

            // get the asteroid properties
            x = roids[i].x;
            y = roids[i].y;
            radius = roids[i].radius;
            a = roids[i].a;
            vert = roids[i].vert;
            offs = roids[i].offs;

            // draw a path
            ctx.beginPath();
            ctx.moveTo(
                x + radius * offs[0] * Math.cos(a),
                y + radius * offs[0] * Math.sin(a)
            );

            // draw the polygon
            for (var j = 1; j <= vert; j++) {
                ctx.lineTo(
                    x + radius * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
                    y + radius * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)
                );
            }
            ctx.closePath();
            ctx.stroke();

            if (SHOW_BOUNDING) {
                ctx.beginPath();
                ctx.strokeStyle = "lime";
                ctx.lineWidth = 3;
                ctx.arc(roids[i].x, roids[i].y, roids[i].radius, Math.PI * 2, false);
                ctx.stroke();
                ctx.closePath();
            }
        }

        // move asteroids. 장애물을 움직입니다.
        for (var i = 0; i < roids.length; i++) {
            roids[i].x += roids[i].xv;
            roids[i].y += roids[i].yv;

            // handle edge of screen
            if (roids[i].x < 0 - roids[i].radius) {
                roids[i].x = WIDTH + roids[i].radius;
            }
            else if (roids[i].x > WIDTH + roids[i].radius) {
                roids[i].x = 0 - roids[i].radius;
            }

            if (roids[i].y < 0 - roids[i].radius) {
                roids[i].y = HEIGHT + roids[i].radius;
            }
            else if (roids[i].y > HEIGHT + roids[i].radius) {
                roids[i].y = 0 - roids[i].radius;
            }
        }
        
        // handle item gen count. 아이템을 일정 주기로 리젠시킵니다.
        if (item_gen_num > 0)
        {
            item_gen_time--;

            if (item_gen_time == 0)
            {
                item_gen_time = Math.ceil(PER_SEC * FPS);
                item_gen_num--;
            }
        }

        if (item_gen_num == 0)
        {
            itemCode = 1; // Math.floor(Math.random * (3 - 1) + 1);
            itemBox = new newItem(itemCode);

            item_gen_num = -1; // item_gen_num이 계속 0으로 유지되어 버리면.... 아이템이 계속 생성이 되어버림......
        }
        
        // draw item box. 아이템 박스를 그립니다.
        if (is_item_existing)
        {
            ctx.beginPath();
            ctx.fillStyle = "#DC9C34";
            ctx.strokeStyle = "#FFE062";
            ctx.lineWidth = 5;
            // ctx.fillRect(itemBox.x - itemBox.radius, itemBox.y - itemBox.radius, itemBox.radius * 2, itemBox.radius * 2);
            // ctx.strokeRect(itemBox.x - itemBox.radius, itemBox.y - itemBox.radius, itemBox.radius * 2, itemBox.radius * 2);
            ctx.fillRect(itemBox.x - itemBox.radius, itemBox.y - itemBox.radius, itemBox.radius * 2, itemBox.radius * 2);
            ctx.strokeRect(itemBox.x - itemBox.radius, itemBox.y - itemBox.radius, itemBox.radius * 2, itemBox.radius * 2);
            ctx.closePath();

            // 아이템 박스의 피격범위를 그립니다.
            if (SHOW_BOUNDING) {
                ctx.beginPath();
                ctx.strokeStyle = "lime";
                ctx.lineWidth = 3;
                ctx.arc(itemBox.x, itemBox.y, itemBox.radius, Math.PI * 2, false);
                ctx.stroke();
                ctx.closePath();
            }
        }

        // draw a goal. 골인지점을 그립니다.
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 5;
        // ctx.fillRect(goal.x - goal.radius, goal.y - goal.radius, goal.radius * 2, goal.radius * 2);
        // ctx.strokeRect(goal.x - goal.radius, goal.y - goal.radius, goal.radius * 2, goal.radius * 2);
        ctx.fillRect(goal.x - goal.radius, goal.y - goal.radius, goal.radius * 2, goal.radius * 2);
        ctx.strokeRect(goal.x - goal.radius, goal.y - goal.radius, goal.radius * 2, goal.radius * 2);
        ctx.closePath();

        // 골인지점의 피격범위를 그립니다.
        if (SHOW_BOUNDING) {
            ctx.beginPath();
            ctx.strokeStyle = "lime";
            ctx.lineWidth = 3;
            ctx.arc(goal.x, goal.y, goal.radius, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();
        }

        // 골인 지점의 크기를 프레임이 진행되면서 들쭉날쭉하게 바꿉니다.
        // 1. 반지름 크기가 특정 값에 이를 때, switch 변수를 바꿔줍니다.
        if (goal.radius <= 13) {
            size_switch = true;
        }
        else if (goal.radius >= 25) {
            size_switch = false;
        }

        // 2. switch 변수의 상태에 따라 골인지점의 반지름 값을 들쭉날쭉하게 바꿔줍니다.
        if (size_switch) {
            goal.radius++;
        }
        else {
            goal.radius--;
        }

        // draw a Asteroids of item. 특수 장애물을 그립니다.
        var x, y, radius, a, vert, offs;
        for (var i = 0; i < roids_of_item.length; i++) {
            ctx.strokeStyle = "#3561F1";
            ctx.lineWidth = 2;

            // get the asteroid properties
            x = roids_of_item[i].x;
            y = roids_of_item[i].y;
            radius = roids_of_item[i].radius;
            a = roids_of_item[i].a;
            vert = roids_of_item[i].vert;
            offs = roids_of_item[i].offs;

            // draw a path
            ctx.beginPath();
            ctx.moveTo(
                x + radius * offs[0] * Math.cos(a),
                y + radius * offs[0] * Math.sin(a)
            );

            // draw the polygon
            for (var j = 1; j <= vert; j++) {
                ctx.lineTo(
                    x + radius * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
                    y + radius * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)
                );
            }
            ctx.closePath();
            ctx.stroke();

            if (SHOW_BOUNDING) {
                ctx.beginPath();
                ctx.strokeStyle = "lime";
                ctx.lineWidth = 3;
                ctx.arc(roids_of_item[i].x, roids_of_item[i].y, roids_of_item[i].radius, Math.PI * 2, false);
                ctx.stroke();
                ctx.closePath();
            }
        }

        // move asteroids. 특수 장애물을 움직입니다.
        for (var i = 0; i < roids_of_item.length; i++) {
            roids_of_item[i].x += roids_of_item[i].xv;
            roids_of_item[i].y += roids_of_item[i].yv;

            // handle edge of screen
            if (roids_of_item[i].x < 0 - roids_of_item[i].radius) {
                roids_of_item[i].x = WIDTH + roids_of_item[i].radius;
            }
            else if (roids_of_item[i].x > WIDTH + roids_of_item[i].radius) {
                roids_of_item[i].x = 0 - roids_of_item[i].radius;
            }

            if (roids_of_item[i].y < 0 - roids_of_item[i].radius) {
                roids_of_item[i].y = HEIGHT + roids_of_item[i].radius;
            }
            else if (roids_of_item[i].y > HEIGHT + roids_of_item[i].radius) {
                roids_of_item[i].y = 0 - roids_of_item[i].radius;
            }
        }

        // check for asteroids of item collisions. 플레이어가 특수 장애물에 피격당하는지 검사
        if (!exploding) {
            if (player_1.blinkNum == 0) {
                for (var i = 0; i < roids_of_item.length; i++) {
                    if (distBetweenPoints(player_1.x, player_1.y, roids_of_item[i].x, roids_of_item[i].y) < roids_of_item[i].radius + (player_1.radius - 13)) {
                        explodePlayer();
                    }
                }
            }
        }
        else // 플레이어가 피격당해 폭발하게 됨
        {
            player_1.explodeTime--; // 폭발 타이머가 줄어들기 시작하고
            // 프레임이 진행되며 폭발의 크기도 점점 커짐
            explode_1 += 1.5;
            explode_2 += 1.5;
            explode_3 += 1.5;
            explode_4 += 1.5;

            if (player_1.explodeTime == 0) {
                // 타이머가 0이 되면 플레이어가 무적 상태로 돌입하도록 변수의 값을 변경해주고
                player_1.blinkTime = Math.ceil(PER_SEC * FPS);
                player_1.blinkNum = Math.ceil(PLAYER_BLINK_DUR / PER_SEC);
                player_1.score -= 3;

                // 좌표값도 변경해줍니다.
                player_1.x = 1200 / 2;
                player_1.y = 800 - player_1.radius;

                // 폭발 크기도 원래대로 변경.
                explode_1 = 20;
                explode_2 = 13;
                explode_3 = 7;
                explode_4 = 3;
            }
        }

        // check for asteroids collisions. 플레이어가 장애물에 피격당하는지 검사
        if (!stunning) {
            if (player_1.blinkNum == 0 && player_1.stunNum == 0) {
                for (var i = 0; i < roids.length; i++) {
                    if (distBetweenPoints(player_1.x, player_1.y, roids[i].x, roids[i].y) < roids[i].radius + (player_1.radius - 13)) {
                        stunPlayer();
                    }
                }
            }   
        }
        else // 플레이어가 피격당해 기절하게 됨
        {
            ctx.fillStyle = "red";
            ctx.font = '120px DungGeunMo';
            ctx.textAlign = "center";
            ctx.fillText("stuned!!", WIDTH / 2, HEIGHT / 2 - 160);
            ctx.drawImage(STUN, player_1.x - player_1.radius, player_1.y - player_1.radius - 35);

            player_1.stunTime--; // 기절 타이머가 줄어들기 시작하고

            if (player_1.stunTime == 0)
            {
                player_1.stunTime = Math.ceil(PER_SEC * FPS);
                player_1.stunNum--;
            }

            if (player_1.stunNum == 0) {
                // 타이머가 0이 되면 플레이어가 무적 상태로 돌입하도록 변수의 값을 변경해주고
                player_1.blinkTime = Math.ceil(PER_SEC * FPS);
                player_1.blinkNum = Math.ceil(PLAYER_BLINK_DUR / PER_SEC);
                player_1.score--;
            }
        }

        // check for goal. 플레이어가 골인 지점에 닿았는지 검사.
        if (distBetweenPoints(player_1.x, player_1.y, goal.x, goal.y) < goal.radius + (player_1.radius - 13)) {
            goal.blink();

            player_1.score++;
        }

        // 폭발중, 기절중이 아닐때에만 플레이어가 움직이도록 설정
        if (!exploding && !stunning)
        {
            // move a player. 플레이어를 이동시킵니다.
            // 피격 중이 아닌 상황에만 플레이어가 움직입니다.
            player_1.x += player_1.thrust.x;
            player_1.y += player_1.thrust.y;
        }

        // 아이템 박스가 맵 상에 존재하고 있을 때 플레이어가 아이템을 획득하는지 검사.
        if (is_item_existing)
        {
            if (distBetweenPoints(player_1.x, player_1.y, itemBox.x, itemBox.y) < itemBox.radius + (player_1.radius - 13))
            {
                if (itemBox.type == 1)
                {
                    player_1.itemPocket = itemBox.type;
                }

                player_1.itemImg.src = item_asset[player_1.itemPocket-1];
                item_gen_time = Math.ceil(PER_SEC * FPS);
                item_gen_num = Math.ceil(ITEM_REGEN_TIME / PER_SEC);
            }
        }

        // turn the goal sprite. 골인 지점을 회전시킵니다 (그냥 놔두면 너무 정적이라 디자인이 시시하잔아 ㅎ)
        // goal.a += goal.rot;

        // handle edge of screen // 플레이어가 화면 밖으로 벗어나지 몬하도록
        if (player_1.x < 0) {
            player_1.x = 0;
        }
        else if (player_1.x > WIDTH) {
            player_1.x = WIDTH;
        }

        if (player_1.y < 0) {
            player_1.y = 0;
        }
        else if (player_1.y > HEIGHT) {
            player_1.y = HEIGHT;
        }

        // 플레이어의 점수가 0 미만으로 떨어지면
        if (player_1.score < 0)
        {
            player_1.score = 0;
        }

        
    } // end of if (is_gaming)

    // draw player score. 플레이어의 점수를 표시
    ctx.font = '30px DungGeunMo';
    ctx.textAlign = 'left';
    ctx.fillStyle = "white";
    ctx.fillText('score : ' + player_1.score, 10, 30);
    console.log("is_item_existing : " + is_item_existing);
    console.log("player_1.itemPocket : " + player_1.itemPocket);
    
    ctx.beginPath();
    ctx.font = '30px DungGeunMo';
    ctx.textAlign = 'left';
    ctx.fillStyle = "white";
    ctx.fillText('ITEM', 25, 60);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.strokeRect(10, 70, 100, 100);
    ctx.closePath();
}

setInterval(update, 1000 / FPS);