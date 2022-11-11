let flip_canvas = document.getElementById("flip_canvas");
let flip_ctx = flip_canvas.getContext("2d");
// 화면 크기
// 캔버스의 크기 속성값을 클라이언트의 화면 크기와 같게 바꿔줌
flip_canvas.width = document.body.clientWidth;
flip_canvas.height = Math.ceil(document.body.clientHeight);
// X와 Y는 캔버스의 width와 height를 저장하는데 사용.
X = flip_canvas.width;
Y = flip_canvas.height;

count_sec = Math.ceil(COUNT_DUR_TIME * FPS);
//
let flip_XY = [
  [X / 2 - 116, Y / 2 - 110],
  [X / 2, Y / 2 - 110],
  [X / 2 + 116, Y / 2 - 110],
  [X / 2 - 116, Y / 2 + 110],
  [X / 2, Y / 2 + 110],
  [X / 2 + 116, Y / 2 + 110],
];

// 플레이어 관련
const FLIP_PLAYER_STUN_TIME = 1.5; // 플레이어가 폭탄을 맞으면 1.5초간 기절에 걸린다. 그 기절 시간을 상수에 저장해줌
const FLIP_PLAYER_DELAY_TIME = 3;

// 플레이어
let flip_interval;
// 상호작용 키
var keyPressed = false;
// 그려질 카드
var card_asset_index = [
  "https://workmate.s3.ap-northeast-2.amazonaws.com/flip/card_back.png",
  "https://workmate.s3.ap-northeast-2.amazonaws.com/flip/card_coffee.png",
  "https://workmate.s3.ap-northeast-2.amazonaws.com/flip/card_laptop.png",
  "https://workmate.s3.ap-northeast-2.amazonaws.com/flip/card_files_2.png",
  "https://workmate.s3.ap-northeast-2.amazonaws.com/flip/card_print_2.png",
  "https://workmate.s3.ap-northeast-2.amazonaws.com/flip/card_money.png",
  "https://workmate.s3.ap-northeast-2.amazonaws.com/flip/card_cal.png",
  "https://workmate.s3.ap-northeast-2.amazonaws.com/flip/card_boom.png",
  "https://workmate.s3.ap-northeast-2.amazonaws.com/flip/card_matched.png",
];
var card_margin = (X * 0.75) / 100; // 카드와 카드 사이의 간격 35 55 75
var card_width = (X * 7.5) / 100; // 카드의 가로 길이
var card_height = (Y * 13) / 100; // 카드의 세로 길이
var firstX = (X * 5.2) / 100; // 카드가 처음 그려질 x 좌표 4 5.5
var firstY = (Y * 12) / 100; // 카드가 처음 그려질 y 좌표
var deck = []; // 카드가 들어갈 배열

// Game Flow 관련
var flip_is_counting = false;
var flip_is_gaming = false;
var flip_is_ending = false;
document.addEventListener("keydown", card_keyDownHandler, false);
document.addEventListener("keyup", card_keyUpHandler, false);

/** 키를 눌렀을 때 실행되는 메서드 */
function card_keyDownHandler(e) {
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
    keyPressed = true;
  }
}

/** 키를 뗐을 때 실행되는 메서드 */
function card_keyUpHandler(e) {
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
    keyPressed = false;
  }
}

/** 게임 스코어를 그리는 메서드 */
function flip_score_draw() {
  flip_ctx.beginPath();
  flip_ctx.fillStyle = "black";
  flip_ctx.font = "42px DungGeunMo";
  flip_ctx.textAlign = "left";
  flip_ctx.fillText(
    "score : " + players[myId].score,
    (X * 23) / 100,
    (Y * 7) / 100
  );
  flip_ctx.closePath();
}

/** 게임 맵을 그리는 메서드 */
function flip_field_draw() {
  flip_canvas.width = document.body.clientWidth;
  flip_canvas.height = document.body.clientHeight;

  X = flip_canvas.width;
  Y = flip_canvas.height;

  flip_ctx.beginPath();
  flip_ctx.fillStyle = "#7092BE";
  flip_ctx.fillRect(0, 0, X, Y);
  flip_ctx.closePath();
  flip_ctx.drawImage(flip_map, 0, 0, X, Y);
}

function flip_count_draw() {
  flip_ctx.fillStyle = "#90DBA2";
  flip_ctx.font = "200px DungGeunMo";
  flip_ctx.textAlign = "center";
  flip_ctx.fillText(Math.ceil(count_sec / 60), X / 2, Y / 2);
}

