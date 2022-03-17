// 코드 마켓

function renderClearMessage(){
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.font = '50px Arial';
    ctx.fillText(`Stage ${stage-1} Clear!!`,1024/2-150, 730-50);
    ctx.fillText(`The next stage will start shortly.`,1024/2-350, 730);
    ctx.closePath();
}

function start(){
    if(!isStart){
        socket.emit('start', { id: myId, stage : stage, waiting : false, isStart : true});
    }
}

socket.on('start_game', function(){
    isStart = true;
    let bgm = document.getElementById("bgm");
    bgm.volume = 0.3;
    bgm.play();
})

let stageClear = false;
        socket.on('stage_clear',function(data){//스테이지 하나가 끝난 상태
            stageClear = true;
            enemys.length = 0;
            straightEnemys.length = 0;
            items.length = 0;
            for (var i = 0 ; i < balls.length ; i++){
                if( balls[i].getState() == 0){
                    balls[i].setX(1024/2);
                    balls[i].setY(768/2);
                    balls[i].setState(1);
                }
            }

            isStart = false;
            socket.emit('start', { id: myId, stage : stage, waiting : true});//웨이팅 스테이지로 이동
            stage = data.stage;//스테이지 1 업 시켜주기
        })
        socket.on('end_waiting', function(){//웨이팅이 끝난상태
            timer = 15;
            stageClear = false;
            isStart = false;
            socket.emit('start', { id: myId, stage : stage, waiting : false});            
        })

        socket.on('game_over', function(data){ //전 플레이어가 죽으면 나오는 이벤트
            if (data.isFail){
                stage = 1;
                Swal.fire({
                    title: "게임 알림",
                    text: "교수님이 이겼습니다.",
                    confirmButtonText: "아니..",
                    confirmButtonColor: '#FC5296'
                }).then((result)=> {

                    location.href= "/bad";
                })
            }
        })

        socket.on('game_win', function(data){
            stage = 1;
            Swal.fire({
                title: "게임 알림",
                text: "당신이 이겼습니다! 축하드립니다.",
                confirmButtonText: "확인",
                confirmButtonColor: '#FC5296'
            }).then((result) => {
                location.href= "/good";
            })
        })

        function enterGame(){
            var enter = document.getElementById('enter').value
            if(enter.length === 0){
                Swal.fire({
                    title: "게임 알림",
                    text: "닉네임을 입력해주세요",
                    confirmButtonText: "네",
                    confirmButtonColor: '#FC5296'
                });
            }else if( enter.length < 2 || enter.length > 9 ){
                Swal.fire({
                    title: "게임 알림",
                    text: "닉네임은 최소 2자에서 최대 8자 입니다.",
                    confirmButtonText: "네",
                    confirmButtonColor: '#FC5296'
                });
            }else{
                localStorage.setItem("nickName", enter);
                location.href= "/game"
            }
        
        
        }

        function renderPlayers(){
            let curPlayer = ballMap[myId];
            for (let i = 0; i < balls.length; i++) {
                    let ball = balls[i];
                    if (ball.getState() == 0){
                        continue
                    }
                    ctx.beginPath();
                    ctx.fillStyle = ball.getColor();
                    ctx.arc(ball.getX(), ball.getY(), ball.getRadius(), 0, Math.PI * 2, false);
                    ctx.fill();
                    ctx.closePath();

                    if( ball == curPlayer){

                        ctx.beginPath();
                        ctx.font = '15px Arial';
                        ctx.fillText(`${nickName}`,ball.getX()- ball.getRadius()-7, ball.getY() - ball.getRadius());
                        ctx.closePath();
                    }else{
                        ctx.beginPath();
                        ctx.font = '15px Arial';
                        ctx.fillText(`player${i}`,ball.getX()- ball.getRadius()-7, ball.getY() - ball.getRadius());
                        ctx.closePath();
                    }
                }
                
                if (rightPressed){
                    if (curPlayer.getX() <= 1024 - curPlayer.getRadius()){
                        curPlayer.setX(curPlayer.getX() + curPlayer.getPlayerSpeed());
                    }
                }
                if (leftPressed ){
                    if(curPlayer.getX() >= 0 + curPlayer.getRadius()){
                        curPlayer.setX(curPlayer.getX() - curPlayer.getPlayerSpeed());
                    }
                }
                if(upPressed ){
                    if(curPlayer.getY() >= 0 + curPlayer.getRadius()){
                        curPlayer.setY(curPlayer.getY() - curPlayer.getPlayerSpeed());
                    }
                }
                if(downPressed ){
                    if(curPlayer.getY() <= 768 - curPlayer.getRadius()){
                        curPlayer.setY(curPlayer.getY() + curPlayer.getPlayerSpeed());
                    }
                }
        }

        let timer = 15.00;
        function renderTimer(){
            ctx.beginPath();
            ctx.fillStyle = '#000000';
            ctx.font = '20px Arial';
            ctx.fillText(`Timer ${timer.toFixed(2)}`,30,50);
            ctx.closePath();

        }