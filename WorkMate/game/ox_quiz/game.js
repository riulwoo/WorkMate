let ox_canvas = document.getElementById("ox_canvas");
let ox_ctx = ox_canvas.getContext("2d");
count_sec = Math.ceil(COUNT_DUR_TIME * FPS);
let question = ""; // 문제 변수
let answer; // 답 변수

// 크기 변수
ox_canvas.width = document.body.clientWidth;
ox_canvas.height = document.body.clientHeight;
X = ox_canvas.width;
Y = ox_canvas.height;

let ox_XY = [
  [X / 2 - 16, Y / 2 - 10],
  [X / 2, Y / 2 - 10],
  [X / 2 + 16, Y / 2 - 10],
  [X / 2 - 16, Y / 2 + 10],
  [X / 2, Y / 2 + 10],
  [X / 2 + 16, Y / 2 + 10],
];

let ox_interval1;
let ox_interval2;
var ballPressed = false;
// Game Flow 관련
var is_during = false; // 문제가 진행중일 때 true.
var is_breaking = false; // 정답을 확인하고 다음 문제가 나오기 전까지 true.
var is_checking = false; // 문제에 대한 정답을 확인할 때.
var is_end = false;

var during_num = 0;
var break_num = 0;
var check_num = 0;

var answer_cnt = false; // 문제를 맞췄을 때 활성화 되어 점수를 올려주는 체크용 변수
let balls = [];
document.addEventListener("keydown", ox_keyDownHandler, false);
document.addEventListener("keyup", ox_keyUpHandler, false);

/** 키를 눌렀을 때 실행되는 메서드 */
function ox_keyDownHandler(e) {
  if (e.keyCode == 68) {
    // 'ArrowRight'
    rightPressed = true;
  }
  if (e.keyCode == 65) {
    // 'ArrowLeft'
    leftPressed = true;
  }
  if (e.keyCode == 83) {
    // "ArrowDown"
    downPressed = true;
  }
  if (e.keyCode == 87) {
    // "ArrowUp"
    upPressed = true;
  }
  if (e.keyCode == 74) {
    ballPressed = true;
  }
}

/** 키를 뗐을 때 실행되는 메서드 */
function ox_keyUpHandler(e) {
  if (e.keyCode == 68) {
    // 'ArrowRight'
    rightPressed = false;
  }
  if (e.keyCode == 65) {
    // 'ArrowLeft'
    leftPressed = false;
  }
  if (e.keyCode == 83) {
    // "ArrowDown"
    downPressed = false;
  }
  if (e.keyCode == 87) {
    // "ArrowUp"
    upPressed = false;
  }
  if (e.keyCode == 74) {
    ballPressed = false;
  }
}

/** 게임 맵을 그리는 메서드 */
function ox_field_draw() {
  ox_canvas.width = document.body.clientWidth;
  ox_canvas.height = document.body.clientHeight;

  X = ox_canvas.width;
  Y = ox_canvas.height;
  ox_ctx.beginPath();
  ox_ctx.fillStyle = "bisque";
  ox_ctx.fillRect(0, 0, X, Y / 4);
  // O 영역
  ox_ctx.fillStyle = "#87AFFD";
  ox_ctx.fillRect(0, Y / 4, (X * 40) / 100, Y);
  // 중앙 영역
  ox_ctx.fillStyle = "#757E8B";
  ox_ctx.fillRect((X * 40) / 100, Y / 4, (X * 20) / 100, Y);
  // Y 영역
  ox_ctx.fillStyle = "#FE8787";
  ox_ctx.fillRect((X * 60) / 100, Y / 4, (X * 40) / 100, Y);
  // O, X 텍스트
  ox_ctx.fillStyle = "white";
  ox_ctx.font = "348px DungGeunMo";
  ox_ctx.textAlign = "center";
  ox_ctx.fillText("O", (X * 20) / 100, Y / 1.4);
  ox_ctx.fillStyle = "white";
  ox_ctx.font = "348px DungGeunMo";
  ox_ctx.textAlign = "center";
  ox_ctx.fillText("X", (X * 80) / 100, Y / 1.4);
  ox_ctx.closePath();
}

function ox_break_draw() {
  ox_ctx.clearRect(0, 0, X, Y / 4);
  ox_ctx.fillStyle = "bisque";
  ox_ctx.fillRect(0, 0, X, Y / 4);
  ox_ctx.fillStyle = "black";
  ox_ctx.font = "48px DungGeunMo";
  // measureText() = 문자열의 넓이 반환
  ox_ctx.textAlign = "center";
  ox_ctx.fillText("READY??", X / 2, Y / 5.5);
  ox_ctx.fillStyle = "#90DBA2";
  ox_ctx.font = "200px DungGeunMo";
  ox_ctx.textAlign = "center";

  if (break_num == 0) ox_ctx.fillText("START!!!", X / 2, Y / 1.6);
  else if (break_num <= 3) ox_ctx.fillText(break_num, X / 2, Y / 1.6);
}

