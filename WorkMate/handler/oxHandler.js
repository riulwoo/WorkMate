var {question, answer} = require('./data_quiz');
const userroom = require("./class_room");

const BREAK_DUR_TIME = 3999; // 퀴즈와 퀴즈 사이의 대기 시간    (ms)
const QUIZ_DUR_TIME = 5999; // 문제 출력 후 퀴즈 진행 시간      (ms)
const CHECK_DUR_TIME = 999; // 퀴즈를 풀고 난 뒤 정답 체크 시간  (ms)

module.exports = (io, socket, room) => {
  
  const oxcycle1 = (ms, Index)=>{
    return new Promise((resolve)=>
      setTimeout(()=>{
        if(ms == 5900)      io.to(room[Index].roomCode).emit('ox_breaking', {break_time : 4, question : "강민성 바보"});
        else if(ms == 3900) io.to(room[Index].roomCode).emit('ox_during', {during_time : 6, answer : true});
        else if(ms == 900)  io.to(room[Index].roomCode).emit('ox_checking', {check_time : 1});
        resolve(ms);
      },ms)
    );
  };

  const cycle1 = async (Index)=>{
    const isbreak = await oxcycle1(BREAK_DUR_TIME, Index);
    const isduring = await oxcycle1(QUIZ_DUR_TIME, Index);
    const ischeck = await oxcycle1(CHECK_DUR_TIME, Index);
  };

  socket.on('쥰비완료쓰', (id)=>{
    let userRoomIndex = room.findIndex(e => e.userid.includes(id));
    if (userRoomIndex !== -1) {
      room[userRoomIndex].cnt += 1;
      let player = room[userRoomIndex].players;
      if(room[userRoomIndex].cnt == player.length) {
          io.to(room[userRoomIndex].roomCode).emit('ox_breaking');
          cycle1(userRoomIndex);
      }
    }
  })
}



