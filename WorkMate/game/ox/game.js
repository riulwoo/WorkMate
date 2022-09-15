let canvas = document.getElementById("ox_canvas");

canvas.width = 1300;
canvas.height = document.body.clientHeight;

let ctx = canvas.getContext('2d');
let myfont = new FontFace('DungGeunMo', 'url(ox/assets/fonts/DungGeunMo.otf)');

// players > id, nick, score, x, y, asset, currentImage, color

myfont.load().then(function(font){
    document.fonts.add(font);
    console.log('font loaded.');
});

// 게임의 프레임은 60fps.
const FPS = 60;
// 문제 및 답 배열
let question = ['하루는 25시간이다?', // Q1 false
                'WorkMate는 Unity Engine로 만들어졌다?', // Q2 false
                '달팽이도 이빨이 있다?', // Q3 true
                '물고기도 기침을 한다?', // Q4 true
                '감자는 뿌리가 아니고 줄기다?', // Q5 true
                '환갑은 61세를 부르는 말이다?', // Q6 true
                '대한민국에서 두 번째로 큰 섬은 거제도이다?', // Q7 true
                '홍길동은 실존 인물이 아니다?', // Q8 false
                '수은의 원소기호는 H9이다?', // Q9 false
                '1 + 2 + 998 + 3 = 1005 이다?', // Q10 false
                '노르웨이의 수도는 오슬로이다?', // Q11 true
                '칠레의 수도는 푸에르토몬트이다?', // Q12 false
                '셰익스피어 희곡 햄릿의 주인공인 햄릿은 네덜란드 사람이다?', // Q13 false
                '여의도 국회의사당을 둘러싸고 있는 돌기둥의 수는 모두 24개이다?', // Q14 true
                '병아리도 배꼽이 있다?', // Q15 true
                '로댕의 생각하는 사람 동상은 오른손으로 턱을 받치고 있다?', // Q16 true
                '사람의 목뼈는 5개이다?', // Q17 false
                '닭도 왼발잡이, 오른발잡이가 있다?', // Q18 true
                '남극에도 우편번호가 있다?', // Q19 false
                '개의 발에도 땀이 난다?', // Q20 false
                '국악의 장단 중 가장 빠른 장단은 굿거리 장단이다?', // Q21 false
                '남자와 여자의 목소리 중 더 멀리서도 들리는것은 여자의 목소리이다?', // Q22 true
                '로미오와 줄리엣은 처음 만난 날 키스를 했다?', // Q23 true
                '머리를 자주 감으면 머리카락이 빠진다?', // Q24 false
                '뱀은 뒤로 갈 수 있다?', // Q25 false
                '세계 최초로 일기예보를 시작한 나라는 영국이다?', // Q26 false
                '손톱은 피부가 변해서 만들어진 것이다?', // Q27 true
                '개미의 하루 평균 노동시간은 6시간이다?', // Q28 true
                '비행기의 출발 시간은 탑승 문이 완전히 닫히는 시간이다?', // Q29 false
                '조선시대에는 예비군이 있었다?', // Q30 true
                '남극이 북극보다 최저기온이 더 낮다?', // Q31 true
                '캔 커피는 의무적으로 카페인 함량 표기를 해야한다?', // Q32 true
                '세계 최초의 신용카드는 아메리칸 익스프레스이다?', // Q33 false
                '계란은 어린 닭이 낳은 것일 수록 그 크기가 크다?', // Q34 false
                '2 + 2 X 2 = 8이다?', // Q35 false
                '손흥민의 포지션은 미드필더이다?', // Q36 false
                '대한민국 최초의 라면은 삼양라면이다?', // Q37 true
                '북두칠성은 시계의 반대 방향으로 회전한다?', // Q38 true
                '대한민국 육군의 복무 기간은 21개월이다?', // Q39 false
                '1부터 100까지 더한 숫자는 5050이다?', // Q40 true
            ];
