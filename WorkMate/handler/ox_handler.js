var { question, question_answer: answer } = require("./data_quiz");
const userroom = require("./class_room");

const BREAK_DUR_TIME = 4000; // 퀴즈와 퀴즈 사이의 대기 시간    (ms)
const QUIZ_DUR_TIME = 6000; // 문제 출력 후 퀴즈 진행 시간      (ms)
const CHECK_DUR_TIME = 990; // 퀴즈를 풀고 난 뒤 정답 체크 시간  (ms)
const quiz_num = [1, 2, 3, 4, 5, 6, 7]; //문제 수
module.exports = (io, socket, room) => {
  function random_quiz(ms, Index) {
    var quiz_index = Math.floor(Math.random() * question.length);
    while (true) {
      if (room[Index].cur_quiz_index.includes(quiz_index)) {
        quiz_index = Math.floor(Math.random() * question.length);
      } else if (!room[Index].cur_quiz_index.includes(quiz_index)) {
        if (ms == 4000) {
          return answer[quiz_index];
        }
        if (ms == 990) {
          room[Index].cur_quiz_index.push(quiz_index);
          return question[quiz_index];
        }
      }
    }
  }

  const oxcycle = (ms, Index) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (ms == 6000) {
          //2
          io.to(room[Index].roomCode).emit("ox_checking", { check_time: 1 });
          resolve(ms);
        } else if (ms == 4000) {
          //1
          io.to(room[Index].roomCode).emit("ox_during", {
            during_time: 6,
            _answer: random_quiz(ms, Index),
          });
          resolve(ms);
        } else if (ms == 990) {
          //3
          io.to(room[Index].roomCode).emit("ox_breaking", {
            break_time: 4,
            _question: random_quiz(ms, Index),
          });
          resolve(ms);
        }
      }, ms);
    });
  };

  const cycle = async (Index) => {
    console.log(`퀴즈 체크 배열1 : ${room[Index].cur_quiz_index.length}`);
    const isbreak = await oxcycle(BREAK_DUR_TIME, Index);
    console.log(`퀴즈 체크 배열2 : ${room[Index].cur_quiz_index.length}`);
    const isduring = await oxcycle(QUIZ_DUR_TIME, Index);
    console.log(`퀴즈 체크 배열3 : ${room[Index].cur_quiz_index.length}`);
    const ischeck = await oxcycle(CHECK_DUR_TIME, Index);
  };

  const quiz_cycle = async (Index) => {
    console.log("퀴즈 사이클 진입");
    for await (var value of quiz_num) {
      // 2번돔
      console.log("for await of 진입");
      await cycle(Index);
      console.log(`퀴즈 사이클 실행 횟수 : ${value}`);
    }
  };
  // break > during > check
  socket.on("쥰비완료쓰", (id) => {
    let Index = room.findIndex((e) => e.userid.includes(id));
    if (Index !== -1) {
      room[Index].cnt += 1;
      if (room[Index].cnt == room[Index].players.length) {
        io.to(room[Index].roomCode).emit("ox_breaking", {
          break_time: 4,
          _question: random_quiz(990, Index),
        });
        quiz_cycle(Index);
        room[Index].cnt = 0;
        var end_timer = (quiz_num.length * 10 + quiz_num.length) * 1046;
        setTimeout(() => {
          io.to(room[Index].roomCode).emit("ox_end");
          end_timer = 0;
        }, end_timer);
      }
    }
  });

  //------------------------------------------ transball -------------------------------------------------
  // 클라emit 트랜스볼 없어짐 > on 트랜스볼 삭제
// 클라emit트랜스볼 맞음 > on 맞춤
// 클라emit 트랜스볼 생성 > on 트랜스볼 씀
  socket.on("트랜스볼 생성", (data) => {
    const { x, y, direction, id } = data;
    let index = room.findIndex((e) => e.userid.includes(id));
    io.to(room[index].roomCode).emit("트랜스볼 씀", {
      x : x,
      y : y,
      direction : direction,
      id : id
    })
  })

  socket.on("맞춘 사람의 위치1" , (data) => {
      io.sockets.to(data.id).emit("맞춘 사람의 위치2", {
        x : data.x,
        y : data.y
      })
  })
  
  socket.on("트랜스볼 없어짐", (data) => {
    const {id, i} = data;
    let index = room.findIndex((e) => e.userid.includes(id));
    io.to(room[index].roomCode).emit("트랜스볼 삭제", i);
  })

  socket.on("트랜스볼 맞음", (data) => {
    io.sockets.to(data.id).emit("트랜스볼 맞춤", {
      x : data.x,
      y : data.y,
      id : socket.id
    })
  })
};
