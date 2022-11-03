//<canvas id="joy"></canvas>
/**
var joy = document.getElementById("joy");
    joy.width = 300;
    joy.height = 300;
    joy.addEventListener("touchstart", down);
    joy.addEventListener("touchmove", move);
    joy.addEventListener("touchend", up);
    joy.addEventListener("mousedown", down);
    joy.addEventListener("mousemove", move);
    joy.addEventListener("mouseup", up);
    var myctx = joy.getContext("2d");
    myctx.lineWidth = 10;
    clearBackground();
    drawCircle(100, 100, 50, "rgb(255,000,051)");
    var startX, startY, moveX, moveY;
    var joyPos = joy.getBoundingClientRect();
    var onTouch = false;
    function down(event) {
      try {
        startX = Math.round(event.touches[0].clientX - joyPos.left);
        startY = Math.round(event.touches[0].clientY - joyPos.top);
      } catch{
        startX = Math.round(event.clientX - joyPos.left);
        startY = Math.round(event.clientY - joyPos.top);
      }
      onTouch = true;
    }

    var moveMax = 40;
    var msgPrev = "s";
    var msg = "s";

		
	
    function move(event) {
      if (onTouch) {
        try {
          moveX = Math.round(event.touches[0].clientX - joyPos.left) - startX;
          moveY = Math.round(event.touches[0].clientY - joyPos.top) - startY;
        } catch{
          moveX = Math.round(event.clientX - joyPos.left) - startX;
          moveY = Math.round(event.clientY - joyPos.top) - startY;
        }

        if (moveX > moveMax) moveX = moveMax;
        else if (moveX < -moveMax) moveX = -moveMax;
        if (moveY > moveMax) moveY = moveMax;
        else if (moveY < -moveMax) moveY = -moveMax;

        clearBackground();
        drawCircle(100 + moveX, 100 + moveY, 50, "rgb(255,000,051)");

        if (moveX >= 40) {
          rightPressed = true;
          leftPressed = false;
        } else if (moveX <= -40) {
          rightPressed = false;
          leftPressed = true;
        } else {
          rightPressed = false;
          leftPressed = false;
        }

        if (moveY >= 40) {
          upPressed = false;
          downPressed = true;
        } else if (moveY <= -40) {
          upPressed = true;
          downPressed = false;
        } else {
          upPressed = false;
          downPressed = false;
        }

        if (msg != msgPrev) {
          send(msg);
          msgPrev = msg;
        }
      }
			else {
          rightPressed = false;
          leftPressed = false;
          upPressed = false;
          downPressed = false;
			}
    }

    function up() {
      clearBackground();
      drawCircle(100, 100, 50, "rgb(255,000,051)");
      msg = "s";
      msgPrev = "s";
      onTouch = false;
			send(msg);
    }

    function send(msg) {
      console.log(msg);
    }

    function clearBackground() {
      myctx.clearRect(0, 0, joy.width, joy.height);
      myctx.beginPath();
      myctx.strokeStyle = "rgb(153,000,051)";
      myctx.arc(100, 100, 90, 0, 2 * Math.PI);
      myctx.stroke();
    }

    function drawCircle(x, y, r, c) {
      myctx.beginPath();
      myctx.fillStyle = c;
      myctx.arc(x, y, r, 0, 2 * Math.PI);
      myctx.fill();
    }
*/