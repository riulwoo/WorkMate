var {question, question_answer : answer} = require('./data_quiz');
const userroom = require("./class_room");

const BREAK_DUR_TIME = 3999; // 퀴즈와 퀴즈 사이의 대기 시간    (ms)
const QUIZ_DUR_TIME = 5999; // 문제 출력 후 퀴즈 진행 시간      (ms)
const CHECK_DUR_TIME = 999; // 퀴즈를 풀고 난 뒤 정답 체크 시간  (ms)
module.exports = (io, socket, room) => {

  function random_quiz(ms, Index) {
    var quiz_index = Math.floor(Math.random() * question.length);
    while(true) {
      if(room[Index].cur_quiz_index.length == 1) {
        room[Index].cur_quiz_index.push(quiz_index);
        return answer[quiz_index];
      }
      else if(room[Index].cur_quiz_index.includes(quiz_index))
      {
        quiz_index = Math.floor(Math.random() * question.length);
      }
      else if(!(room[Index].cur_quiz_index.includes(quiz_index))){
        if(ms == 3999) {
          room[Index].cur_quiz_index.push(quiz_index);
          return answer[quiz_index];
        }
        if(ms == 999) {
          room[Index].cur_quiz_index.push(quiz_index);
          return question[quiz_index];
        }
      }
    }


  }
  
  const oxcycle1 = (ms, Index)=>{
    return new Promise((resolve, reject)=> {
      setTimeout(()=>{
        if(ms == 5999)      {
          io.to(room[Index].roomCode).emit('ox_checking', {check_time : 1});
          resolve(ms);
          console.log("6초 메시지 전송");
        }
        else if(ms == 3999) {
          io.to(room[Index].roomCode).emit('ox_during', {during_time : 6, _answer : random_quiz(ms, Index)});
          resolve(ms);
          console.log("4초 메시지 전송");
        }
        else if(ms == 999)  {
          io.to(room[Index].roomCode).emit('ox_breaking', {break_time : 4, _question : random_quiz(ms, Index)});
          resolve(ms);
          console.log("1초 메시지 전송");
        }else { reject(new Error("fail"))}
      },ms);
    })
  };

  const cycle1 = async (Index)=>{
    const isbreak = await oxcycle1(BREAK_DUR_TIME, Index)
    .then((data) => {console.log(`4초 결과 : ${data}`);} , 
    (Error) => {console.log(`4초 에러 : ${Error}`)})
    const isduring = await oxcycle1(QUIZ_DUR_TIME, Index)
    .then((data) => {console.log(`6초 결과 : ${data}`);} ,
    (Error) => {console.log(`6초 에러 : ${Error}`)})
    if(room[Index].cur_quiz_index.length <= 8) {
      const ischeck = await oxcycle1(CHECK_DUR_TIME, Index)
      .then((data) => {console.log(`1초 결과 : ${data}`);} ,
      (Error) => {console.log(`1초 에러 : ${Error}`)})
    }else o.to(room[Index].roomCode).emit('ox_end')
  };

  socket.on('쥰비완료쓰', (id)=>{
    let Index = room.findIndex(e => e.userid.includes(id));
    if (Index !== -1) {
      room[Index].cnt += 1;
      let player = room[Index].players;
      if(room[Index].cnt == player.length) {
          io.to(room[Index].roomCode).emit('ox_breaking', {break_time : 4, _question : random_quiz(999, Index)});
          cycle1(Index)
      }
    }
  })
}



