let ox_canvas = document.getElementById("ox_canvas");
ox_canvas.width = document.body.clientWidth;
ox_canvas.height = document.body.clientHeight;

let ox_ctx = ox_canvas.getContext('2d');
// let myfont = new FontFace('DungGeunMo', 'url(ox_quiz/asset/DungGeunMo.otf)');

myfont.load().then(function(font){
    document.fonts.add(font);
});

let question = ""          // 문제 변수
let answer;                // 답 변수

let ox_XY = 
  [
    [ X / 2 - 16, Y / 2 - 10 ],
    [ X / 2     , Y / 2 - 10 ],
    [ X / 2 + 16, Y / 2 - 10 ],
    [ X / 2 - 16, Y / 2 + 10 ],
    [ X / 2     , Y / 2 + 10 ],
    [ X / 2 + 16, Y / 2 + 10 ]
  ];

// 크기 변수
X = ox_canvas.width;
Y = ox_canvas.height;

// 캐릭터 관련
// let radius = 16;
// let playerSpeed = 5;

// 이동 관련
// var rightPressed = false;
// var leftPressed = false;
// var upPressed = false;
// var downPressed = false;

// Game Flow 관련
var ox_is_loading; // 이거 안쓰는데??
var is_during = false; // 문제가 진행중일 때 true.
var is_breaking = false; // 정답을 확인하고 다음 문제가 나오기 전까지 true.
var is_checking = false; // 문제에 대한 정답을 확인할 때.
var is_end = false;

var during_num = 0;
var break_num = 0;
var check_num = 0;

var answer_cnt = false; // 문제를 맞췄을 때 활성화 되어 점수를 올려주는 체크용 변수

document.addEventListener("keydown", ox_keyDownHandler, false);
document.addEventListener("keyup", ox_keyUpHandler, false);

