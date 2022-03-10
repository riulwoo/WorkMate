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

var userpool = [1,2,3,4];                        // 총 인원
var matchinguser = [3,4];                    // 게임참여인원은 빠짐
var userinfo = {};

class userroom{  // 유저룸 : 매칭중인 유저들의 정보를 저장하는 곳
  // 생성된 유저룸의 길이가 조건에 만족할 시 새로운 유저룸 객체를 생성
  var userlist[6] = null;                   // 현재 잡힌 방  
  let users = userlist.length;
  function name(params) {
      return users;
  }
}
// 값을 어따가 저장해놓으며 얼마나 저장이될까
// 보관되있는 값을 어떻게 반환할것인가
// 마지막 라운드에 애들 다 결과화면 보내고 delete되게 해야함 > 

let newroom = new userroom;

function match(params) {
  // 만약 newroom.userlist가 다 찼다면
  let newroom = new userroom;
  
}

function joinGame(socket){
    let player = new PlayerBall(socket);

    newroom.userpool.push(player);
    newroom.matchinguser.push(player); 
    newroom.userinfo[socket.id] = player;

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
        setInterval(MatchTimer(Timer, matchuser), 1000);
        socket.emit('gamestart', {
            Timer: Timer
        });
    })
})

//1.socket.on에서 초마다 반복 실행이 안되는 점 -해결 
//2.matchtimer 함수에서 메시지 전송이 안되는 점 

// 클라이언트에서 접속했다고 소켓만들어서 서버에 전달
// 매칭을 누르면 매칭 메시지 전달 
// 나중----------------------------------------------
// 방만든다는 변수하나 만들어서 같이전달
// socket.emit('matching',socket.id, room = false)
//--------------------------------------------------
// userroom 객체 생성 > 6명이 다 차면 > 객체 따로 생성 = 매칭
// 랜덤으로 화면전환
// 라운드별 점수계산
// 탈락화면 전환
// 
//--------------------------------------------------
// 1. 1클라 입장 -> 매칭 버튼 - >  매칭중 -> 서버에서 유저풀 인원 체크
// 2. 2클라 입장 -> 서버유저풀 추가 -> 매칭중


// 
// 유저룸 배열에서 매칭 취소를 누른 사람이 있다면 배열 내의 취소를 누른 사람의 정보를 null로 입력
// 다른 유저가 들어오면 0인지 먼저 체크한후에 있다면 0 자리에 배치 , 없다면 뒤에 배치