

// wasd
var up = false,
    right = false,
    down = false,
    left = false,
    x = window.innerWidth/2,
    y = window.innerHeight/2,
		ans = true;
document.addEventListener('keydown',press);
document.getElementById("btn1").addEventListener('click',hello);

function checkAnswer() {
	ans = x <= window.innerWidth/2 ? true : false;

	var div = document.querySelector('#selection')
	
	if (ans) {
		div.innerText="현재 선택: O";
	} else {
		div.innerText="현재 선택: X";
	}
}

function hello() {
  if (ans) {
		location.href = "result.html?1"
	} else {
		location.href = "result.html?0"
	}
}

function press(e){
  if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 90 /* z */){
    up = true
  }
  if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */){
    right = true
  }
  if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */){
    down = true
  }
  if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 81 /* q */){
    left = true
  }
}
document.addEventListener('keyup',release)
function release(e){
  if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 90 /* z */){
    up = false
  }
  if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */){
    right = false
  }
  if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */){
    down = false
  }
  if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 81 /* q */){
    left = false
  }
}
function gameLoop(){
  var div = document.querySelector('.move')
  if (up){
    y = y - 10
  }
  if (right){
    x = x + 10
  }
  if (down){
    y = y + 10
  }
  if (left){
    x = x - 10
  }
  div.style.left = x+'px'
  div.style.top = y+'px'
	checkAnswer();
  window.requestAnimationFrame(gameLoop)
}
window.requestAnimationFrame(gameLoop)