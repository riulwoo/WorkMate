const [question, answer] = require('./data_quiz');
const userroom = require("./class_room");
const mainHandlers = require('./handler/mainHandler');

// 타이머 문제
// 근우쿤은 OX게임에 사용할 타이머코드를 작성하려한다.
// 7문제동안 준비시간, 문제시간, 체킹시간을 나누어 게임을 진행하려 한다.
// 이 코드를 작성하시오

module.exports = (io, socket, room) => {
  
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      
    }) 
    // breaking메시지 보내는 코드 5.9초후에
    // during 메시지를 보내는 코드 3.9초후에
    // checking 메시지를 보내는 코드 
  }) 
  
  socket.on('쥰비완료쓰', (id)=>{
    let userRoomIndex = getRoomIndex(id);
    if (userRoomIndex !== -1) {
      room[userRoomIndex].cnt += 1;
      let player = room[userRoomIndex].players;
      if(room[userRoomIndex].cnt == player.length) {
          io.to(room[userRoomIndex].roomCode).emit('ox_breaking');
        
      }
    }
  })
}



const QUIZ_DUR_TIME = 5.9; // 문제 출력 후 퀴즈 진행 시간
const BREAK_DUR_TIME = 3.9; // 퀴즈와 퀴즈 사이의 대기 시간
const CHECK_DUR_TIME = 0.9; // 퀴즈를 풀고 난 뒤 정답 체크 시간