function flip_ending_draw() {
  flip_ctx.fillStyle = "#90DBA2";
  flip_ctx.font = "200px DungGeunMo";
  flip_ctx.textAlign = "center";
  flip_ctx.fillText("GAME OVER", X / 2, Y / 2);
}

/** 게임 시작 전 로딩창을 띄우는 메서드 */
function flip_func_lding() {
  return new Promise((r1, r2) => {
    //document.body.style.backgroundImage ="url('https://media.discordapp.net/attachments/980090904394219562/1021799584667803839/GIF_2022-09-21_12-06-13.gif?width=1266&height=636')"; // 나중에 카드 로딩창으로 수정하기.
    document.body.style.backgroundImage = flip_loading;
    for (let i = 0; i < playerinfo.length; i++) {
      let player = new flip_player(
        playerinfo[i].id,
        playerinfo[i].nick,
        flip_XY[i][0],
        flip_XY[i][1],
        colorNick[i]
      );
      playermap[i] = player;
      players[playerinfo[i].id] = player;
    }
    setTimeout(() => {
      socket.emit("flip_is_ready", myId);
      r1();
    }, 4000);
  });
}

socket.on("flip_start", (data) => {
  let cx = firstX;
  let cy = firstY;
  for (let i = 0; i < data.length; i++) {
    if (i % 11 == 10) {
      make_Deck(cx, cy, data[i]);
      cy = cy + card_height + card_margin;
      cx = firstX;
    } else {
      make_Deck(cx, cy, data[i]);
      cx = cx + card_width + card_margin;
    }
  }
});
socket.on("card_fliped", (c_index) => {
  flip_effect(c_index);
});

socket.on("card_matched", (c_index) => {
  c_index.forEach((i) => {
    deck[i].poly = 1;
    deck[i].untouchable = true;
  });
});
socket.on("card_not_matched", (c_index) => {
  c_index.forEach((i) => {
    deck[i].poly = 0;
    deck[i].isMine = true;
    deck[i].untouchable = false;
  });
});
socket.on("flip_end", () => {
  let index = getMyIndex(myId);
  playerinfo[index].score += players[myId].score;
  flip_is_ending = true;
  flip_is_gaming = false;
  setTimeout(() => {
    clearInterval(flip_interval);
    socket.emit("gameover", myId);
  }, 3000);
});

// 남의 카드기 때문에 choose 못하게 처리
function flip_effect(index) {
  if (deck[index].info == 7) {
    deck[index].poly = 1;
    setTimeout(() => {
      deck[index].untouchable = true;
      return;
    }, 1500);
  }
  // 카드가 앞면일 경우
  else if (deck[index].poly) {
    deck[index].poly = 0;
    deck[index].isMine = true;
  }
  // 카드가 뒷면일 경우
  else {
    deck[index].poly = 1;
    deck[index].isMine = false;
  }
}

/** 카드덱을 만드는 함수. 끝에 shuffle 메서드를 실행시켜 덱을 섞어준다. */
function make_Deck(x, y, info) {
  let card = new Card(x, y, info);
  deck.push(card);
}

/** 카드를 한장씩 화면에 그리는 메서드 */
function draw_Deck() {
  for (var i = 0; i < deck.length; i++) {
    deck[i].draw();
  }
}

/** 플레이어가 기절에 걸렸을 때, 지속시간이 감소되도록 하는 메서드. */
function stun_flow() {
  if (players[myId].stun_sec > 0) players[myId].stun_sec--;
}

/** 플레이어가 두 장의 카드를 뒤집으면 맞는지 틀린지 최종 판별하는 메서드 */
function match_flow(player, check) {
  // 다름
  if (!check) {
    deck[player.firstcard].poly = 0;
    deck[player.secondcard].poly = 0;
    deck[player.firstcard].untouchable = false;
    deck[player.secondcard].untouchable = false;
  }
  // 같음
  else {
    deck[player.firstcard].untouchable = true;
    deck[player.secondcard].untouchable = true;
    player.score += 50;
  }
  player.firstcard = -1;
  player.secondcard = -1;
  player.delay = false;
}