let question_answer = [
                    false, false, true, true, true, true, true, false, false, false, // 1~10
                    true, false, false, true, true, true, false, true, false, false, // 11~20
                    false,true, true, false, false, false, true, true, false, true, // 21~30
                    true, true, false, false, false, false, true, true, false, true // 31~40
                ];
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
var is_during; // 문제가 진행중일 때 true.
var is_breaking; // 정답을 확인하고 다음 문제가 나오기 전까지 true.
var is_checking; // 
var finished_game = false; // 게임이 완전히 끝났을 때 true.
const QUIZ_DUR_TIME = 5; // 문제 출력 후 퀴즈 진행 시간
const BREAK_DUR_TIME = 1; // 퀴즈와 퀴즈 사이의 대기 시간
const CHECK_DUR_TIME = 1.5; // 퀴즈를 풀고 난 뒤 정답 체크 시간
const PER_SEC = 0.1;
var during_time = 0; // 0이 되면 during_num이 감소됨.
var during_num = 0;
var break_time = Math.ceil(PER_SEC * FPS);
var break_num = Math.ceil(BREAK_DUR_TIME / PER_SEC);
var check_time = 0;
var check_num = 0;
// 문제 진행 횟수 등
const TOTAL_QUIZ_COUNT = 5;
var cur_quiz_count = 0;
let cnt = 0; // quiz_index의 인덱스 변수
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

