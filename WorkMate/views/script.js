var matchBtn = document.getElementById("matchStart"); //매칭하기 버튼
var cancelBtn = document.getElementById("matchcancel"); //방나가기 / 매치 나가기 버튼
var croomBtn = document.getElementById("createroom"); //방만들기 버튼 
var jroomBtn = document.getElementById("joinroom"); //방 입장 버튼
var start = document.getElementById("start"); //게임 시작 버튼
var nickName = document.getElementById("nick"); // 닉네임
var rmCodeTxt = document.getElementById("roomcode"); // 입력받은 룸 코드
let adminCode = document.getElementById("adminCode");
let slot = document.querySelectorAll(".slot");
let admin = document.getElementById("admin");
var roomId = '';
var a = 1;
var myId;
var socket = io();
let players = [];
let playermap = [];
let QIndex = [];
matchBtn.addEventListener("click", match);

croomBtn.addEventListener("click", function () {
  roomId = randomCode();
  randomNick();
  adminCode.innerText = roomId;
  console.log("create room 눌림 " + myId + roomId + ' ' + nickName);
  toggleRoom();
  addPlayer([nickName], [myId]);
  socket.emit('createroom', {
    id : myId, 
    roomid : roomId, 
    nick : nickName,
    score : 0
  });
})

jroomBtn.addEventListener('click', function () {
  console.log('join room 눌림');
  randomNick();
  if(rmCodeTxt.value == null || rmCodeTxt.value == '')
    alert('방 코드를 입력해주세요\n' + '입력받은 방코드 : ' + rmCodeTxt.value)
  toggleRoom();
  toggleRoom2();
  socket.emit('joinroom', {
    id : myId, 
    roomid : rmCodeTxt.value,
    nick : nickName,
    score : 0
  }); 
})

socket.on('joinsuccess', (data)=>{
  adminCode.innerText = data.roomcode;
  addPlayer(data.usernick, data.userid);
})

socket.on('joinfail', ()=>{
  alert('올바른 코드를 입력해주세요!');
  toggleRoom();
  toggleRoom2();
})

start.addEventListener("click", function () {
  socket.emit('startgame', myId);
})

cancelBtn.addEventListener("click",function () {
  socket.emit("matchcancel", myId);
  removePlayer(myId);
  console.log('나가기 눌림');
})

socket.on('matchfail', function(data) {
 alert('다시 시도해주세요');
})

socket.on('user_id', function(data){
  myId = data;
})

socket.on('gamestart', function(data) {
  const { game, player : playboy, oxQIndex } = data;
  QIndex = oxQIndex;
  console.log('게임 스타트');
  //$('#main').load('/gamebase.html');
  $('#main').load(`/${game}`);
  for (let i = 0; i < playboy.length; i++) {
    let player = new PlayerBall(playboy[i].id, playboy[i].nick);
    playermap[i] = player;
    players[playboy[i].id] = player;
    console.log(players);
  }
})

socket.on('leave_user', (data)=>{
  removePlayer(data);
})

function PlayerBall(id, nick){
    this.id = id;
    this.color = "#FF00FF";
    this.x = 1024/2;
    this.y = 768/2;
    this.score = 0;
    this.nick = nick;
    // 플레이어의 앞, 뒤, 왼, 오 이미지 => 현재 앞모습 이미지 밖에 없음
    this.asset = ['https://cdn.discordapp.com/attachments/980090904394219562/1004271208226881606/1.png',
                  'https://cdn.discordapp.com/attachments/980090904394219562/1004271284735193139/4.png',
                  'https://cdn.discordapp.com/attachments/980090904394219562/1004271240271376385/4.png',
                  'https://cdn.discordapp.com/attachments/980090904394219562/1004271430722146345/3.png'];

    // 키 입력 받을 시 이미지
    this.currentImage = new Image();
    this.currentImage.src = this.asset[0];

  this.is_O;
}

function randomNick() {
  nickName = nickName.value == null || nickName.value == undefined || nickName.value == '' || nickName.value.replace(' ','') == ''?
  "Player " + Math.floor(Math.random()*100+1) : nickName.value 
}

function addPlayer(nickName, userid) {
  let arr = nickName.length > 2 ? nickName.filter(e => e != null) : nickName;
  let id = userid.length > 2 ? userid.filter(e => e != null) : userid;
  console.log(userid, id);
  for(let i = 0 ; i < arr.length ; i++)
  {
    while (slot[i].hasChildNodes()) {
        slot[i].firstChild.remove();
      }
    let name = document.createElement('div');
    let img = document.createElement('img')
    let hide = document.createElement('div');
    let hidedId = document.createTextNode(id[i])
    let Node = document.createTextNode(nickName[i])
    
    hide.classList.add('in_slot_hide');
    img.classList.add('in_slot_img');
    name.classList.add('in_slot_name');

    hide.appendChild(hidedId);
    name.appendChild(Node);
    slot[i].appendChild(img);
    slot[i].appendChild(name);
    slot[i].appendChild(hide);
  };
}

function removePlayer(id){
  try{
    let slotId = document.querySelectorAll('.in_slot_hide');
    let arrId = Array.prototype.slice.call(slotId);
    console.log(arrId[0].innerHTML); 
    let i = arrId.findIndex(e => e.innerHTML == id)
    
    while (slot[i].hasChildNodes()) {
      slot[i].firstChild.remove();
    }
  }
  catch(e){console.log(e)};
}

function randomCode() {
  return (new Date().getTime() + Math.random()).toString(36).substring(2,7);
}
function match() {
  roomId  =  randomCode();
  randomNick();
  socket.emit("matchStart", {
    id : myId,
    roomid : roomId,
    nick : nickName, 
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