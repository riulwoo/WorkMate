var Matchbtn = document.getElementById("matchStart"); //매칭하기 버튼
var cancelbtn = document.getElementById("matchcancel"); //방나가기 / 매치 나가기 버튼
var Croombtn = document.getElementById("createroom"); //방만들기 버튼 
var Jroombtn = document.getElementById("joinroom"); //방 입장 버튼
var start = document.getElementById("start"); //게임 시작 버튼
var nickname = document.getElementById("nick"); // 닉네임
var rmcodetxt = document.getElementById("roomcode"); // 입력받은 룸 코드
let readercode = document.getElementById("readerCode");
var roomid = '';
var a = 1;

var myId;
var socket = io();
Matchbtn.addEventListener("click", match);
Croombtn.addEventListener("click", function () {
  roomid = (new Date().getTime() + Math.random()).toString(36).substring(2,7);
  
  readercode.innerText = roomid;
  console.log("create room 눌림 " + myId + roomid + ' ' + nickname.value);
  socket.emit('createroom', {
    id : myId, 
    roomid : roomid, 
    nick : nickname.value,
    score : 0
  }); 
  toggleRoom();
  let slot = document.querySelectorAll(".slot")
  let name = document.createElement('div')
  let nick = nickname.value != undefinded ? nickname.value : `player 0`; 
  let nickNode = document.createTextNode(nick)
  let img = document.createElement('img')
  name.classList.add('in_slot_name');
  name.appendChild(nickNode);
  img.classList.add('in_slot_img');
  slot[0].appendChild(name);
  slot[0].appendChild(img);
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
  toggleRoom();
  toggleRoom2();
})

socket.on('joinsuccess', (data)=>{
  readercode.innerText = data.roomcode;
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

socket.on('gamestart', function(data) {
  console.log('게임 스타트');
  //$('#main').load('/gamebase.html');
  $('#main').load(`/${data}`);
})

function match(e) {
  let nickname = "nickname " + a;
  roomid  =  (new Date().getTime() + Math.random()).toString(36).substring(2,7);
  
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