function field_draw(){
    ctx.beginPath();
    ctx.fillStyle = "bisque";
    ctx.fillRect(0, 0, X, Y / 4);
    ctx.fillStyle = "#87AFFD";
    ctx.fillRect(0, Y/4, X/2, Y);
    ctx.fillStyle = "#FE8787";
    ctx.fillRect(X/2, 200, X, Y);
    // ctx.lineWidth = 20;
    // O
    // ctx.arc(X/4, Y/2+100, 100, 0, Math.PI * 2, true);
    ctx.fillStyle = "white"
    ctx.font = '348px DungGeunMo';
    ctx.textAlign = "center";
    ctx.fillText("O", X / 4, Y/1.4);
    // X
    // ctx.moveTo(X/2 + X/5, Y/2);
    // ctx.lineTo(X/2 + X/3, Y/2 + Y/4)
    // ctx.stroke();
    // ctx.moveTo(X/2 + X/3, Y/2);
    // ctx.lineTo(X/2 + X/5, Y/2 + Y/4);
    // ctx.stroke();
    ctx.fillStyle = "white"
    ctx.font = '348px DungGeunMo';
    ctx.textAlign = "center";
    ctx.fillText("X", X - 300, Y/1.4);
    ctx.closePath();
}

  function updateState(id,x,y,direction){
      let ball = players[id];
      if(!ball){
          return;
      }
      ball.x = x;
      ball.y = y;
      ball.currentImage.src = ball.asset[direction];
  }
  socket.on('update_state', function(data){
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

function update()
{
    // draw playground. 플레이어가 이동할 필드를 그립니다.
    field_draw();
    ctx.clearRect(0, 0, X, Y / 4);
    
    is_during = during_num > 0;
    is_breaking = break_num > 0;
    is_checking = check_num > 0;

    // 문제 출력부
    ctx.fillStyle = "black"
    ctx.font = '48px DungGeunMo';
    // measureText() = 문자열의 넓이 반환
    ctx.textAlign = "center";
    ctx.fillText('READY??', X / 2, 120);
    // ctx.fillText(question[0], X / 2 - (ctx.measureText(`${question[0]}`).width / 2), 120);

    if (is_breaking)
    {
        ctx.clearRect(0, 0, 1200, 200);
        ctx.fillStyle = "bisque";
        ctx.fillRect(0, 0, X, Y / 4);
        ctx.fillStyle = "#90DBA2"
        ctx.font = '200px DungGeunMo';
        ctx.textAlign = "center";
        ctx.fillText(Math.ceil(break_num / 10), X / 2, Y / 1.6);

        // 카운트다운 출력은.. break_num을 10으로 나누고, 소수점 아래는 버림하여 출력하는 방식으로 짜면 될듯
        // handle Countdown
        if (break_num > 0)
        {
            // reduce the break time
            break_time--;

            // reduce the break num
            if (break_time == 0)
            {
                break_time = Math.ceil(PER_SEC * FPS);
                break_num--;
            }
        }

        if (break_num <= 0)
        {
            during_time = Math.ceil(PER_SEC * FPS);
            during_num = Math.ceil(QUIZ_DUR_TIME / PER_SEC);
        }
    }

    if (is_during)
    {
        // 문제 출력 전에 영역을 초기화 시켜줌
        ctx.clearRect(0, 0, 1200, 200);
        ctx.fillStyle = "bisque";
        ctx.fillRect(0, 0, X, Y / 4);

        // 문제 출력
        ctx.fillStyle = "black"
        if (question[QIndex[cnt]].length < 20)
        {
            ctx.font = '48px DungGeunMo';
        }
        else
        {
            ctx.font = '36px DungGeunMo';
        }
        // measureText() = 문자열의 넓이 반환
        ctx.textAlign = "center";
        ctx.fillText("Q" + (cur_quiz_count + 1) + ". " +question[QIndex[cnt]], X / 2, 120);

        // 카운트다운 출력
        ctx.fillStyle = "#90DBA2"
        ctx.font = '200px DungGeunMo';
        ctx.textAlign = "center";
        if (during_num <= 50)
        {
            ctx.fillText(Math.ceil(during_num / 10), X / 2, Y / 1.6);
        }

        // handle Countdown
        if (during_num > 0)
        {
            // reduce the during time
            during_time--;

            // reduce the during num
            if (during_time == 0)
            {
                during_time = Math.ceil(PER_SEC * FPS);
                during_num--;
            }
        }

        if (during_num <= 0)
        {
            check_time = Math.ceil(PER_SEC * FPS);
            check_num = Math.ceil(CHECK_DUR_TIME / PER_SEC);
        }
    }
    if (is_checking)
    {
        ctx.clearRect(0, 0, 1200, 200);
        ctx.fillStyle = "bisque";
        ctx.fillRect(0, 0, X, Y / 4);

        ctx.fillStyle = "black"
        ctx.font = '48px DungGeunMo';
        // measureText() = 문자열의 넓이 반환
        ctx.textAlign = "center";

        if (question_answer[QIndex[cnt]] && players[myId].is_O)
        {
            // 정답이 O. and 플레이어가 O.
            ctx.fillText('정답입니다!!', X / 2, 120);
        }
        else if (!question_answer[QIndex[cnt]] && !players[myId].is_O)
        {
            // 정답이 X. and 플레이어가 X.
            ctx.fillText('정답입니다!!', X / 2, 120);
        }
        else
        {
            ctx.fillText('틀렸습니다!!', X / 2, 120);
        }

        // handle Countdown
        if (check_num > 0)
        {
            // reduce the during time
            check_time--;

            // reduce the during num
            if (check_time == 0)
            {
                check_time = Math.ceil(PER_SEC * FPS);
                check_num--;
            }
        }

        if (check_num <= 0)
        {
            if (question_answer[QIndex[cnt]] && players[myId].is_O)
            {
                players[myId].score++;
            }
            else if (!question_answer[QIndex[cnt]] && !players[myId].is_O)
            {
                players[myId].score++;
            }

            question.splice(QIndex[cnt], 1);
            question_answer.splice(QIndex[cnt], 1);

            cnt++;

            break_time = Math.ceil(PER_SEC * FPS);
            break_num = Math.ceil(BREAK_DUR_TIME / PER_SEC);

            cur_quiz_count++;
        }
    }

    // 모든 퀴즈를 다 끝냈을 시 게임을 종료
    if (cur_quiz_count == TOTAL_QUIZ_COUNT)
    {
        
    }

    // 점수 출력
    ctx.fillStyle = "black"
    ctx.font = '24px DungGeunMo';
    ctx.textAlign = "center";
    ctx.fillText('Score : ' + players[myId].score, 55, 40);
  renderPlayer();
}

setInterval(update, 1000 / FPS);