/** 키를 눌렀을 때 실행되는 메서드 */
function ox_keyDownHandler(e){
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
function ox_keyUpHandler(e){
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
function ox_field_draw(){
  ox_canvas.width = document.body.clientWidth;
  ox_canvas.height = document.body.clientHeight;

  X = ox_canvas.width;
  Y = ox_canvas.height;

  console.log('정상적으로 실행중');
  ox_ctx.beginPath();
  ox_ctx.fillStyle = "bisque";
  ox_ctx.fillRect(0, 0, X, Y / 4);
  ox_ctx.fillStyle = "#87AFFD";
  ox_ctx.fillRect(0, Y/4, X/2, Y);
  ox_ctx.fillStyle = "#FE8787";
  ox_ctx.fillRect(X/2, Y/4, X, Y);
  ox_ctx.fillStyle = "white"
  ox_ctx.font = '348px DungGeunMo';
  ox_ctx.textAlign = "center";
  ox_ctx.fillText("O", X / 4, Y/1.4);
  ox_ctx.fillStyle = "white"
  ox_ctx.font = '348px DungGeunMo';
  ox_ctx.textAlign = "center";
  ox_ctx.fillText("X", X - 300, Y/1.4);
  ox_ctx.closePath();
}

/** 게임 시작 전 로딩창을 띄우는 메서드 */
function ox_func_lding()
{
  return new Promise((r1, r2) => {
    for (let i = 0; i < playerinfo.length; i++) {
      let player = new ox_player(playerinfo[i].id, playerinfo[i].nick, ox_XY[i][0], ox_XY[i][1]);
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

// function leaveUser(id){
//   for(var i = 0 ; i < players.length; i++){
//     if(players[i].id == id){
//       players.splice(i,1);
//       break;
//     }
//   }
//   delete playermap[id];
// }
// socket.on('leave_user', function(data){
//     leaveUser(data);
// })
// function updateState(id, x, y, direction,ismove,cnt) {
//     let ball = players[id];
//     if (!ball) {
//         return;
//     }
//     ball.x = x;
//     ball.y = y;
//     ball.direction = direction;
//     ball.ismove = ismove;
//     ball.cnt = cnt;
//     ball.player.src = ball.ismove ? moveeffect(ball) : ball.asset[ball.direction];
// }
// socket.on('update_state', function (data) {
//     updateState(data.id, data.x, data.y, data.direction);
// })

// function sendData(curPlayer) {
//       let data = {};
//       data = {
//           id : curPlayer.id,
//           x: curPlayer.x,
//           y: curPlayer.y,
//           direction : curPlayer.direction,
//           ismove : curPlayer.ismove,
//           cnt : curPlayer.cnt
//       };
//       if(data){
//           socket.emit("send_location", data);
//       }
//   }

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

function ox_update()
{
    ox_canvas.width = document.body.clientWidth;
    ox_canvas.height = document.body.clientHeight;

    X = ox_canvas.width;
    Y = ox_canvas.height;

    // draw playground. 플레이어가 이동할 필드를 그립니다.
    ox_ctx.clearRect(0, 0, X, Y / 4);
  
    ox_ctx.fillStyle = "#87AFFD";
    ox_ctx.fillRect(0, Y/4, X/2, Y);
    ox_ctx.fillStyle = "#FE8787";
    ox_ctx.fillRect(X/2, Y/4, X, Y);
    ox_ctx.fillStyle = "white"
    ox_ctx.font = '348px DungGeunMo';
    ox_ctx.textAlign = "center";
    ox_ctx.fillText("O", X / 4, Y/1.4);
    ox_ctx.fillStyle = "white"
    ox_ctx.font = '348px DungGeunMo';
    ox_ctx.textAlign = "center";
    ox_ctx.fillText("X", X - (X/4), Y/1.4);

    if (is_breaking)
    {
      ox_ctx.clearRect(0, 0, X, Y / 4);
      ox_ctx.fillStyle = "bisque";
      ox_ctx.fillRect(0, 0, X, Y / 4);
      ox_ctx.fillStyle = "black"
      ox_ctx.font = '48px DungGeunMo';
      // measureText() = 문자열의 넓이 반환
      ox_ctx.textAlign = "center";
      ox_ctx.fillText('READY??', X / 2, Y / 5);
      ox_ctx.fillStyle = "#90DBA2"
      ox_ctx.font = '200px DungGeunMo';
      ox_ctx.textAlign = "center";

      if (break_num == 0) ox_ctx.fillText("START!!!", X / 2, Y / 1.6);
      else if(break_num <= 3) ox_ctx.fillText(break_num, X / 2, Y / 1.6);
    }

    if (is_during)
    {
        // 문제 출력 전에 영역을 초기화 시켜줌
        ox_ctx.clearRect(0, 0, X, Y / 4);
        ox_ctx.fillStyle = "bisque";
        ox_ctx.fillRect(0, 0, X, Y / 4);

        // 문제 출력
        ox_ctx.fillStyle = "black"
        if (question.length < 20)
        {
            ox_ctx.font = '48px DungGeunMo';
        }
        else
        {
            ox_ctx.font = '36px DungGeunMo';
        }
        // measureText() = 문자열의 넓이 반환
        ox_ctx.textAlign = "center";
        ox_ctx.fillText(question, X / 2, Y / 5);

        // 카운트다운 출력
        ox_ctx.fillStyle = "#90DBA2"
        ox_ctx.font = '200px DungGeunMo';
        ox_ctx.textAlign = "center";
        if (during_num <= 5)
        {
            ox_ctx.fillText(during_num, X / 2, Y / 1.6);
        }
    }
    if (is_checking)
    {
        ox_ctx.clearRect(0, 0, X, Y / 4);
        ox_ctx.fillStyle = "bisque";
        ox_ctx.fillRect(0, 0, X, Y / 4);

        ox_ctx.fillStyle = "black"
        ox_ctx.font = '48px DungGeunMo';
        ox_ctx.textAlign = "center";

        if (answer && players[myId].is_O)
        {
            // 정답이 O. and 플레이어가 O.
            ox_ctx.fillText('정답입니다!!', X / 2, Y / 5);
            answer_cnt = true;
        }
        else if (!answer && !players[myId].is_O)
        {
            // 정답이 X. and 플레이어가 X.
            ox_ctx.fillText('정답입니다!!', X / 2, Y / 5);
            answer_cnt = true;
        }
        else
        {
            ox_ctx.fillText('틀렸습니다!!', X / 2, Y / 5);
        }
      }
    if(is_end)
    {
      let overmsg = '당신의 점수를 이력서에 추가하는 중입니다..';
      ox_ctx.clearRect(0, 0, X, Y / 4);
      ox_ctx.fillStyle = "bisque";
      ox_ctx.fillRect(0, 0, X, Y / 4);
      ox_ctx.fillStyle = "black"
      ox_ctx.font = '48px DungGeunMo';
      // measureText() = 문자열의 넓이 반환
      ox_ctx.textAlign = "center";
      
      ox_ctx.fillText('게임 끝!!!!!', X / 2, Y / 5);
      ox_ctx.fillText(overmsg, X - (ox_ctx.measureText(overmsg).width / 2), Y / 1.6);
    }
  
    // 점수 출력
    ox_ctx.fillStyle = "black"
    ox_ctx.font = '24px DungGeunMo';
    ox_ctx.textAlign = "center";
    ox_ctx.fillText('Score : ' + players[myId].score, 55, 40);
    ox_renderPlayer();
} // end of update


function answer_score() {
  players[myId].score += 50;
}

ox_func_lding().then
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
  setInterval(ox_update, 20);
} )


/*
  
  
*/