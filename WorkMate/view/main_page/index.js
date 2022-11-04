// 절취선
var matchBtn = document.getElementById("matchStart"); //매칭하기 버튼
var mcancelBtn = document.getElementById("matchCancel"); //매치 나가기 버튼
var rcancelBtn = document.getElementById("roomCancel"); //방 나가기
var croomBtn = document.getElementById("createroom"); //방만들기 버튼
var jroomBtn = document.getElementById("joinroom"); //방 입장 버튼
var start = document.getElementById("start"); //게임 시작 버튼
var ready = document.getElementById("ready"); //게임 준비완료 버튼
var nickName = document.getElementById("set-nickname"); // 닉네임
var rmCodeTxt = document.getElementById("roomcode"); // 입력받은 룸 코드
let adminCode = document.getElementById("adminCode");
let slot = document.querySelectorAll(".slot");
let admin = document.getElementById("admin");
let ids;
let idArr;
let nickArr;
var roomId = "";
var a = 1;
var myId;
let players = []; //id가 인덱스
let playermap = []; //순차적인 인덱스
let playerinfo; // 게임에 쓸 플레이어 정보
let finalscore; // 마지막 라운드에 전송할 점수 변수(게임이 종료될 때마다 그 게임에서의 점수 누적)
let sortedScore = [];
let readyCount = 0;
let userCount = 0;

matchBtn.addEventListener("click", match);

croomBtn.addEventListener("click", function () {
  roomId = randomCode();
  randomNick();
  adminCode.innerText = roomId;
  toggleRoom();
  addPlayer([nickName], [myId]);
  socket.emit("createroom", {
    id: myId,
    roomid: roomId,
    nick: nickName,
    score: 0,
  });
  start.style.display = "inline";
  ready.style.display = "none";
});

ready.addEventListener("click", function () {
  socket.emit("ready", myId);
});

jroomBtn.addEventListener("click", function () {
  randomNick();
  if (rmCodeTxt.value == null || rmCodeTxt.value == "")
    alert("방 코드를 입력해주세요\n" + "입력받은 방코드 : " + rmCodeTxt.value);
  toggleRoom();
  toggleRoom2();
  rmCodeTxt.innerText = "";
  socket.emit("joinroom", {
    id: myId,
    roomid: rmCodeTxt.value,
    nick: nickName,
    score: 0,
  });

  start.style.display = "none";
  ready.style.display = "inline";
});

start.addEventListener("click", function () {
  if (readyCount == 0);
  else if (readyCount == userCount - 1) {
    socket.emit("startgame", myId);
  }
});

mcancelBtn.addEventListener("click", () => {
  socket.emit("matchcancel", myId);
  console.log('매칭 취소');
});

rcancelBtn.addEventListener("click", () => {
  socket.emit("matchcancel", myId);
  removeAllPlayer(myId);
});

socket.on("matchfail", function (data) {
  document.getElementById("match-text").innerText =
    "매칭 중인 인원이 없습니다.";
});

socket.on("readyUser", function (Id) {
  ids = document.querySelectorAll(".in_slot_hide");
  for (let i = 0; i < ids.length; i++) {
    if (ids[i].textContent == Id) {
      let color = window.getComputedStyle(slot[i]).backgroundColor;
      if (color == "rgb(255, 255, 255)") {
        slot[i].style.backgroundColor = "rgb(255, 245, 85)";
        if(myId == Id) socket.emit("readyIndex", Id);
        readyCount++;
      } else {
        slot[i].style.backgroundColor = "rgb(255, 255, 255)";
        if(myId == Id) socket.emit("cancelReadyIndex", Id);
        readyCount--;
      }
    }
  }
});

socket.on("user_id", function (data) {
  myId = data;
});

socket.on("playerinit", function (data) {
  playerinfo = data;
  console.log(playerinfo[0]);
});

socket.on("gamestart", function (data) {
  const { game } = data;
  const arr = ["ox_quiz", "survival", "flip_over"];
  if (arr.includes(game)) $("#main").load(`/${game}`);
  // result인 경우
  else {
    let index = getMyIndex(myId);
    socket.emit("calc-score", {
      id: myId,
      score: playerinfo[index].score,
    });
  }
});

socket.on("go-result", (data) => {
  sortedScore = data.sort((a, b) => {
    return b.score - a.score;
  });
  $("#main").load("/result");
});

socket.on("leave_user", (id) => {
  i = idArr.findIndex((ele) => ele == id);
  idArr = idArr.filter((e) => e !== id);
  nickArr.splice(i, 1);
  removePlayer(id);
  checkLeader();
});

socket.on("joinfail", () => {
  alert("올바른 코드를 입력해주세요!");
  toggleRoom();
  toggleRoom2();

  start.style.display = "inline";
  ready.style.display = "none";
});

socket.on("joinsuccess", (data) => {
  adminCode.innerText = data.roomcode;
  addPlayer(data.usernick, data.userid);
});

socket.on("readyUpdate", (rIndex) => {
  readyUpdate(rIndex);
});

// let result = document.getElementById('result');

// result.addEventListener('click', ()=>{
//   $('#main').load(`/result`);
// });