function ox_check_draw() {
  ox_ctx.clearRect(0, 0, X, Y / 4);
  ox_ctx.fillStyle = "bisque";
  ox_ctx.fillRect(0, 0, X, Y / 4);

  ox_ctx.fillStyle = "black";
  ox_ctx.font = "48px DungGeunMo";
  ox_ctx.textAlign = "center";

  if (answer && players[myId].is_O) {
    // 정답이 O. and 플레이어가 O.
    ox_ctx.fillText("정답입니다!!", X / 2, Y / 5.5);
    answer_cnt = true;
  } else if (!answer && players[myId].is_X) {
    // 정답이 X. and 플레이어가 X.
    ox_ctx.fillText("정답입니다!!", X / 2, Y / 5.5);
    answer_cnt = true;
  } else {
    ox_ctx.fillText("틀렸습니다!!", X / 2, Y / 5.5);
  }
}

function ox_during_draw() {
  // 문제 출력 전에 영역을 초기화 시켜줌
  ox_ctx.clearRect(0, 0, X, Y / 4);
  ox_ctx.fillStyle = "bisque";
  ox_ctx.fillRect(0, 0, X, Y / 4);

  // 문제 출력
  ox_ctx.fillStyle = "black";
  if (question.length < 20) {
    ox_ctx.font = "48px DungGeunMo";
  } else {
    ox_ctx.font = "36px DungGeunMo";
  }
  // measureText() = 문자열의 넓이 반환
  ox_ctx.textAlign = "center";
  ox_ctx.fillText(question, X / 2, Y / 5.5);

  // 카운트다운 출력
  ox_ctx.fillStyle = "#90DBA2";
  ox_ctx.font = "200px DungGeunMo";
  ox_ctx.textAlign = "center";
  if (during_num <= 5) {
    ox_ctx.fillText(during_num, X / 2, Y / 1.6);
  }
}

function ox_end_draw() {
  let overmsg = "당신의 점수를 이력서에 추가하는 중입니다..";
  ox_ctx.clearRect(0, 0, X, Y / 4);
  ox_ctx.fillStyle = "bisque";
  ox_ctx.fillRect(0, 0, X, Y / 4);
  ox_ctx.fillStyle = "black";
  ox_ctx.font = "48px DungGeunMo";
  // measureText() = 문자열의 넓이 반환
  ox_ctx.textAlign = "center";

  ox_ctx.fillText("게임 끝!!!!!", X / 2, Y / 5.5);
  ox_ctx.fillText(overmsg, ox_ctx.measureText(overmsg).width, Y / 1.6);
}

function ox_score_draw() {
  // 점수 출력
  ox_ctx.fillStyle = "black";
  ox_ctx.font = "42px DungGeunMo";
  ox_ctx.textAlign = "left";
  ox_ctx.fillText(
    "Score : " + players[myId].score,
    (X * 23) / 100,
    (Y * 7) / 100
  );
}

function delaycheck() {
  if (players[myId].balldelaysec > 0) {
    players[myId].balldelaysec--;
  }
}
/** 게임 시작 전 로딩창을 띄우는 메서드 */
function ox_func_lding() {
  return new Promise((r1, r2) => {
    for (let i = 0; i < playerinfo.length; i++) {
      let player = new ox_player(
        playerinfo[i].id,
        playerinfo[i].nick,
        ox_XY[i][0],
        ox_XY[i][1],
        colorNick[i]
      );
      playermap[i] = player;
      players[playerinfo[i].id] = player;
    }
    //document.body.style.backgroundImage = "url('https://media.discordapp.net/attachments/980090904394219562/1021799584667803839/GIF_2022-09-21_12-06-13.gif?width=1266&height=636')";
    document.body.style.backgroundImage = ox_loading;
    setTimeout(() => {
      socket.emit("ox_ready", myId);
      r1();
    }, 3000);
  });
}

socket.on("ox_breaking", (data) => {
  const { break_time, _question } = data;
  is_checking = false;
  is_breaking = true;
  is_during = false;
  break_num = break_time;
  question = _question;
});

socket.on("ox_during", (data) => {
  const { during_time, _answer } = data;
  is_breaking = false;
  is_during = true;
  is_checking = false;
  during_num = during_time;
  answer = _answer;
});

socket.on("ox_checking", (checking_time) => {
  is_during = false;
  is_breaking = false;
  is_checking = true;
  checking_num = checking_time;
});

socket.on("ox_end", () => {
  is_breaking = false;
  is_during = false;
  is_checking = false;
  is_end = true;
  let index = getMyIndex(myId);
  playerinfo[index].score += players[myId].score;
  setTimeout(() => {
    clearInterval(ox_interval1);
    clearInterval(ox_interval2);
    socket.emit("gameover", myId);
  }, 3000);
});

function ox_update() {
  ox_field_draw();
  ox_renderPlayer();
  drawBall();
  distBall();
  delaycheck();
  if (is_breaking) ox_break_draw();
  if (is_during) ox_during_draw();
  if (is_checking) ox_check_draw();
  if (is_end) ox_end_draw();
  ox_ctx.drawImage(ox_map, 0, 0, X, Y);
  ox_score_draw();
} // end of update

function answer_score() {
  players[myId].score += 50;
}

ox_func_lding().then(() => {
  //document.body.style.backgroundImage = "url('https://media.discordapp.net/attachments/980090904394219562/1020072426308112394/unknown.png')";
  document.body.style.backgroundImage = bgImage;
  // setInterval(renderPlayer, 50);
  ox_interval2 = setInterval(() => {
    if (is_breaking) break_num--;
    else if (is_during) during_num--;
    if (answer_cnt) {
      players[myId].score += 50;
      answer_cnt = false;
    }
  }, 1000);
  ox_interval1 = setInterval(ox_update, 20);
});

/*
  
  
*/
