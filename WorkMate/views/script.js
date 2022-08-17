var Matchbtn = document.getElementById("matchStart"); //매칭하기 버튼
var cancelbtn = document.getElementById("matchcancel"); //방나가기 / 매치 나가기 버튼
var Croombtn = document.getElementById("createroom"); //방만들기 버튼 
var Jroombtn = document.getElementById("joinroom"); //방 입장 버튼
var start = document.getElementById("start"); //게임 시작 버튼
var nickname = document.getElementById("nick"); // 닉네임
var rmcodetxt = document.getElementById("roomcode"); // 입력받은 룸 코드
var roomid = '';
var a = 1;
  
function PlayerBall(id){ //자신이 서버랑 주고받을 정보들
  this.id = id;
  this.color = "#FF00FF";
  this.x = 1024/2;
  this.y = 768/2;
  this.nick = "player";
  this.score = 0;
}

var userpool  = [];
var userinfo = {};
var myId;
var socket = io();
Matchbtn.addEventListener("click", match);
Croombtn.addEventListener("click", function () {
  roomid = (new Date().getTime() + Math.random()).toString(36).substring(2,7);
  console.log("create room 눌림 " + myId + roomid + ' ' + nickname.value);
  socket.emit('createroom', {
    id : myId, 
    roomid : roomid, 
    nick : nickname.value,
    score : 0
  }); 
})

socket.on('createsuccess',()=>{
  toggleRoom();
})

Jroombtn.addEventListener('click', function () {
console.log('join room 눌림');
  if(rmcodetxt.value == null || rmcodetxt.value == '')
    alert('방 코드를 입력해주세요\n' + '입력받은 방코드 : ' + rmcodetxt.value)
  if(nickname.value == null || nickname.value == undefined || nickname.value == '') nickname = "Player" + Math.floor(Math.random()*100+1)
socket.emit('joinroom', {
  id : myId, 
  roomid : rmcodetxt.value,
  nick : nickname.value,
  score : 0
}); 
})

socket.on('joinsuccess', ()=>{
  toggleRoom();
  toggleRoom2();
})
socket.on('joinfail', ()=>{
  alert('올바른 코드를 입력해주세요!');
})
start.addEventListener("click", function () {
socket.emit('startgame', myId);
})

cancelbtn.addEventListener("click",function () {
socket.emit("matchcancel", myId);
console.log('나가기 눌림');
})

socket.on('matchfail', function(data) {
 alert('다시 시도해주세요');
})
socket.on('user_id', function(data){
  myId = data;
})

socket.on('gamestart', function() {
  console.log('게임 스타트');
  //$('#main').load('/gamebase.html');
  $('#main').load('/views/space_race/space_race.html');
})

function match(e) {
  let player = userinfo[myId];        // 자신의 정보불러옴
  let nickname = "nickname " + a;
  roomid  =
  (new Date().getTime() + Math.random()).toString(36).substring(2,7);
  
  socket.emit("matchStart", {
    id : myId,
    roomid : roomid,
    nick : nickname.value, 
    score : 0
  });
  console.log("매치 시작 보냈다?");
  setTimeout(()=>{
    socket.emit('matchtimeover', myId);
    }, 15000)
}

function toggleRoom() {
  var x = document.getElementById("room");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
	
function toggleRoom2() {
  var x = document.getElementById("room2");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}