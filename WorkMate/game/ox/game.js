let canvas = document.getElementById("ox_canvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
let ctx = canvas.getContext('2d');
let myfont = new FontFace('DungGeunMo', 'url(ox/assets/fonts/DungGeunMo.otf)');

myfont.load().then(function(font){
    document.fonts.add(font);
});

let question = ""          // 문제 변수
let answer;                // 답 변수
// 크기 변수
let X = canvas.width;
let Y = canvas.height;
// 캐릭터 관련
let radius = 16;
let playerSpeed = 5;
// 이동 관련
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
// Game Flow 관련
var is_loading; 
var is_during = false; // 문제가 진행중일 때 true.
var is_breaking = false; // 정답을 확인하고 다음 문제가 나오기 전까지 true.
var is_checking = false; // 문제에 대한 정답을 확인할 때.
var is_end = false;

var during_num = 0;
var break_num = 0;
var check_num = 0;

var answer_cnt = false; // 문제를 맞췄을 때 활성화 되어 점수를 올려주는 체크용 변수
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

function field_draw(){
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  console.log('정상적으로 실행중');
  ctx.beginPath();
  ctx.fillStyle = "bisque";
  ctx.fillRect(0, 0, X, Y / 4);
  ctx.fillStyle = "#87AFFD";
  ctx.fillRect(0, Y/4, X/2, Y);
  ctx.fillStyle = "#FE8787";
  ctx.fillRect(X/2, Y/4, X, Y);
  ctx.fillStyle = "white"
  ctx.font = '348px DungGeunMo';
  ctx.textAlign = "center";
  ctx.fillText("O", X / 4, Y/1.4);
  ctx.fillStyle = "white"
  ctx.font = '348px DungGeunMo';
  ctx.textAlign = "center";
  ctx.fillText("X", X - 300, Y/1.4);
  ctx.closePath();
}

function func_lding()
{
  return new Promise((r1, r2) => {
    for (let i = 0; i < playerinfo.length; i++) {
      let player = new ox_player(playerinfo[i].id, playerinfo[i].nick);
      playermap[i] = player;
      players[playerinfo[i].id] = player;
    }
    document.body.style.backgroundImage =
    "url('https://media.discordapp.net/attachments/980090904394219562/1021799584667803839/GIF_2022-09-21_12-06-13.gif?width=1266&height=636')";
    setTimeout(()=>{
      socket.emit('쥰비완료쓰', (myId));
        r1();
    }, 3000);
  })
}

function leaveUser(id){
  for(var i = 0 ; i < players.length; i++){
    if(players[i].id == id){
      players.splice(i,1);
      break;
    }
  }
  delete playermap[id];
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

socket.on('ox_breaking', (data)=>{
  const { break_time, _question } = data;
  is_checking = false;
  is_breaking = true;
  is_during = false;
  console.log(`문제 ${_question}`);
  break_num = break_time;
  question = _question;
})

socket.on('ox_during',(data)=>{
  const { during_time, _answer } = data;
  is_breaking = false;
  is_during = true;
  is_checking = false;
  console.log(`during ${during_time}`);
  during_num = during_time;
  answer = _answer;
})
socket.on('ox_checking', (checking_time)=>{
  is_during = false;
  is_breaking = false;
  is_checking = true;
  console.log(`check`);
  checking_num = checking_time;
})

socket.on('ox_end', ()=>{
  is_breaking = false;
  is_during = false;
  is_checking = false;
  is_end = true;
  let index = getMyIndex(myId);
  playerinfo[index].score += players[myId].score;
  setTimeout(()=>{socket.emit('gameover', myId);}, 3000);
})

function update()
{
    // draw playground. 플레이어가 이동할 필드를 그립니다.
    ctx.clearRect(0, 0, X, Y / 4);
  
    ctx.fillStyle = "#87AFFD";
    ctx.fillRect(0, Y/4, X/2, Y);
    ctx.fillStyle = "#FE8787";
    ctx.fillRect(X/2, Y/4, X, Y);
    ctx.fillStyle = "white"
    ctx.font = '348px DungGeunMo';
    ctx.textAlign = "center";
    ctx.fillText("O", X / 4, Y/1.4);
    ctx.fillStyle = "white"
    ctx.font = '348px DungGeunMo';
    ctx.textAlign = "center";
    ctx.fillText("X", X - (X/4), Y/1.4);

    if (is_breaking)
    {
      ctx.clearRect(0, 0, X, Y / 4);
      ctx.fillStyle = "bisque";
      ctx.fillRect(0, 0, X, Y / 4);
      ctx.fillStyle = "black"
      ctx.font = '48px DungGeunMo';
      // measureText() = 문자열의 넓이 반환
      ctx.textAlign = "center";
      ctx.fillText('READY??', X / 2, Y / 5);
      ctx.fillStyle = "#90DBA2"
      ctx.font = '200px DungGeunMo';
      ctx.textAlign = "center";

      if (break_num == 0) ctx.fillText("START!!!", X / 2, Y / 1.6);
      else if(break_num <= 3) ctx.fillText(break_num, X / 2, Y / 1.6);
    }

    if (is_during)
    {
        // 문제 출력 전에 영역을 초기화 시켜줌
        ctx.clearRect(0, 0, X, Y / 4);
        ctx.fillStyle = "bisque";
        ctx.fillRect(0, 0, X, Y / 4);

        // 문제 출력
        ctx.fillStyle = "black"
        if (question.length < 20)
        {
            ctx.font = '48px DungGeunMo';
        }
        else
        {
            ctx.font = '36px DungGeunMo';
        }
        // measureText() = 문자열의 넓이 반환
        ctx.textAlign = "center";
        ctx.fillText(question, X / 2, Y / 5);

        // 카운트다운 출력
        ctx.fillStyle = "#90DBA2"
        ctx.font = '200px DungGeunMo';
        ctx.textAlign = "center";
        if (during_num <= 5)
        {
            ctx.fillText(during_num, X / 2, Y / 1.6);
        }
    }
    if (is_checking)
    {
        ctx.clearRect(0, 0, X, Y / 4);
        ctx.fillStyle = "bisque";
        ctx.fillRect(0, 0, X, Y / 4);

        ctx.fillStyle = "black"
        ctx.font = '48px DungGeunMo';
        ctx.textAlign = "center";

        if (answer && players[myId].is_O)
        {
            // 정답이 O. and 플레이어가 O.
            ctx.fillText('정답입니다!!', X / 2, Y / 5);
            answer_cnt = true;
        }
        else if (!answer && !players[myId].is_O)
        {
            // 정답이 X. and 플레이어가 X.
            ctx.fillText('정답입니다!!', X / 2, Y / 5);
            answer_cnt = true;
        }
        else
        {
            ctx.fillText('틀렸습니다!!', X / 2, Y / 5);
        }
      }
    if(is_end)
    {
      let overmsg = '당신의 점수를 이력서에 추가하는 중입니다..';
      ctx.clearRect(0, 0, X, Y / 4);
      ctx.fillStyle = "bisque";
      ctx.fillRect(0, 0, X, Y / 4);
      ctx.fillStyle = "black"
      ctx.font = '48px DungGeunMo';
      // measureText() = 문자열의 넓이 반환
      ctx.textAlign = "center";
      
      ctx.fillText('게임 끝!!!!!', X / 2, Y / 5);
      ctx.fillText(overmsg, X / 2 - (ctx.measureText(overmsg).width / 2), Y / 1.6);
    }
  
    // 점수 출력
    ctx.fillStyle = "black"
    ctx.font = '24px DungGeunMo';
    ctx.textAlign = "center";
    ctx.fillText('Score : ' + players[myId].score, 55, 40);
    //field_draw();
    renderPlayer();
} // end of update


function answer_score() {
  players[myId].score += 50;
}

func_lding().then
( () => {
  document.body.style.backgroundImage = "url('https://media.discordapp.net/attachments/980090904394219562/1020072426308112394/unknown.png')";
  // setInterval(renderPlayer, 50);
  setInterval(() => {
    if(is_breaking) break_num--;
    else if (is_during) during_num--;
    if (answer_cnt) {
      players[myId].score += 50;
      answer_cnt = false;
    }
  }, 1000);
  setInterval(update, 20);
} )


/*
  
  
*/