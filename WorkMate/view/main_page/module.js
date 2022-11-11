// 방만들기 > 레디유저 최신화
function readyUpdate(rIndex) {
  let slotId = document.querySelectorAll(".in_slot_hide");
  let arrId = Array.prototype.slice.call(slotId);
  for (var i = 0; i < 6; i++) {
    if (rIndex.includes(arrId[i].innerHTML))
      slot[i].style.backgroundColor = "rgb(255, 245, 85)";
  }
}

// 방나가기 > 슬롯 초기화
function removeAllPlayer() {
  for (let i = 0; i < slot.length; i++) {
    while (slot[i].hasChildNodes()) {
      slot[i].firstChild.remove();
    }
    slot[i].style.backgroundColor = "rgb(255, 255, 255)";
  }
  userCount = 0;
  readyCount = 0;
}

// 방나가기 > 슬롯 초기화
function slotClear() {
  for (let i = 0; i < 6; i++) {
    while (slot[i].hasChildNodes()) {
      slot[i].firstChild.remove();
    }
    slot[i].style.backgroundColor = "rgb(255, 255, 255)";
  }
}

// 방장 나가기 후 방장 부여
function checkLeader() {
  let leader = document.getElementById("admin");
  if (!leader.hasChildNodes()) {
    slotClear();
    roomUpdate();
    if (idArr[0] == myId) {
      start.style.display = "inline";
      ready.style.display = "none";
      readyCount = 0;
    }
  }
}

// 랜덤 닉네임 생성기
function randomNick() {
  nick =
    nickName.value == null ||
    nickName.value == undefined ||
    nickName.value == "" ||
    nickName.value.replace(" ", "") == ""
      ? "Player " + Math.floor(Math.random() * 100 + 1)
      : nickName.value.substr(0, 10);
}

//유저 입장 시 데이터 삽입
function addPlayer(nickName, userid) {
  nickArr = nickName.length > 2 ? nickName.filter((e) => e != null) : nickName;
  idArr = userid.length > 2 ? userid.filter((e) => e != null) : userid;
  roomUpdate();
  userCount = idArr.length;
}

//방 만들기 / 입장 > 슬롯 업데이트
function roomUpdate() {
  for (let i = 0; i < nickArr.length; i++) {
    while (slot[i].hasChildNodes()) {
      slot[i].firstChild.remove();
    }
    let name = document.createElement("div");
    let img = document.createElement("div");
    let hide = document.createElement("div");
    let titlediv = document.createElement("div");
    let idcarddiv = document.createElement("div");
    let hidedId = document.createTextNode(idArr[i]);
    let Node = document.createTextNode(nickArr[i]);
    let title = document.createTextNode("유한주식회사");
    let idcard = document.createTextNode("사원증");
    hide.classList.add("in_slot_hide");
    img.classList.add("in_slot_img");
    name.classList.add("in_slot_name");

    titlediv.appendChild(title);
    idcarddiv.appendChild(idcard);
    hide.appendChild(hidedId);
    name.appendChild(Node);
    slot[i].appendChild(titlediv);
    slot[i].appendChild(img);
    slot[i].appendChild(name);
    slot[i].appendChild(idcard);
    slot[i].appendChild(hide);
  }
}

//방 유저 퇴장 시 해당 슬롯 초기화
function removePlayer(id) {
  try {
    let slotId = document.querySelectorAll(".in_slot_hide");
    let arrId = Array.prototype.slice.call(slotId);
    let i = arrId.findIndex((e) => e.innerHTML == id);
    let color = window.getComputedStyle(slot[i]).backgroundColor;
    console.log(color);
    if (color == "rgb(255, 245, 85)") {
      slot[i].style.backgroundColor = "rgb(255, 255, 255)";
      readyCount--;
    }
    while (slot[i].hasChildNodes()) {
      slot[i].firstChild.remove();
    }
  } catch (e) {
    console.log(e);
  }
  userCount = idArr.length;
}

//방 생성 시 랜덤 코드 생성
function randomCode() {
  return (new Date().getTime() + Math.random())
    .toString(36)
    .substring(2, 7)
    .toUpperCase();
}

//매칭 시작
function match() {
  roomId = randomCode();
  randomNick();
  socket.emit("matchStart", {
    id: myId,
    roomid: roomId,
    nick: nickName,
    score: 0,
  });
  console.log("매치 시작 보냈다?");
  matchTimer = setTimeout(() => {
    socket.emit("matchtimeover", myId);
  }, 15000);
}

// 방만들기
function toggleRoom() {
  var x = document.getElementById("room");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

// 입장하기
function toggleRoom2() {
  var x = document.getElementById("room2");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

// 매칭하기
function toggleMatch() {
  var x = document.getElementById("match");
  if (x.style.display === "block") {
    x.style.display = "none";
    document.getElementById("match-text").innerText =
      "상사 뒤통수에 사직서 때리는 상상 중....";
  } else {
    x.style.display = "block";
  }
}

//classroom Index 검색
function getMyIndex(id) {
  let index;
  for (let i = 0; i < playerinfo.length; i++) {
    if (playerinfo[i].id == myId) {
      index = i;
      break;
    }
  }
  return index;
}

// 캐릭터 이동 모션
function moveeffect(curPlayer) {
  let moveimage = Math.floor((curPlayer.cnt++ / 4) % 4);
  return moveasset[curPlayer.direction][moveimage];
}

// QR & 도움말
function toggle_display(id) {
  var qr = document.getElementById(id);

  if (qr.style.display != "block") {
    qr.style.display = "block";
  } else {
    qr.style.display = "none";
  }
}
