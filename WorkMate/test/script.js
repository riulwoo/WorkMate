var     x = window.innerWidth/2,
        y = window.innerHeight/2,
		ans = true;

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

function gameLoop(){
  var div = document.querySelector('.move')
  div.style.left = x+'px'
  div.style.top = y+'px'
	checkAnswer();
  window.requestAnimationFrame(gameLoop)
}
window.requestAnimationFrame(gameLoop)