function delay_check() {
  if (players[myId].first_delay_sec > 0 && !players[myId].firstpick) {
    players[myId].first_delay_sec--;

    if (players[myId].first_delay_sec == 0) {
      deck[players[myId].firstcard].poly = 0;
      players[myId].firstpick = true;
      // players[myId].firstcard = -1;
      socket.emit("flip", {
        id: myId,
        c_index: players[myId].firstcard,
      });
    }
  }
}

/** 카드를 선택하는 메서드 */
function choose(player) {
  // 어떤 카드를 뒤집었는지 체크하는 코드
  let card_index;
  for (i = 0; i < deck.length; i++) {
    var card = deck[i]; // 반복문을 돌리면서 카드를 한 장씩 변수에 넣는다.

    if (card.x >= 0) {
      if (
        player.x + 25 >= card.x &&
        player.x + 25 <= card.x + card_width &&
        player.y + 35 >= card.y &&
        player.y + 35 <= card.y + card_height
      ) {
        // 플레이어의 좌표가 카드의 영역 안에 정상적으로 들어가 있고,
        if (player.firstpick || player.firstcard != i) {
          // if > 딜레이 체크 bool 변수가 만들어지면 넣는 걸로
          // 플레이어가 첫번째 선택이라면 혹은, 플레이어기 처음에 고른 카드와 다른 카드라면
          card_index = i;
          break; // 변수 card에 고른 카드를 저장한 채 반복문을 종료한다.
        } else {
          deck[player.firstcard].poly = 0;
          socket.emit("flip", {
            id: myId,
            c_index: players[myId].firstcard,
          });
          player.firstcard = -1;
          player.firstpick = true;
          return;
        }
      }
    }
  }

  if (
    card_index < deck.length &&
    !deck[card_index].untouchable &&
    deck[card_index].isMine
  ) {
    // 사용자가 카드를 고름
    if (deck[card_index].info == 7) {
      // 폭탄을 뒤집었을 때의 처리
      if (!player.firstpick) {
        deck[player.firstcard].poly = 0;
        socket.emit("flip", {
          id: myId,
          c_index: player.firstcard,
        });
      }
      player.firstpick = true;
      socket.emit("flip", {
        id: myId,
        c_index: card_index,
      });
      player.firstcard = -1;
      player.secondcard = -1;
      deck[card_index].poly = 1;
      // 플레이어를 기절 상태로 만듬.
      player.stun_sec = Math.ceil(FLIP_PLAYER_STUN_TIME * FPS);
      setTimeout(() => {
        deck[card_index].untouchable = true;
        player.score -= 10;
        socket.emit("flip", {
          id: myId,
          c_index: card_index,
        });
      }, 2000);
    }
    // 고른 카드가 첫번째인지 판별
    else if (player.firstpick) {
      player.firstcard = card_index;
      player.firstpick = false;
      player.first_delay_sec = Math.ceil(FLIP_PLAYER_DELAY_TIME * FPS);
      deck[card_index].poly = 1;
      socket.emit("flip", {
        id: myId,
        c_index: card_index,
      });
    }
    // 고른 카드가 두번째인지 판별
    else {
      player.delay = true;
      player.secondcard = card_index;
      deck[card_index].poly = 1;
      socket.emit("flip", {
        id: myId,
        c_index: card_index,
      });
      setTimeout(() => {
        if (deck[card_index].info == deck[player.firstcard].info) {
          socket.emit("card_will_check", {
            id: myId,
            check: true,
            c_index: [player.firstcard, player.secondcard],
          });
          match_flow(player, true);
        } else {
          socket.emit("card_will_check", {
            id: myId,
            check: false,
            c_index: [player.firstcard, player.secondcard],
          });
          match_flow(player, false);
        }
        player.firstpick = true;
      }, 1500);
    }
  }
}

function flip_update() {
  flip_is_counting = count_sec > 0;

  flip_field_draw();
  draw_Deck();
  flip_score_draw();
  if (flip_is_counting) {
    count_sec--;

    flip_count_draw();

    // handle countdown
    if (count_sec == 0) {
      flip_is_gaming = true;
    }
  }
  if (flip_is_gaming) {
    flip_renderPlayer();
    stun_flow();
    delay_check();
  }
  if (flip_is_ending) {
    flip_ending_draw();
  }
} // end of update

flip_func_lding().then(() => {
  //document.body.style.backgroundImage = "url('https://media.discordapp.net/attachments/980090904394219562/1020072426308112394/unknown.png')";
  document.body.style.backgroundImage = bgImage;
  flip_interval = setInterval(flip_update, 1000 / FPS);
});
