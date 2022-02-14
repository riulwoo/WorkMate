//server.js
const app = require('http').createServer(handler);
const io = require('socket.io')(app);
const fs = require('fs');

app.listen(8000);

function handler (req, res) {
    fs.readFile(__dirname + '/views/index.html', function( err, data) {
        if(err){
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
    });
}

function getPlayerColor(){
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}


const startX = 1024/2;
const startY = 768/2;

class PlayerBall{
    constructor(socket){
        this.socket = socket;
        this.x = startX;
        this.y = startY;
        this.score = 0;
        this.nick = "player";
        this.color = getPlayerColor(); // 백그라운드 이미지로 대체
    }

    get id() {
        return this.socket.id;
    }
}

var userpool = [];  // 총 인원
var matchinguser = [];                    // 게임참여인원은 빠짐
var userinfo = {};


class userroom{
    constructor(){
        player1
        player2
        player3
        player4
        player5
        player6
    }
}

function joinGame(socket){
    let player = new PlayerBall(socket);

    userpool.push(player);
    matchinguser.push(player); 
    userinfo[socket.id] = player;

    return player;
}

function endGame(socket){
    for( var i = 0 ; i < userpool.length; i++){
        if(userpool[i].id == socket.id){
            userpool.splice(i,1);
            break
        }
    }
    delete userinfo[socket.id];
}




io.on('connection', function(socket) {
    console.log(`${socket.id}님이 입장하셨습니다.`);

    socket.on('disconnect', function(reason){
        console.log(`${socket.id}님이 ${reason}의 이유로 퇴장하셨습니다. `)
        endGame(socket);
        socket.broadcast.emit('leave_user', socket.id);
    });

    let newplayer = joinGame(socket);
    socket.emit('user_id', socket.id);

    for (var i = 0 ; i < userpool.length; i++){
        let player = userpool[i];
        socket.emit('join_user', {
            id: player.id,
            x: player.x,
            y: player.y,
            color: player.color,
        });
    }

    socket.broadcast.emit('join_user',{
        id: socket.id,
        x: newplayer.x,
        y: newplayer.y,
        color: newplayer.color,
    });

    socket.on('send_location', function(data) {
            socket.broadcast.emit('update_state', {
                id: data.id,
                x: data.x,
                y: data.y,
            })
    })

    socket.on('matching', function(){
        if(matchinguser.length == 1)
        let Timer = 30;
        let matchuser = matchinguser.length;
        setInterval(MatchTimer(Timer, matchuser),1000)
        socket.emit('gamestart', {
            Timer: Timer
        });
    })
})


// 타이머 함수
function MatchTimer(timer, matchuser){
    // 타이머 변수, 타이머 줄어드는 기능, 유저풀 체크 로직, 클라이언트에 메시지전달, 화면전환
    // 1명일때부터 타이머가 돌아가는데 2명일때는 타이머변수가 변하지않음 방장이 나가도 타이머는 돌아간다
    
    // 타이머 줄어드는 기능
    
    // 매칭중인 유저들 수 체크

    // 클라이언트에 메시지전달과 화면전환

    if(timer == 0 && matchuser >= 2)
    // 랜덤으로 게임 화면 전환
    matchinguser의 내용 지우기
    sendFile(__dirname + '/views/index.html')
    if(matchuser == 6)
    // 랜덤으로 게임 화면 
    matchinguser의 내용 지우기
    sendFile(__dirname + '/views/index.html')
    clearInterval
}