var matchBtn = document.getElementById("matchStart"); //매칭하기 버튼
var cancelBtn = document.getElementById("matchcancel"); //방나가기 / 매치 나가기 버튼
var croomBtn = document.getElementById("createroom"); //방만들기 버튼 
var jroomBtn = document.getElementById("joinroom"); //방 입장 버튼
var start = document.getElementById("start"); //게임 시작 버튼
var ready = document.getElementById("ready"); //게임 준비완료 버튼
var nickName = document.getElementById("nick"); // 닉네임
var rmCodeTxt = document.getElementById("roomcode"); // 입력받은 룸 코드
let adminCode = document.getElementById("adminCode");
let slot = document.querySelectorAll(".slot");
let admin = document.getElementById("admin");
let ids;
var roomId = '';
var a = 1;
var myId;
var socket = io();
let players = [];        //id가 인덱스
let playermap = [];      //순차적인 인덱스 
let playerinfo;          // 게임에 쓸 플레이어 정보
let finalscore;          // 마지막 라운드에 전송할 점수 변수(게임이 종료될 때마다 그 게임에서의 점수 누적)
let sortedScore = [];
let readyCount = 0;

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

ready.addEventListener('click', function () {
  socket.emit('ready', myId)
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
  
  start.style.display = 'none';
  ready.style.display = 'block';
})

socket.on('joinsuccess', (data)=>{
  adminCode.innerText = data.roomcode;
  addPlayer(data.usernick, data.userid);
})


socket.on('joinfail', ()=>{
  alert('올바른 코드를 입력해주세요!');
  toggleRoom();
  toggleRoom2();
  
  start.style.display = 'block';
  ready.style.display = 'none';
})

start.addEventListener("click", function () {
  if(readyCount == 0) return;
  else if(readyCount == ids.Length - 1)
    socket.emit('startgame', myId);
  else return;
})

cancelBtn.addEventListener("click",function () {
  socket.emit("matchcancel", myId);
  removePlayer(myId);
  console.log('나가기 눌림');
})

socket.on('matchfail', function(data) {
 document.getElementById('match-text').innerText = "매칭 중인 인원이 없습니다.";
})

socket.on('레디유저', function(Id) {
  ids = document.querySelectorAll('.in_slot_hide');
  console.log(ids[1].innerText);
  for (let i = 0; i < ids.length; i++) {
    if(ids[i].value == Id)
    {
      console.log(Id);
      if(slot[i].style.background == "#FFF"){
        slot[i].style.background == "#151515";
        readyCount++;
      }
      else {
        slot[i].style.background == "#FFF";
        readyCount--;
      }
    }
  }
})

socket.on('user_id', function(data){
  myId = data;
})

socket.on('playerinit', function(data) {
  playerinfo = data;
  console.log(playerinfo[0]);
})

socket.on('gamestart', function(data) {
  const { game } = data;
  const arr = ['ox','surviv','flipover'];
  if(arr.includes(game)) $('#main').load(`/${game}`);
  else  // result인 경우
  {
    let index = getMyIndex(myId);
    socket.emit('calc-score', {
      id : myId,
      score : playerinfo[index].score
    });
  }
})
// 클라이언트
// 게임 내에서만 쓰는 score 변수를 사용 > 게임이 끝날 시 players[myId].score += score 변수

socket.on('go-result', (data) => {
  sortedScore = data.sort((a,b) => {
    return b.score - a.score;
  });
  $('#main').load('/result');
})

socket.on('leave_user', (data)=>{
  removePlayer(data);
})

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

let result = document.getElementById('result');

result.addEventListener('click', ()=>{
  $('#main').load(`/result`);
  console.log("결과 창 로드 완료");
});

function toggleMatch()
	{
  var x = document.getElementById("match");
  if (x.style.display === "block") {
    x.style.display = "none";
 document.getElementById('match-text').innerText = "상사 뒤통수에 사직서 때리는 상상 중....";
  } else {
    x.style.display = "block";
  }
}

function getMyIndex(id) {
  let index;
  for(let i = 0; i < playerinfo.length; i++) {
      if(playerinfo[i].id == myId)
      { 
        index = i;
        break;
      }
    }
  return index;
}