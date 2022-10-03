function renderPlayer() {
    let direction;
    //console.log(playermap);
    for (let i = 0; i < playermap.length; i++) {
        let player = playermap[i];
        // rendering a player. 플레이어를 렌더링합니다.
        if (!player.exploding)
        {
            if (player.blinkOn)
            {
                ctx.beginPath();
                ctx.drawImage(player.player, player.x - player.radius, player.y - player.radius);
            
                ctx.fillStyle = player.color;
                ctx.font = '15px DungGeunMo';
                ctx.textAlign = "center";
                ctx.fillText(player.nick, player.x, player.y - player.radius - 10);
            
                ctx.closePath();
            }

            if (player.blinkNum > 0)
            {
                // reduce the blink time
                player.blinkTime--;

                if (player.blinkTime == 0)
                {
                    player.blinkTime = Math.ceil(PER_SEC * FPS);
                    player.blinkNum--;
                }
            }
        }
        else
        {
            // draw the explosion. 폭발 이펙트를 그립니다.
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(player.x, player.y, explode_1 /*player_1.radius * 1.5*/, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle = "orange";
            ctx.beginPath();
            ctx.arc(player.x, player.y, explode_2 /*player_1.radius * 1*/, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle = "yellow";
            ctx.beginPath();
            ctx.arc(player.x, player.y, explode_3 /*player_1.radius * 0.5*/, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(player.x, player.y, explode_4 /*player_1.radius * 0.25*/, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();
        }
    }
    // 폭발중, 기절중이 아닐때에만 플레이어가 움직이도록 설정
    if (!myplayer.exploding && !myplayer.stunning)
    {
        // move a player. 플레이어를 이동시킵니다.
        // 피격 중이 아닌 상황에만 플레이어가 움직입니다.
        // player thrusting. 플레이어의 가속력을 구현하는 파트라 생각하면 편합니다.
        if (upPressed) { // 위쪽 방향키
            direction = 2;
            myplayer.thrusting = true;
            // 를 누른채로 좌 or 우를 입력시
            if (rightPressed) {
                direction = 7;
                //myplayer.x += playerSpeed;
            }
            else if (leftPressed) {
                direction = 5;
                //myplayer.x -= playerSpeed;
            }

            // player_1.y -= PLAYERSPEED;
            myplayer.thrust.y -= PLAYERSPEED * Math.sin(90 / 180 * Math.PI) / FPS;
            myplayer.thrust.y *= 0.99;
            myplayer.y += myplayer.thrust.y;
            sendData(myplayer, direction);
        }

        if (downPressed) {
            direction = 0;
            myplayer.thrusting = true;

            if (rightPressed) {
                direction = 6;
                // myplayer.x += playerSpeed;
            }
            else if (leftPressed) {
                direction = 4;
                //myplayer.x -= playerSpeed;
            }

            // myplayer.y += PLAYERSPEED;
            myplayer.thrust.y -= PLAYERSPEED * Math.sin(270 / 180 * Math.PI) / FPS;
            myplayer.thrust.y *= 0.99;
            myplayer.y += myplayer.thrust.y;
            sendData(myplayer, direction);
        }

        if (leftPressed) {
            direction = 1;
            myplayer.thrusting = true;

            if (upPressed) {
                direction = 5;
                //myplayer.y -= playerSpeed;
            }
            else if (downPressed) {
                direction = 4;
                //myplayer.y += playerSpeed;
            }

            //myplayer.x -= PLAYERSPEED;
            myplayer.thrust.x += PLAYERSPEED * Math.cos(180 / 180 * Math.PI) / FPS;
            myplayer.thrust.x *= 0.99;
            myplayer.x += myplayer.thrust.x;
            sendData(myplayer, direction);
        }

        if (rightPressed) {
            direction = 3;
            myplayer.thrusting = true;

            if (upPressed) {
                direction = 7;
                //myplayer.y -= playerSpeed;
            }
            else if (downPressed) {
                direction = 6;
                //myplayer.y += playerSpeed;
            }

            // player_1.x += PLAYERSPEED;
            myplayer.thrust.x += PLAYERSPEED * Math.cos(360 / 180 * Math.PI) / FPS;
            myplayer.thrust.x *= 0.99;
            myplayer.x += myplayer.thrust.x;
            sendData(myplayer, direction);
        }
    }
    console.log(`${myplayer.thrusting} : direction ${direction}`);
    // thrusting 할때랑 안할때랑 이미지를 구분해서 출력.
    if (myplayer.thrusting) {
        myplayer.player.src = myplayer.thrustAsset[direction];
    }
    else if (direction != undefined && !(myplayer.thrusting)) {
        myplayer.player.src = myplayer.asset[direction];
    }
    else {
        // 방향키 입력중이 아닐 때, 플레이어의 속도를 지속적으로 감소시킴.
        myplayer.thrust.x -= FRICTION * myplayer.thrust.x / FPS;
        myplayer.thrust.y -= FRICTION * myplayer.thrust.y / FPS;
    }


    // handle use item. 아이템 사용을 구현합니다.
    if (itemPressed)
    {
        if (myplayer.itemPocket == 1)
        {
            createRoidOfItemBelt();
        }

        myplayer.itemPocket = 0;
    }

    // handle edge of screen // 플레이어가 화면 밖으로 벗어나지 몬하도록
    if (myplayer.x < 0) {
        myplayer.x = 0;
    }
    else if (myplayer.x > WIDTH) {
        myplayer.x = WIDTH;
    }

    if (myplayer.y < 0) {
        myplayer.y = 0;
    }
    else if (myplayer.y > HEIGHT) {
        myplayer.y = HEIGHT;
    }

    // 플레이어의 점수가 0 미만으로 떨어지면
    if (myplayer.score < 0)
    {
        myplayer.score = 0;
    }
}

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

function updateState(id, x, y, direction) {
    let player = players[id];
    if (!player) {
        return;
    }
    player.x = x;
    player.y = y;
    player.player.src = player.asset[direction];
}

socket.on('update_state', function (data) {
    updateState(data.id, data.x, data.y, data.direction);
})

function race_player(id, nick)
{
    this.id = id;
    this.nick = nick;

    this.asset = [ // 플레이어로써 출력 될 이미지.
        // 이미지는 총 8개 (우주선의 8방향)
        'https://cdn.discordapp.com/attachments/980090904394219562/1010125156905132062/nothrust_roc_down.png', // down
        'https://cdn.discordapp.com/attachments/980090904394219562/1010125157253251122/nothrust_roc_left.png', // left
        'https://cdn.discordapp.com/attachments/980090904394219562/1010125159811780698/nothrust_roc_up.png', // up
        'https://cdn.discordapp.com/attachments/980090904394219562/1010125158326992936/nothrust_roc_right.png', // right
        'https://cdn.discordapp.com/attachments/980090904394219562/1010125157597192302/nothrust_roc_leftdown.png', // leftdown
        'https://cdn.discordapp.com/attachments/980090904394219562/1010125157957914634/nothrust_roc_leftup.png', // leftup
        'https://cdn.discordapp.com/attachments/980090904394219562/1010125158779998239/nothrust_roc_rightdown.png', // rightdown
        'https://cdn.discordapp.com/attachments/980090904394219562/1010125159203602492/nothrust_roc_rightup.png' // rightup
    ];

    this.thrustAsset = [ // 플레이어가 방향키를 눌렀을 때 출력 될 이미지.
        // 이미지는 총 8개 (우주선의 8방향)
        'https://cdn.discordapp.com/attachments/980090904394219562/1011166810898448425/roc_down.png', // down
        'https://cdn.discordapp.com/attachments/980090904394219562/1011166811351420968/roc_left.png', // left
        'https://cdn.discordapp.com/attachments/980090904394219562/1011166813691850784/roc_up.png', // up
        'https://cdn.discordapp.com/attachments/980090904394219562/1011166812471316590/roc_right.png', // right
        'https://cdn.discordapp.com/attachments/980090904394219562/1011166811691171860/roc_leftdown.png', // leftdown
        'https://cdn.discordapp.com/attachments/980090904394219562/1011166812056068106/roc_leftup.png', // leftup
        'https://cdn.discordapp.com/attachments/980090904394219562/1011166812873949254/roc_rightdown.png', // rightdown
        'https://cdn.discordapp.com/attachments/980090904394219562/1011166813284995123/roc_rightup.png' // rightup
    ];

    this.radius = 40; // 반지름
    this.color = "#FF00FF"; // 닉네임 색
    this.x = WIDTH / 2; // x 좌표
    this.y = HEIGHT - this.radius; // y 좌표
    // 플레이어가 방향키를 누르고 있을 때 x좌표가 이만큼, y좌표가 이만큼 움직인다는 뜻을 변수로 표현.
    this.thrusting = false;
    this.thrust = {
        x : 0,
        y : 0
    }
    this.player = new Image();
    this.player.src = this.asset[2]; // 플레이어의 현재 이미지. 방향키를 누를때 바뀐다.
    this.score = 0; // 플레이어의 현재 점수
    this.explodeTime = 0; // 플레이어 폭발 시간. 플레이어가 장애물에 피격당했을 때 변수에 값이 대입된다.
    this.blinkTime = 0;
    this.blinkNum = 0;

    this.stunTime = 0;
    this.stunNum = 0;

    this.itemImg = new Image();
    this.itemPocket = 0;

    this.blinkOn = this.blinkNum % 2 == 0; // 플레이어가 부활 시 blinkOn = true
    this.exploding = this.explodeTime > 0; // 플레이어가 특수 장애물에 피격시 exploding = true.
    this.stunning = this.stunNum > 0; // 플레이어가 장애물에 피격시 stunning = true.
}